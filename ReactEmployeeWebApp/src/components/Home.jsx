import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { format } from 'date-fns';
import PageLayout from './partials/PageLayout';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/user";

import { MoreVertical } from "lucide-react";
import { MdEmail } from "react-icons/md";
import { BiSolidPhone } from "react-icons/bi";
import { deleteEmployee, previewEmployees } from './employeeApi';

const Home = () => {
  const [employee, setEmployee] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await previewEmployees();
        setEmployee(data.employees || []); 
      } catch (error) {
        setError("The backend is down, Please try again later.");
      }
    };
    fetchEmployee();
  }, []);
  
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpen(true); 
  };
  
  const handleCloseModal = () => {
    setOpen(false);  
  };
  
  const handleDelete = async () => {
    if (!deleteId) return; 
    
    try {
      const response = await deleteEmployee(deleteId);
      
      setEmployee((prevEmployees) => prevEmployees.filter((emp) => emp.id !== deleteId));
      handleCloseModal();

    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("An error occurred while deleting the employee.");
      handleCloseModal();
    }

    const data = await previewEmployees();
    setEmployee(data.employees || []);
  };
  
  const handleEditClick = (id) => {
    navigate(`/employees/${id}/edit`);
  };
  

  return (
    <PageLayout>
      <section className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 p-2 max-w-6xl">
        {employee.length === 0 ? (
          <div className="flex flex-col justify-center items-center col-span-full gap-5">
            <p className="text-center text-2xl text-gray-500">No employees found.</p>
            {error && <p className="text-red-500 text-2xl text-center mb-3">{error}</p>}
          </div>
        ) : (
          employee.map((employees) => (
            <Card key={employees.id} className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="h-44 relative bg-gray-200 p-4 rounded-t-lg flex flex-col gap-2 dark:bg-slate-800 items-center">
                <div className="absolute top-3 right-3">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <MoreVertical className="w-5 h-5 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(employees.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(employees.id)}>
                        Delete
                      </DropdownMenuItem>
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
                    <Button variant="outline" size="default">View Profile</Button>
                  </Link>
                </div>
                
              </CardContent>
            </Card>
          ))
        )}
      </section>
      {!error && !employee.length == 0 ? 
        (
          <div className="mx-auto mt-4">
            <Link to="/employees">
              <Button variant="default" size="lg">View All Employees</Button>
            </Link>
          </div>
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
  );
};

export default Home;
