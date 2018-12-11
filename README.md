# Homework-Assignment-1
 a simple "Hello World" API
 
 Staging
_______
In Windows, open cmd, navigate to root directory and run
     '$ node index.js'

Then open Postman app and select POST request, enter the url 'localhost:3000/hello', click 'Send' button.

The output in cmd will be 'Return this response:  406 {"message":"Welcome User"}'

 
 Production
 __________
 In Windows, open cmd, navigate to root directory and run 
     '$ SET NODE_ENV=production',
     '$ node index.js'

Then open Postman app and select POST request, enter the url 'localhost:5000/hello', click 'Send' button.

The output in cmd will be 'Return this response:  406 {"message":"Welcome User"}'

