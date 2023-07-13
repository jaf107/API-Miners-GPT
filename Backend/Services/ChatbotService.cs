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


namespace Chatbot.Services
{
    public class ChatbotService
    {
        HttpClient httpClient = new HttpClient();
        public string CallOpenAPI_text(string prompt)
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

        public string CallOpenAPI_Title(string prompt)
        {
            string result = string.Empty;
            string query = "I need";
            return result;
        }

        public string CallOpenAPI_Description(string prompt)
        {
            string result = string.Empty;
            return result;
        }

        public async Task<string> Call_StableDiffusion(string prompt)
        {
            DotNetEnv.Env.Load();

            string apiKey = Environment.GetEnvironmentVariable("STABLE_DIFFUSION_KEY");
            //string prompt = reqPrompt;
            string apiUrl = "https://stablediffusionapi.com/api/v3/text2img";

            using HttpClient client = new HttpClient();

            var requestData = new
            {
                key = apiKey,
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
                // Handle the case when the API request fails
                // You can throw an exception or return an appropriate error message
                return string.Empty;
            }
        }
        //public async Task<string> Call_StableDiffusuin(string reqPrompt)
        //{
        //    DotNetEnv.Env.Load();

        //    string apiKey = Environment.GetEnvironmentVariable("STABLE_DIFFUSION_KEY");
        //    string prompt = reqPrompt;
        //    string apiUrl = "https://stablediffusionapi.com/api/v3/text2img";

        //    using HttpClient client = new HttpClient();
        //    client.DefaultRequestHeaders.Clear();

        //    var body = new StableDiffusion()
        //    {
        //        Key = apiKey,
        //        Prompt = prompt
        //    };

        //    //client.DefaultRequestHeaders.Add("CallerToken", token);
        //    var httpResponse = client.PostAsJsonAsync(apiUrl, body).Result;


        //    return (httpResponse);
        //}
        public string CallCloseAPI_Image(string prompt) {
            string url = "https://api.openai.com/v1/images/generations";
            //string bearerToken = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            string apikey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");

            //string body = "{\"prompt\": \"an isometric view of a miniature city, tilt shift, bokeh, voxel, vray render, high detail\",\"n\": 2,\"size\": \"1024x1024\"}";
            //string body = "{\"prompt\": \"an isometric view of a miniature city, tilt shift, bokeh, voxel, vray render, high detail\",\"n\": 2,\"size\": \"256x256\",\"response_format\":\"b64_json\"}";
            string body = prompt;

            // Prepare data for the POST request
            var data = Encoding.ASCII.GetBytes(body);
            Console.WriteLine(data);

            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.ContentLength = data.Length;

            // Authentication
            if (apikey != null)
            {
                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                request.PreAuthenticate = true;
                request.Headers.Add("Authorization", "Bearer " + apikey);
            }
            else
            {
                request.Credentials = CredentialCache.DefaultCredentials;
            }

            // Perform request
            using (var stream = request.GetRequestStream())
            {
                stream.Write(data, 0, data.Length);
            }

            // Retrieve response
            var response = (HttpWebResponse)request.GetResponse();
            Console.WriteLine("Request response: " + response.StatusCode);

            var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
            //Console.WriteLine(responseString);

            return responseString;
            // Deserialize JSON
            //dynamic responseJson = JsonConvert.DeserializeObject<dynamic>(responseString);

            //////Console.WriteLine(responseJson);
            ////Console.WriteLine(responseJson.created);
            ////Console.WriteLine(responseJson.data);
            ////Console.WriteLine(responseJson.data[0].url);
            ////Console.WriteLine(responseJson.data[1].url);

            //for (int i = 0; i < responseJson.data.Count; i++)
            //{
            //    string base64 = responseJson.data[i].b64_json;
            //    //Console.WriteLine(base64);

            //    Bitmap img = Base64StringToBitmap(base64);

            //    long unixTime = ((DateTimeOffset)DateTime.Now).ToUnixTimeSeconds();
            //    string filename = string.Format("image_{0}_{1}.png", unixTime, i);

            //    img.Save(filename);
            //    Console.WriteLine("Saving image to " + filename);
            //}

            //Console.ReadKey();
        }

    }
}
