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
            Logger.LogStartOfFunction();
            var response = new { message = "hello world." };
            return Logger.LogEndOfFunction(new APIGatewayProxyResponse {
                Body = JsonConvert.SerializeObject(response),
                StatusCode = (int)HttpStatusCode.OK
            });
       }
    }
}
