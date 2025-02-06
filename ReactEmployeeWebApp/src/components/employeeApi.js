// employeeService.js

const API_URL = 'https://localhost:7111/Employees';
const HOME_API_URL = 'https://localhost:7111/Home';

export const previewEmployees = async () => {
    try {
        const response = await fetch(HOME_API_URL, {
            method: 'GET'
        });
        if(!response.ok){
            throw new Error(`Failed to fetch employees. Status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
};

export const getAllEmployee = async (pageIndex, pageSize) => {
  try {
    const response = await fetch(`${API_URL}?page=${pageIndex}&pageSize=${pageSize}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch employees. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete employee. Status: ${response.status}`);
    }
    return id;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create employee. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const queryParams = new URLSearchParams({
      Name: employeeData.name,
      Email: employeeData.email,
      Phone: employeeData.phone,
      Department: employeeData.department,
      Profession: employeeData.profession,
      Salary: employeeData.salary,
    });

    const response = await fetch(`https://localhost:7111/Employees/${id}?${queryParams}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Ensure the content type is application/json
      },
      body: JSON.stringify(employeeData), // Send the employee data as JSON
    });

    if (!response.ok) {
      // If not 2xx, throw an error with response body
      const errorDetails = await response.json();
      console.error("Error details from server:", errorDetails);
      throw new Error("Failed to update employee data.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};


export const employeeProfile = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Failed to get employee. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting employee:", error);
    throw error;
  }
};
