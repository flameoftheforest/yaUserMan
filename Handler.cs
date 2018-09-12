using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using Newtonsoft.Json;
using System;
using System.Net;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace testAssignar
{
    public class Handler
    {
       public APIGatewayProxyResponse Hello(APIGatewayProxyRequest request, ILambdaContext context)
       {
            LambdaLogger.Log("hello???");
            var response = new { message = "hello world." };
            return new APIGatewayProxyResponse {
                Body = JsonConvert.SerializeObject(response),
                StatusCode = (int)HttpStatusCode.OK
            };
       }
    }
}
