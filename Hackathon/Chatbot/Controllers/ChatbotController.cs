using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenAI_API;
using OpenAI_API.Completions;
using DotNetEnv;
using Chatbot.Models;
using IronOcr;

namespace Chatbot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {

        [HttpPost("/api/v1/prompt/text", Name= "GetTextResponse")]
        public async Task<IActionResult> GetTextResponse([FromBody]MessageRequest request)
        {
            DotNetEnv.Env.Load();
            string apikey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            string answer=string.Empty;

            var openai = new OpenAIAPI(apikey);
            CompletionRequest completion = new CompletionRequest();
            completion.Prompt = request.Message;
            completion.Model = OpenAI_API.Models.Model.DavinciText;
            completion.MaxTokens = 100;

            var result=openai.Completions.CreateCompletionsAsync(completion);

            if (result != null)
            {
                foreach (var item in result.Result.Completions)
                {
                    answer = item.Text;
                }

                var responseMsg = new AnswerResponse()
                {
                    ResponseMessage = answer.Trim()
                };

                return Ok(responseMsg);
            }
            else
                return BadRequest("Not found");

        }

        [HttpPost("/api/v1/prompt/image", Name = "GetTextFromImage")]
        public IActionResult GetTextFromImage([FromForm] IFormFile image)
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
                using (var input = new OcrInput(tempFilePath))
                {
                    var result = ocr.Read(input);
                    string extractedText = result.Text;

                    var responseText = new AnswerResponse()
                    {
                        ResponseMessage = extractedText
                    };
                    // Save the extracted text to a file
                    var textFilePath = Path.Combine(Path.GetDirectoryName(tempFilePath), "extractedText.txt");
                    result.SaveAsTextFile(textFilePath);

                    // Delete the temporary image file
                    System.IO.File.Delete(tempFilePath);

                    return Ok(responseText);
                }
            }

                return BadRequest("No image file was uploaded.");
            }
        }
}
