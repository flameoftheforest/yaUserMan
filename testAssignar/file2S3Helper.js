'use strict'

const Exists = require('./exists');
const L = require('./log');
const {returnHttp} = require('./returnHelper');
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const s3 = new AWS.S3();
const mpParse = require('./multipartParser');

// const GetFile = async (fileMime, buffer) => {
//   L.LogStartOfFunc(GetFile);
//   const fileExt = fileMime.ext;
//   let key = uuid();
//   key = key.split('-').join('');

//   const params = {
//     Bucket: process.env.IMAGE_BUCKET,
//     Key: key,
//     Body: buffer
//   };

//   const uploadFile = {
//     size: buffer.toString('ascii').length,
//     type: fileMime.mime,
//     name: key,
//     full_path: `http://${process.env.IMAGE_BUCKET}.s3-aws-region.amazonaws.com/${key}`
//   };

//   return L.LogEndOfFunc(GetFile, {
//     params: params,
//     uploadFile: uploadFile
//   });
// };

const S3Put = async (params) => {
  return new Promise((resolve, reject) => {
    L.LogStartOfFunc(S3Put);
    s3.putObject(params, (err, data) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(S3Put, reject(null));
        return;
      }
      L.LogEndOfFunc(S3Put, resolve(params.Key));
    });
  })
  ;
}

const File2S3Helper = async (event) => {
  L.LogStartOfFunc(File2S3Helper);
  Exists(event);

  return new Promise(async (resolve, reject) => {
    // const buffer = Buffer.from(body, 'base64');
    if (!(event.headers["content-type"].startsWith("multipart/form-data;"))) {
      L.Log(`Error!`);
      L.Log(`Unexpected request content type`);
      L.LogEndOfFunc(File2S3Helper, reject(returnHttp(400, {message: "Wrong content type."})));
      return;
    }

    // parse the body
    const fields = mpParse(event.body, event.headers["content-type"]);
    L.LogVar({fields});

    let filenames = [];
    for (let k in fields) {
      L.LogVar({k});
      const params = {
        Bucket: process.env.IMAGE_BUCKET,
        Key: k,
        Body: fields[k]
      };

      let ret = await S3Put(params);
      if (ret === null) {
        // reject
      }
      filenames.push(ret);
    }

    L.LogEndOfFunc(File2S3Helper, resolve(filenames));

    
    // L.LogEndOfFunc(File2S3Helper, reject(returnHttp(500, {message: "Function not ready."})));

    // const file = await GetFile(fileMime, buffer);
  });
  
};

module.exports = File2S3Helper;