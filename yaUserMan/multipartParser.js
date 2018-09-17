'use strict'

const L = require('./log');

const Header_parse = (header) => {
  L.LogStartOfFunc(Header_parse);
  L.LogVar({header});
  var headerFields = {};
  
  var matchResult = header.match(/^.*name="([^"]*)"$/);
  if (matchResult) headerFields.name = matchResult[1];
  
  matchResult = header.match(/^[Cc]ontent-[Tt]ype:[ ]*([^ ]+)$/);
  if (matchResult) headerFields["content-type"] = matchResult[1];
  
  return L.LogEndOfFunc(Header_parse, headerFields);
};

const rawStringToBuffer = (str) => {
  L.LogStartOfFunc(rawStringToBuffer);
  var idx, len = str.length,
    arr = new Array(len);
  for (idx = 0; idx < len; ++idx) {
    arr[idx] = str.charCodeAt(idx) & 0xFF;
  }
  return L.LogEndOfFunc(rawStringToBuffer, new Uint8Array(arr).buffer);
};

const Boundary_parse = (body) => {
  L.LogStartOfFunc(Boundary_parse);
  var bndry = body.split('Content-Disposition: form-data;')[0];
  return  L.LogEndOfFunc(Boundary_parse, bndry.trim().slice(2));
};

const MultiPartParser = (body, contentType) => {
  L.LogStartOfFunc(MultiPartParser);
  // Examples for content types:
  //      multipart/form-data; boundary="----7dd322351017c"; ...
  //      multipart/form-data; boundary=----7dd322351017c; ...
  var m = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);

  if (!m) {
    throw new Error('Bad content-type header, no multipart boundary');
  }

  let s, fieldName;
  let boundary = m[1] || m[2];

  // \r\n is part of the boundary.
  boundary = '\r\n--' + boundary;

  var isRaw = typeof(body) !== 'string';
  if (isRaw) {
    var view = new Uint8Array(body);
    s = String.fromCharCode.apply(null, view);
  } else {
    s = body;
  }

  // Prepend what has been stripped by the body parsing mechanism.
  s = '\r\n' + s;

  var parts = s.split(new RegExp(boundary)),
    partsByName = {};

  // First part is a preamble, last part is closing '--'
  for (var i = 1; i < parts.length - 1; i++) {
    var subparts = parts[i].split('\r\n\r\n');
    var headers = subparts[0].split('\r\n');
    var headerFields = {};
    for (var j = 1; j < headers.length; j++) {
      headerFields = Header_parse(headers[j]);
      L.LogVar({headerFields});
      if (headerFields.name) {
        fieldName = headerFields.name;
      }
    }

    // partsByName[fieldName] = isRaw ? rawStringToBuffer(subparts[1]) : subparts[1];
    partsByName[fieldName] = {
      buffer: isRaw ? rawStringToBuffer(subparts[1]) : subparts[1], // Buffer.from(subparts[1]).toString(),
      "content-type": headerFields["content-type"]
    }; // rawStringToBuffer(subparts[1]);
  }

  return L.LogEndOfFunc(MultiPartParser, partsByName);
}; 

module.exports = MultiPartParser;