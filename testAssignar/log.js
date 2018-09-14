'use strict'

module.exports.Log = (s) => console.log(s);
module.exports.LogStartOfFunc = (f) => console.log(`START ${f.name}`);
module.exports.LogEndOfFunc = (f, r) => {console.log(`END ${f.name}`); return r;}
module.exports.LogVar = (v) => console.log(JSON.stringify(v));