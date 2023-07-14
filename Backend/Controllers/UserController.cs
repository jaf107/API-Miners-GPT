using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCryptNet = BCrypt.Net.BCrypt;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public UserController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(User user)
        {
            // Find the user by email
            var userByMail = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

            if (userByMail == null || !BCryptNet.Verify(user.Password, userByMail.Password))
            {
                return BadRequest("Invalid email or password.");
            }

            return Ok("User logged in successfully.");
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp(User userDto)
        {
            // Check if the email already exists in the database
            if (await _dbContext.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                return BadRequest("Email is already registered.");
            }

            var user = new User
            {
                Email = userDto.Email,
                Password = BCryptNet.HashPassword(userDto.Password) // Hash the password using bcrypt
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return Ok("User registered successfully.");
        }
    }
}
