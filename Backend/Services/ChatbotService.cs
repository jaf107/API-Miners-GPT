using OpenAI_API.Completions;
using OpenAI_API;
using Chatbot.Models;

namespace Chatbot.Services
{
    public class ChatbotService
    {
        public string CallOpenAPI(string prompt)
        {
            DotNetEnv.Env.Load();
            string apikey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            string answer = string.Empty;

            var openai = new OpenAIAPI(apikey);
            CompletionRequest completion = new CompletionRequest();
            completion.Prompt = prompt;
            completion.Model = OpenAI_API.Models.Model.DavinciText;
            completion.MaxTokens = 100;

            var result = openai.Completions.CreateCompletionsAsync(completion);
            if (result != null)
            {
                foreach (var item in result.Result.Completions)
                {
                    answer = item.Text;
                }
            }
            return answer;
        }
    }
}
