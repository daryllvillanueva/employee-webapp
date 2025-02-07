import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate, Link } from 'react-router-dom';
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

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await employeeProfile(id); 
        setEmployeeData(data); 
      } catch (error) {
        setError("Failed to load employee data.");
        throw error;
      }
    };
    if (id) {
      fetchEmployee(); 
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'salary') {
      setEmployeeData((prevData) => ({
        ...prevData,
        [name]: Number(parseFloat(value).toFixed(2)) || 0
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
    const salaryValue = Number(parseFloat(value).toFixed(2));
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: salaryValue,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending data to API:", employeeData);
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
        <div className='flex justify-between mb-5'>
          <h1 className='text-2xl'>Edit Profile</h1>
          <Link to={`/employees/${employeeData.id}`}>
            <Button variant="outline" size="default">View Profile</Button>
          </Link>
        </div>
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
              step="0.01"
              min="0"   
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
