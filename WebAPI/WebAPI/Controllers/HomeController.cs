﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models.Entities;

namespace WebAPI.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ApplicationDbContext employeeDb;

        public HomeController(ApplicationDbContext employeeDb)
        {
            this.employeeDb = employeeDb;
        }

        [HttpGet]
        public IActionResult PreviewEmployees()
        {
            var preview = employeeDb.Employees.FromSqlRaw("EXEC GetTop5EmployeesByName").ToList(); 

            return Ok(preview);
        }

    }
}
