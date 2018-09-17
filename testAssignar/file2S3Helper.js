'use strict'

const Exists = require('./exists');
const L = require('./log');
const {returnHttp} = require('./returnHelper');
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const s3 = new AWS.S3();
// const mpParse = require('./multipartParser');
const bodyToObject = require('./bodyToObject');

const S3Put = async (params) => {
  return new Promise((resolve, reject) => {
    L.LogStartOfFunc(S3Put);
    L.LogVar({params});
    s3.putObject(params, (err, data) => {
      if (err) {
        L.Log(`Error!`);
        L.LogVar({err});
        L.LogEndOfFunc(S3Put, reject(null));
        return;
      }
      L.LogVar({data});
      L.LogEndOfFunc(S3Put, resolve(params.Key));
    });
  })
  ;
}

const File2S3Helper = async (event) => {
  L.LogStartOfFunc(File2S3Helper);
  Exists(event);

  return new Promise(async (resolve, reject) => {
    // if (!(event.headers["content-type"].startsWith("multipart/form-data;"))) {
    //   L.Log(`Error!`);
    //   L.Log(`Unexpected request content type`);
    //   L.LogEndOfFunc(File2S3Helper, reject(returnHttp(400, {message: "Wrong content type."})));
    //   return;
    // }

    // parse the body
    // let fields;
    // try {
    //   fields = mpParse(event.body, event.headers["content-type"]);
    // }
    // catch (err) {
    //   L.LogEndOfFunc(File2S3Helper, reject(returnHttp(500, {message: `Error in multipart parsing.`})));
    //   return;
    // }
    // L.LogVar({fields});


    // let filenames = [];
    // for (let k in fields) {
    //   L.LogVar({k});
    //   const params = {
    //     Bucket: process.env.IMAGE_BUCKET,
    //     Key: k,
    //     Body: fields[k].buffer,
    //     ContentType: fields[k]["content-type"]
    //   };

    //   let ret = await S3Put(params);
    //   if (ret === null) {
    //     L.LogEndOfFunc(File2S3Helper, reject(returnHttp(500, {message: `Error adding ${k}.`})));
    //     return;
    //   }
    //   filenames.push(ret);
    // }

    bodyToObject(event);
    const params = {
      Bucket: process.env.IMAGE_BUCKET,
      Key: event.body.name,
      Body: Buffer.from(event.body.base64, 'base64')
    };

    let ret = await S3Put(params);
    if (ret === null) {
      L.LogEndOfFunc(File2S3Helper, reject(returnHttp(500, {message: `Error adding ${k}.`})));
      return;
    }

    L.LogEndOfFunc(File2S3Helper, resolve(event.body.name));
  });
  
};

module.exports = File2S3Helper;