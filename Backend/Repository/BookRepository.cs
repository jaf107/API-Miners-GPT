using Backend.Data;
using Backend.Models;

namespace Backend.Repository
{
    public class BookRepository
    {
        private readonly AppDbContext _context;

        public BookRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> UploadBook(string title, byte[] content, byte[] imageFile, string userName)
        {
            var book = new Book
            {
                Title = title,
                Content = content,
                ImageFile = imageFile,
                UserName = userName
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return book.Id;
        }


        public async Task<Book> GetBook(int id)
        {
            return await _context.Books.FindAsync(id);
        }
    }

}
