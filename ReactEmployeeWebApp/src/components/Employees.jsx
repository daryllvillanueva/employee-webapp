import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import PageLayout from './partials/PageLayout';
import { Pagination, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
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

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const pageIndex = parseInt(queryParams.get('page') || '1', 10);
  const pageSize = 5;

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
        setError("An error occurred. Please try again later.");
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
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, pageIndex - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
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
  
    return pages;
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
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <MoreVertical className="w-5 h-5 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Avatar>
                  <AvatarImage src={employees.imageUrl || "https://github.com/shadcn.png"} />
                  <AvatarFallback>Profile</AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-lg">{employees.name}</h2>
                <p className="text-md text-muted-foreground">Project Manager</p>
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
    </PageLayout>
  )
}

export default Employees