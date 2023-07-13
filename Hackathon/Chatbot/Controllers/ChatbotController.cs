using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenAI_API;
using OpenAI_API.Completions;
using DotNetEnv;

namespace Chatbot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {

        [HttpPost]
        public async Task<IActionResult> GetResponse([FromBody]string prompt)
        {
            DotNetEnv.Env.Load();
            string apikey = System.Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            string answer=string.Empty;

            var openai = new OpenAIAPI(apikey);
            CompletionRequest completion = new CompletionRequest();
            completion.Prompt = prompt;
            completion.Model = OpenAI_API.Models.Model.DavinciText;
            completion.MaxTokens = 100;

            var result=openai.Completions.CreateCompletionsAsync(completion);

            if (result != null)
            {
                foreach (var item in result.Result.Completions)
                {
                    answer = item.Text;
                }

                return Ok(answer);
            }
            else
                return BadRequest("Not found");

        }
    }
}
