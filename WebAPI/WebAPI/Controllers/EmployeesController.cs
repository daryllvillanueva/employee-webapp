using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Models.Entities;

namespace WebAPI.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext employeeDb;

        public EmployeesController(ApplicationDbContext employeeDb)
        {
            this.employeeDb = employeeDb;
        }

        [HttpGet]
        public IActionResult GetAllEmployees(int page = 1, int pageSize = 6)
        {
            IQueryable<Employee> query = employeeDb.Employees;

            if (page < 1)
            {
                page = 1;
            }

            decimal count = query.Count();
            int totalPage = (int)Math.Ceiling(count / pageSize);
            query = query.Skip((page - 1) * pageSize).Take(pageSize);

            var allEmployee = query.ToList();

            return Ok(new { employees = allEmployee, totalPages = totalPage });
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetEmployeeById(int id)
        {
            var employee = employeeDb.Employees.Find(id);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);

        }

        [HttpPost]
        public IActionResult AddEmployee(AddEmployeeDto addEmployeeDto)
        {
            var employeeData = new Employee()
            {
                Name = addEmployeeDto.Name,
                Email = addEmployeeDto.Email,
                Department = addEmployeeDto.Department,
                Phone = addEmployeeDto.Phone,
                Profession = addEmployeeDto.Profession,
                CreatedAt = DateTime.Now,
            };

            var formattedCreatedAt = employeeData.CreatedAt.ToString("MMMM dd, yyyy");

            employeeDb.Employees.Add(employeeData);
            employeeDb.SaveChanges();

            return Ok(new { id = employeeData.Id, name = employeeData.Name, email = employeeData.Email, createdAt = formattedCreatedAt});
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateEmployee(int id, UpdateEmployeeDto updateEmployeeDto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var employee = await employeeDb.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            employee.Name = updateEmployeeDto.Name;
            employee.Email = updateEmployeeDto.Email;
            employee.Phone = updateEmployeeDto.Phone;
            employee.Department = updateEmployeeDto.Department;
            employee.Profession = updateEmployeeDto.Profession;
            employee.Salary = updateEmployeeDto.Salary;

            employeeDb.Employees.Update(employee);
            await employeeDb.SaveChangesAsync(); 

            return Ok(employee);
        }


        [HttpDelete]
        [Route("{id:int}")]
        public IActionResult DeleteEmployee(int id)
        {
            var employee = employeeDb.Employees.Find(id);

            if (employee == null)
            {
                return NotFound();
            }

            employeeDb.Employees.Remove(employee);
            employeeDb.SaveChanges();

            return Ok();

        }
    }
}
