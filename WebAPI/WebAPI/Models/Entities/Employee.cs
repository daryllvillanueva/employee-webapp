using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models.Entities
{
    public class Employee
    {
        public int Id { get; set; }

        [MaxLength(50)]
        public required string Name { get; set; }

        [MaxLength(50)]
        public required string Email { get; set; }

        [MaxLength(20)]
        public required string Phone { get; set; }

        [MaxLength(50)]
        public required string Department { get; set; }

        [MaxLength(50)]
        public required string Profession { get; set; }

        [Precision(10, 2)]
        public decimal Salary { get; set; }

        [MaxLength(100)]
        public string ImageFileName { get; set; } = "";

        public DateTime CreatedAt { get; set; }
    }
}
