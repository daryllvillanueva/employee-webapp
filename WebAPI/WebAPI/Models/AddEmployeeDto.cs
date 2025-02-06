using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    public class AddEmployeeDto
    {

        [Required(ErrorMessage = "Name is required.")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Phone number is required.")]
        public required string Phone { get; set; }

        [Required(ErrorMessage = "Department is required.")]
        public required string Department { get; set; }

        [Required(ErrorMessage = "Profession is required.")]
        public required string Profession { get; set; }

        [Precision(10, 2)]
        public decimal Salary { get; set; }

        public IFormFile? ImageFileName { get; set; }

    }
}
