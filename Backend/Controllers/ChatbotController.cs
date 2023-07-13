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
using Backend.Models;
using System.Text.Json;

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

        [HttpPost("/api/v1/generate/image", Name ="GenerateImageFromPrompt")]
        public async Task<IActionResult> GenerateImageFromPrompt([FromBody] MessageRequest request)
        {
            var result = await new ChatbotService().Call_StableDiffusion(request.Message);
            var jsonObject = JsonConvert.DeserializeObject<dynamic>(result);


            if (result != null)
                return Ok(result);
            else
                return BadRequest("Not found");

        }

        [HttpPost("/api/v1/generate/pdf", Name = "GetPdfResponse")]
        public async Task<IActionResult> GetPdfResponse([FromBody] MessageRequest request)
        {

            var title = new ChatbotService().CallOpenAPI_Title(request.Message);
            var description = new ChatbotService().CallOpenAPI_Description(request.Message);
            var result = await new ChatbotService().Call_StableDiffusion(request.Message);

            var jsonDocument = JsonDocument.Parse(result);
            var jsonObject = jsonDocument.RootElement;

            // Extract the image link
            var imageLink = jsonObject.GetProperty("output")[0].GetString();

            var responseMsg = new PdfComponent()
            {
                Title = title,
                Description = description
            };

            ChromePdfRenderer renderer = new ChromePdfRenderer();
            PdfDocument pdf = renderer.RenderHtmlAsPdf("<h1>"+title.ToString()+"</h1><br><img src=\""+imageLink+"\"><br>"+"<br><p>"+description.ToString()+"</p>");
            pdf.SaveAs(@"D:\Image\test.pdf");

            if (responseMsg != null)
                return Ok(responseMsg);
            else
                return BadRequest("Not found");


        }
    }
}
