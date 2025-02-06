import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout from './partials/PageLayout';
import { employeeProfile } from './employeeApi';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from "@/components/ui/user";
import { MdEmail } from "react-icons/md";
import { BiSolidPhone } from "react-icons/bi"

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await employeeProfile(id); 
        setEmployee(data);
      } catch (error) {
        setError("Failed to load employee data.");
      }
    };
    if (id) {
      fetchEmployee(); 
    }
  }, [id]); 

  return (
    <PageLayout>
      {employee.length === 0 || error ? (
        <div className="flex flex-col justify-center items-center col-span-full gap-5">
          <p className="text-center text-2xl text-gray-500">No employees found.</p>
          {error && <p className="text-red-500 text-2xl text-center mb-3">{error}</p>}
        </div>
      ) : ( 
      <section className='max-w-md w-full mx-auto'>
        <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-w-md">
          <div className="h-44 relative bg-gray-200 p-4 rounded-t-lg flex flex-col gap-2 dark:bg-slate-800 items-center">
            <Avatar>
              <AvatarImage src={"https://github.com/shadcn.png"} />
              <AvatarFallback>Profile</AvatarFallback>
            </Avatar>
            <h2 className="font-semibold text-lg">{employee.name}</h2>
            <p className="text-md text-muted-foreground">{employee.profession}</p>
          </div>
          <CardContent className="p-3">
            <div className="flex gap-2 items-center justify-between mb-2">
              <div className="flex flex-col gap-1">
                <p className="text-md text-muted-foreground">Department</p>
                <p className="text-md">{employee.department || "N/A"}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-md text-muted-foreground">Hired Date</p>
                <p className="text-md">{employee.createdAt ? format(new Date(employee.createdAt), 'MMMM dd, yyyy') : "N/A"}</p>
              </div>
            </div>
            <div className='flex items-center gap-2 justify-between'>
              <div className="flex flex-col space-y-1">
                <p className="flex items-center gap-2 text-md">
                  <MdEmail className="size-6" />
                  {employee.email || "N/A"}
                </p>
                <p className="flex items-center gap-2 text-md">
                  <BiSolidPhone className="size-6" />
                  {employee.phone || "N/A"}
                </p>
              </div>
              <Link to={`/employees`}>
                <Button variant="outline" size="sm" className="text-sm">Employees Section</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
      )}
    </PageLayout>
  );
};

export default EmployeeProfile;
