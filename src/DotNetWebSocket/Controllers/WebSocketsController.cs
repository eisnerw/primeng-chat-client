using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace DotNetWebSocket.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WebSocketsController : ControllerBase
    {
        private readonly ILogger<WebSocketsController> _logger;

        public WebSocketsController(ILogger<WebSocketsController> logger)
        {
            _logger = logger;
        }

        [HttpGet("/api/ws")]
        public async Task Get()
        {
          if (HttpContext.WebSockets.IsWebSocketRequest)
          {
              using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
              _logger.Log(LogLevel.Information, "WebSocket connection established");
              await Echo(webSocket);
          }
          else
          {
              HttpContext.Response.StatusCode = 400;
          }
        }
        
        private async Task Echo(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            _logger.Log(LogLevel.Information, "Message received from Client");

            while (!result.CloseStatus.HasValue)
            {
                string clientMsg = Encoding.UTF8.GetString(buffer,0,result.Count);
                _logger.Log(LogLevel.Information, $"From client: '{clientMsg}'");
                WebSocketMessage msg = JsonConvert.DeserializeObject<WebSocketMessage>(clientMsg);

                if (msg!.type != "setTyping"){
                    WebSocketMessage serverMsg;
                    if (msg!.type == "hello"){
                        serverMsg = new WebSocketMessage{
                            client = msg.user,
                            type = "msg",
                            payload = "Connected!"
                        };
                    } else {
                        _logger.Log(LogLevel.Information, $"Payload from {msg.user.nick}:'{msg.payload}'");
                        string payload = $"You said: '{msg.payload}'";
                        serverMsg = new WebSocketMessage{
                            client = msg.user,
                            type = "msg",
                            payload = payload
                        };
                    }                    
                    string serverMsgString = JsonConvert.SerializeObject(serverMsg);
                    var serverMsgBytes = Encoding.UTF8.GetBytes(serverMsgString);
                    await webSocket.SendAsync(new ArraySegment<byte>(serverMsgBytes, 0, serverMsgString.Length), WebSocketMessageType.Text, result.EndOfMessage, CancellationToken.None);
                    _logger.Log(LogLevel.Information, "Message sent to Client");
                }
                buffer = new byte[1024 * 4];
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                _logger.Log(LogLevel.Information, "Message received from Client");
                
            }
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
            _logger.Log(LogLevel.Information, "WebSocket connection closed");
        }
    }
    public class WebSocketMessage {
        public int frameId {get; set;}
        public string type {get; set;}
        public WebSocketUser client {get; set;}
        public WebSocketUser user {get; set;}
        public string payload {get; set;}
    }
    public class WebSocketUser {
        public string id {get; set;}
        public string nick {get; set;}
    }
}