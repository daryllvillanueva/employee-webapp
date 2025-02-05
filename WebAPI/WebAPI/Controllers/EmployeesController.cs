using Microsoft.AspNetCore.Mvc;
using WebAPI.Data;
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
        public IActionResult GetAllEmployees(int page = 1, int pageSize = 5)
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
    }
}
