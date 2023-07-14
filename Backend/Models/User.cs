using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        [Required]
        [Key]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
