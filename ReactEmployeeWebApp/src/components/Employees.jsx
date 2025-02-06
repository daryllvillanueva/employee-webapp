import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import PageLayout from './partials/PageLayout';
import { Pagination, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import {  
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Card,
  CardContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/user";

import { MoreVertical } from "lucide-react";
import { MdEmail } from "react-icons/md";
import { BiSolidPhone } from "react-icons/bi"

const Employees = () => {
  const [employee, setEmployee] = useState([]); // Default as an empty array
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const pageIndex = parseInt(queryParams.get('page') || '1', 10);
  const pageSize = 6;

  useEffect(() => {
    const fetchEmployee = async (page) => {
      try {
        const response = await fetch(`https://localhost:7111/Employees?page=${page}&pageSize=${pageSize}`, {
          method: 'GET'
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch employees. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setEmployee(data.employees); 
        setTotalPages(data.totalPages);
      } 
      catch (error) {
        console.error("Error fetching data:", error);
        setError("The backend is down. Please try again later.");
      }
    };

    fetchEmployee(pageIndex);

  }, [pageIndex]);

  // Function to update the URL with the new page index
  const changePage = (newPageIndex) => {
    if (newPageIndex !== pageIndex) {
      navigate(`?page=${newPageIndex}`); // This will update the URL with the new pageIndex
    }
  };

  const renderPageNumbers = () => {
    const numPage = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, pageIndex - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      numPage.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              changePage(i); // Change page on click
            }}
            isActive={i === pageIndex} // Mark the current page as active
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  
    return numPage;
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpen(true); 
  };

  const handleCloseModal = () => {
    setOpen(false);  
  };

  const handleDelete = async (id) => {
    if (!deleteId) return;

    try {
      const response = await fetch(`https://localhost:7111/Employees/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete employee. Status: ${response.status}`);
      }

      setEmployee((prevEmployees) => prevEmployees.filter((emp) => emp.id !== id));

      handleCloseModal();

    } catch (error) {
      setError("An error occurred while deleting the employee.");
      handleCloseModal();
    }
  };

  return (
    <PageLayout>
      <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {employee.length === 0 ? (
          <div className="flex flex-col justify-center items-center col-span-full gap-5">
            <p className="text-center text-2xl text-gray-500">No employees found.</p>
            {error && <p className="text-red-500 text-2xl text-center mb-3">{error}</p>}
          </div>
        ) : (
          employee.map((employees) => (
            <Card key={employees.id} className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-w-xs">
              <div className="h-44 relative bg-gray-200 p-4 rounded-t-lg flex flex-col gap-2 dark:bg-slate-800 items-center">
                <div className="absolute top-3 right-3">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <MoreVertical className="w-5 h-5 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link to={`/employees/${employee.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(employees.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Avatar>
                  <AvatarImage src={employees.imageUrl || "https://github.com/shadcn.png"} />
                  <AvatarFallback>Profile</AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-lg">{employees.name}</h2>
                <p className="text-md text-muted-foreground">{employees.profession}</p>
              </div>
              <CardContent className="p-3">
                <div className="flex gap-2 items-center justify-between mb-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-md text-muted-foreground">Department</p>
                    <p className="text-md">{employees.department || "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-md text-muted-foreground">Hired Date</p>
                    <p className="text-md">{employees.createdAt ? format(new Date(employees.createdAt), 'MMMM dd, yyyy') : "N/A"}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2 justify-between'>
                  <div className="flex flex-col space-y-1">
                    <p className="flex items-center gap-2 text-md">
                      <MdEmail className="size-6" />
                      {employees.email || "N/A"}
                    </p>
                    <p className="flex items-center gap-2 text-md">
                      <BiSolidPhone className="size-6" />
                      {employees.phone || "N/A"}
                    </p>
                  </div>
                  <Link to={`/employees/${employees.id}`}>
                    <Button variant="outline" size="md">View Profile</Button>
                  </Link>
                </div>
                
              </CardContent>
            </Card>
          ))
        )}
      </section>
      {!error && !employee.length == 0 ?
        (
          <Pagination className="space-x-3">
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  if (pageIndex > 1) {
                    changePage(pageIndex - 1);
                  }
                }}
                disabled={pageIndex === 1}
              />
            </PaginationItem>
            {renderPageNumbers()}
            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  if (pageIndex < totalPages) {
                    changePage(pageIndex + 1);
                  }
                }}
                disabled={pageIndex === totalPages}
              />
            </PaginationItem>
          </Pagination>
        ) : ( null )
      }
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 font-semibold text-xl">Are you really sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-left text-md">
              This action cannot be undone. <br/>This will permanently delete the employee profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseModal}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  )
}

export default Employees