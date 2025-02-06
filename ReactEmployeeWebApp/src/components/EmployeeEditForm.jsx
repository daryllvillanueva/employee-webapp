import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from './partials/PageLayout';
import { employeeProfile, updateEmployee } from './employeeApi';
import { Input } from './ui/input';
import { Button } from './ui/user';

const EmployeeEditForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    department: '',
    salary: 0,
  });

  // Fetch employee data on mount
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await employeeProfile(id); // Fetch employee profile using the ID
        setEmployeeData(data); // Set data to form fields
      } catch (error) {
        setError("Failed to load employee data.");
        throw error;
      }
    };
    if (id) {
      fetchEmployee(); // Fetch data only if ID is present
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for salary field to ensure it's a number
    if (name === 'salary') {
      setEmployeeData((prevData) => ({
        ...prevData,
        [name]: parseFloat(value) || 0, // Convert to a number or default to 0
      }));
    } else {
      setEmployeeData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    const salaryValue = parseFloat(value).toFixed(2);
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: salaryValue,  // Keep salary as a number
    }));
  };
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending data to API:", employeeData); // Check the request body here
    try {
      const updatedData = await updateEmployee(id, employeeData); 
      if (updatedData) {
        navigate(`/employees/${id}`);
      }
    } catch (error) {
      setError("Failed to update employee data.");
      console.error("Update error:", error);
    }
  };
  
  return (
    <PageLayout>
      <section className='max-w-md w-full mx-auto p-5 border shadow-lg rounded-lg border-gray-200 dark:border-gray-700'>
        <h1 className='text-center text-2xl mb-3'>Edit Profile</h1>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <div className="space-y-1">
            <label>Name</label>
            <Input
              type="text"
              name="name"
              value={employeeData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label>Email</label>
            <Input
              type="email"
              name="email"
              value={employeeData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label>Phone</label>
            <Input
              type="text"
              name="phone"
              value={employeeData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label>Profession</label>
            <Input
              type="text"
              name="profession"
              value={employeeData.profession}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label>Department</label>
            <Input
              type="text"
              name="department"
              value={employeeData.department}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label>Salary</label>
            <Input
              type="number"
              name="salary"
              value={employeeData.salary}
              onChange={(e) => handleSalaryChange(e)}
              required
            />
          </div>
          <div className='flex justify-end'>
            <Button type="submit" variant="default" size="sm" className="text-sm">Submit</Button>
          </div>
        </form>
      </section>
      {error && <p className="text-red-500">{error}</p>}
    </PageLayout>
  );
};

export default EmployeeEditForm;
