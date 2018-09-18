# How To Upload File With NodeJS Lambda Into S3
## Description
#### Use case that this method addresses:
  + Uploading profile images into a S3 bucket through a API-Gateway fronted Lambda function.

#### Why do this:
  + S3 putObject is the typical way to insert a file into the S3 bucket.
  + putObject expects a binary string for the file body as part of the request params.
  + The binary string is represented as the Buffer object in NodeJS.
  + The Buffer.from(\<string>, \<encoding>) is the typical approach to create a Buffer.
  + Typical frontend packing is FormData. This will be a delimted string. I do not understand how the File is encoded in this structure. The conversion of this structure to Buffer is inaccurate. This in turn yields a 0 byte Buffer or a Buffer wrongly translated.
  + Most NodeJS tutorials teaches how to use Multer or Multiparty or their equivalent which consumes HTTPRequest Object (NodeJS Express ecosystem). Setting this up seems to be an excessive overhead.

#### The approach:
  1. Get the frontend to encode the file body as base64 string.
  1. Now we know exactly the encoding, in the lambda function, convert the string to octet in a Buffer object.
  1. Send this over to S3 using putObject.

## Frontend
+ This is an abstraction of `Tests/frontend/src/App.js`
+ Obtain File object from file-input with code like this:
```
const selectedFile = event.target.files[0];
```
+ Extract the base64-encoded body and header with code like this:
```
const getBase64fromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(`getBase64fromFile success.`);
      const spliced = reader.result.split(',');
      const header = spliced[0];
      spliced.shift();
      resolve({
        header: header,
        body: spliced.join('')
      });
    };
    reader.onerror = (err) => {
      console.log(`getBase64fromFile failed.`);
      reject(err);
    };
  });
}
``` 
+ Compose a POST body (I assume you are posting) like so:
```
{
  name: selectedFile.name,
  header: base64Data.header,
  base64: base64Data.body
}
```
+ Use Fetch API or something similar to dispatch the file for upload.

## Lambda
+ We are looking the POST endpoint
+ Extract the base64 string to Buffer object using the following approach:
```
const buffer = Buffer.from(event.body.base64, 'base64')
```
+ Send this over to S3 like this:
```
s3.putObject({
  Bucket: "filebucket",
  Key: filename,
  Body: buffer,
  ACL: "public-read"
}, (err, data) => {
  if (err) {
    console.log(`${JSON.stringify(err)}`);
    return;
  }
  return data;
});
```