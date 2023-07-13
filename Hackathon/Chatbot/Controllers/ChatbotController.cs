using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenAI_API;
using OpenAI_API.Completions;
using DotNetEnv;
using Chatbot.Models;

namespace Chatbot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {

        [HttpPost("/v1/api/prompt/text", Name= "GetTextResponse")]
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
    }
}
