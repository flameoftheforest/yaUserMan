'use strict'

const fileType = require('file-type');
const Exists = require('./exists');
const L = require('./log');
const {returnHttp} = require('./returnHelper');
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const s3 = new AWS.S3();

const GetFile = async (fileMime, buffer) => {
  L.LogStartOfFunc(GetFile);
  const fileExt = fileMime.ext;
  let key = uuid();
  key = key.split('-').join('');

  const params = {
    Bucket: process.env.IMAGE_BUCKET,
    Key: key,
    Body: buffer
  };

  const uploadFile = {
    size: buffer.toString('ascii').length,
    type: fileMime.mime,
    name: key,
    full_path: `http://${process.env.IMAGE_BUCKET}.s3-aws-region.amazonaws.com/${key}`
  };

  return L.LogEndOfFunc(GetFile, {
    params: params,
    uploadFile: uploadFile
  });
};

const File2S3Helper = async (body) => {
  L.LogStartOfFunc(File2S3Helper);
  Exists(body);

  return new Promise(async (resolve, reject) => {
    const buffer = Buffer.from(body, 'base64');
    const fileMime = fileType(buffer);
    if (fileMime === null) {
      throw L.LogEndOfFunc(File2S3Helper, returnHttp(400, {message: "File type not present."}));
    }
    const file = await GetFile(fileMime, buffer);
    s3.putObject(file.params, (err, data) => {
      if (err) {
        throw L.LogEndOfFunc(File2S3Helper, returnHttp(500, {message: "PutObject failure."}));
      }
      L.LogEndOfFunc(File2S3Helper, resolve(file.uploadFile.full_path));
    });
  });
  
};

module.exports = File2S3Helper;