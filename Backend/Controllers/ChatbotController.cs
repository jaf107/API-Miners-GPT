using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenAI_API;
using OpenAI_API.Completions;
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

        [HttpPost("/api/v1/prompt/text", Name= "GetTextResponseForRequest")]
        public async Task<IActionResult> GetTextResponseForRequest([FromBody]MessageRequest request)
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
        
        [HttpPost("/api/v2/prompt/text", Name = "GetTextResponseForChats")]
        public async Task<IActionResult> GetTextResponseForChats([FromBody] List<ChatMessage> chatMessages)
        {

            var result = new ChatbotService().CallOpenAPI_chat(chatMessages);

            var responseMsg = new AnswerResponse()
            {
                ResponseMessage = result.Trim()
            };

            if (result != null)
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

        [HttpPost("/api/v1/generate/pdf", Name = "GetPdfResponse")]
        public async Task<IActionResult> GetPdfResponse([FromBody] MessageRequest request)
        {

            byte[] pdfBytes = await GeneratePdfBytesFromPrompt(request.Message);


            Response.Headers.Add("Content-Disposition", "attachment; filename=\"Book.pdf\"");
            Response.ContentType = "application/pdf";

            // Return the PDF file as a downloadable file
            return File(pdfBytes, "application/pdf");

        }

        [HttpPost("/api/v2/generate/pdf", Name = "GetPdfResponseV2")]
        public async Task<IActionResult> GetPdfResponseV2([FromBody] MessageRequest request)
        {
            var sectionString = new ChatbotService().CallOpenAPI_Sections(request.Message);
            string[] sections = sectionString.ToString().Split(',');
            var htmlToRender = new StringBuilder(); // Use StringBuilder for efficient string concatenation
            //foreach (string s in sections)
            //{
            //    var title = new ChatbotService().CallOpenAPI_Title(s);
            //    var description = new ChatbotService().CallOpenAPI_Description(s);
            //    var result = await new ChatbotService().Call_StableDiffusion(s);

            //    var jsonDocument = JsonDocument.Parse(result);
            //    var jsonObject = jsonDocument.RootElement;

            //    // Extract the image link
            //    var imageLink = jsonObject.GetProperty("output")[0].GetString();


            //    htmlToRender.Append("<h1>").Append(title).Append("</h1><br>");
            //    htmlToRender.Append("<img src=\"").Append(imageLink).Append("\"><br><br>");
            //    htmlToRender.Append("<p>").Append(description).Append("</p>");
            //    await Task.Delay(1000); // Use asynchronous delay

            //}
            ChromePdfRenderer renderer = new ChromePdfRenderer();
            PdfDocument pdf = await renderer.RenderHtmlAsPdfAsync(htmlToRender.ToString());

            var filePath = Path.Combine("D:", "Image", request.Message + ".pdf");
            pdf.SaveAs(filePath);

            byte[] pdfBytes = await GeneratePdfBytesFromPrompt(request.Message);

            // Set response headers
            Response.Headers.Add("Content-Disposition", "attachment; filename=\"Book.pdf\"");
            Response.ContentType = "application/pdf";

            // Return the PDF file as a downloadable file
            return File(pdfBytes, "application/pdf");
        }

        private async Task<byte[]> GeneratePdfBytesFromPrompt(string prompt)
        {
            var title = new ChatbotService().CallOpenAPI_Title(prompt);
            var description = new ChatbotService().CallOpenAPI_Description(prompt);
            var result = await new ChatbotService().Call_StableDiffusion(prompt);

            var jsonDocument = JsonDocument.Parse(result);
            var jsonObject = jsonDocument.RootElement;

            // Extract the image link
            var imageLink = jsonObject.GetProperty("output")[0].GetString();

            ChromePdfRenderer renderer = new ChromePdfRenderer();
            PdfDocument pdf = await renderer.RenderHtmlAsPdfAsync("<h1>" + title.ToString() + "</h1><br><img src=\"" + imageLink + "\"><br>" + "<br><p>" + description.ToString() + "</p>");
            pdf.SaveAs(@"D:\Image\" + prompt + ".pdf");

            //var pdf = await renderer.RenderHtmlAsPdfAsync(htmlContent);

            // Return the PDF as byte array
            return pdf.BinaryData;
        }

        [HttpGet("/getVersion")]
        public string GetVersion()
        {
            return "1.0";
        }
    }
}
