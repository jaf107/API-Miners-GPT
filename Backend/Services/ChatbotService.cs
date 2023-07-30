using OpenAI_API.Completions;
using OpenAI_API;
using Chatbot.Models;
using System.Net;
using System.Text;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.Net.Http;
using System.Text.Json;
using Newtonsoft.Json.Linq;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Json;
using Backend.Constants;

namespace Chatbot.Services
{
    public class ChatbotService
    {

        HttpClient httpClient = new HttpClient();
        public string CallOpenAPI_text(string prompt)
        {
            string apikey = ApiKeyConstant.OpenAI_Key;

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

        public string CallOpenAPI_chat(List<ChatMessage> previousChats)
        {
            
            string apikey = ApiKeyConstant.OpenAI_Key;
            string answer = string.Empty;

            StringBuilder promptBuilder = new StringBuilder("");
            foreach (var chat in previousChats)
            {
                if (chat.Role == "user")
                {
                    promptBuilder.AppendLine();
                    promptBuilder.AppendLine("User: " + chat.Content);
                }
                else if (chat.Role == "assistant")
                {
                    promptBuilder.AppendLine();
                    promptBuilder.AppendLine("Assistant: " + chat.Content);
                }
            }

            var openai = new OpenAIAPI(apikey);
            CompletionRequest completion = new CompletionRequest();
            completion.Prompt = promptBuilder.ToString();
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

        public async Task<string> CallOpenAPI_Sections(string prompt)
        {
            string query = "just give me the title of 3 sections of the prompt " + prompt + ", each separated by comma";
            string apikey = ApiKeyConstant.OpenAI_Key;

            string answer = string.Empty;

            var openai = new OpenAIAPI(apikey);
            CompletionRequest completion = new CompletionRequest();
            completion.Prompt = query;
            completion.Model = OpenAI_API.Models.Model.DavinciText;
            completion.MaxTokens = 100;

            var result = await openai.Completions.CreateCompletionsAsync(completion);
            if (result != null)
            {
                var stringBuilder = new StringBuilder();
                foreach (var item in result.Completions)
                {
                    stringBuilder.AppendLine(item.Text);
                }
                answer = stringBuilder.ToString();
            }

            return answer;
        }


        public string CallOpenAPI_Title(string prompt)
        {
            
            string query = "I need a title for the " + prompt;

            string apikey = ApiKeyConstant.OpenAI_Key;

            string answer = string.Empty;

            var openai = new OpenAIAPI(apikey);
            CompletionRequest completion = new CompletionRequest();
            completion.Prompt = query;
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

        public string CallOpenAPI_Description(string prompt)
        {
            string query = "I need a Description for the " + prompt;
            string apikey = ApiKeyConstant.OpenAI_Key;


            string answer = string.Empty;

            var openai = new OpenAIAPI(apikey);
            CompletionRequest completion = new CompletionRequest();
            completion.Prompt = query;
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

        public async Task<string> Call_StableDiffusion(string prompt)
        {
            string apikey = ApiKeyConstant.StablleDiffusion_Key;

            string apiUrl = "https://stablediffusionapi.com/api/v3/text2img";

            using HttpClient client = new HttpClient();

            var requestData = new
            {
                key = apikey,
                prompt = prompt
            };

            var httpResponse = await client.PostAsJsonAsync(apiUrl,requestData );

            if (httpResponse.IsSuccessStatusCode)
            {
                string responseContent = await httpResponse.Content.ReadAsStringAsync();
                return responseContent;
            }
            else
            {
                return string.Empty;
            }
        }
    }
}
