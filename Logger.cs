using Amazon.Lambda.Core;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;

namespace testAssignar
{
    class Logger
    {
        private static readonly Lazy<Logger> _Instance = new Lazy<Logger>(() => new Logger());

        public static Logger Instance
        {
            get
            {
                return _Instance.Value;
            }
        }

        public static void Trace(string message)
        {
            LambdaLogger.Log(message);
        }

        public static void LogStartOfFunction([CallerMemberName] string memberName = "")
        {
            Trace("Entered " + memberName);
        }

        public static void LogEndOfFunction([CallerMemberName] string memberName = "")
        {
            Trace("Exited " + memberName);
        }

        public static T LogEndOfFunction<T>(T returnObject, [CallerMemberName] string memberName = "")
        {
            Trace("Exited " + memberName);
            return returnObject;
        }
    }
}
