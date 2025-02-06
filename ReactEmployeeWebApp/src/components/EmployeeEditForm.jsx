import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from './partials/PageLayout';
import { employeeProfile, updateEmployee } from './employeeApi';
import { Input } from './ui/input';
import { Button } from './ui/user';

const EmployeeEditForm = () => {
  const { id } = useParams(); // Get employee ID from URL params
  const navigate = useNavigate(); // To navigate after form submission
  const [error, setError] = useState(null);

  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    department: '',
    salary: '',
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

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value, // Update the state with the new value for the corresponding field
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = await updateEmployee(id, employeeData); // Send updated data to API
      if (updatedData) {
        navigate(`/employees/${id}`); // Redirect to the employee's profile page
      }
    } catch (error) {
      setError("Failed to update employee data.");
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
              name="department"
              value={employeeData.salary}
              onChange={handleInputChange}
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
