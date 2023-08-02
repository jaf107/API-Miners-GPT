using Backend.Data;
using Backend.Models;
using Backend.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly BookRepository _bookRepository;

        public BookController(BookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        // BookController.cs
        [HttpPost("upload")]
        public async Task<IActionResult> UploadBook(IFormFile pdfFile, IFormFile imageFile, string title, string userName)
        {
            if (pdfFile == null || pdfFile.Length == 0)
                return BadRequest("PDF file is empty.");

            if (imageFile == null || imageFile.Length == 0)
                return BadRequest("Image file is empty.");

            using var pdfMemoryStream = new MemoryStream();
            await pdfFile.CopyToAsync(pdfMemoryStream);

            var pdfContent = pdfMemoryStream.ToArray();

            using var imageMemoryStream = new MemoryStream();
            await imageFile.CopyToAsync(imageMemoryStream);

            var imageContent = imageMemoryStream.ToArray();

            var bookId = await _bookRepository.UploadBook(title, pdfContent, imageContent, userName);

            return Ok(bookId);
        }


        [HttpGet("download/{id}")]
        public async Task<IActionResult> DownloadBook(int id)
        {
            var book = await _bookRepository.GetBook(id);

            if (book == null)
                return NotFound();

            return File(book.Content, "application/pdf", $"{book.Title}.pdf");
        }
    }

}
