using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenAI_API;
using OpenAI_API.Completions;
using DotNetEnv;
using Chatbot.Models;
using IronOcr;
using Newtonsoft.Json;
using System.Text;
using Chatbot.Services;

namespace Chatbot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {

        [HttpPost("/api/v1/prompt/text", Name= "GetTextResponse")]
        public async Task<IActionResult> GetTextResponse([FromBody]MessageRequest request)
        {

            var result = new ChatbotService().CallOpenAPI_text(request.Message);

            var responseMsg = new AnswerResponse()
            {
                ResponseMessage = result.Trim()
            };

            if(result != null)
                return Ok(responseMsg);
            else
                return BadRequest("Not found");
            

        }

        [HttpPost("/api/v1/prompt/image", Name = "GetTextFromImage")]
        public async Task<IActionResult> GetTextFromImage([FromForm] IFormFile image)
        {
            if (image != null && image.Length > 0)
            {
                // Save the uploaded image to a temporary file
                var tempFilePath = Path.GetTempFileName();
                using (var stream = new FileStream(tempFilePath, FileMode.Create))
                {
                    image.CopyTo(stream);
                }

                // Perform OCR on the uploaded image
                var ocr = new IronTesseract();
                string extractedText = string.Empty;
                using (var input = new OcrInput(tempFilePath))
                {
                    var resultImage = ocr.Read(input);
                    extractedText = resultImage.Text;

                    // Delete the temporary image file
                    System.IO.File.Delete(tempFilePath);

                    // Call the GetTextResponse API with the extracted text
                }
                var result = new ChatbotService().CallOpenAPI_text(extractedText);

                var responseMsg = new AnswerResponse()
                {
                    ResponseMessage = result.Trim()
                };

                if (result != null)
                    return Ok(responseMsg);
                else
                    return BadRequest("Not found");
                
            }

            return BadRequest("No image file was uploaded.");
        }

    }
}
