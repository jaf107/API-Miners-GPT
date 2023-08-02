using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Book
    {
        [Key]
        public int Id {  get; set; }

        public string Title { get; set; }

        public string UserName { get; set; }

        public byte[] Content { get; set; }
        
        public byte[] ImageFile { get; set; }
    }
}
