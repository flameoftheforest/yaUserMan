'use strict'

const assert = require('assert');

let x = "";

(() => {
  new Promise((resolve, reject) => {
    // resolve('this');
    assert(false);
    throw 'throw';
  })
  .then(() => {
    console.log('1');
  }, (err) => {
    if (typeof err === "object" && err instanceof assert.AssertionError) {
      console.log('assertion error');
    }
    else
      console.log(err);
  })
  .then((data)=> {
    console.log(data);
  })
  .then(() => {
    console.log('that');
  })
  .catch((err)=> {

    if (typeof err === "object" && err instanceof assert.AssertionError) {
      console.log('assertion error');
    }

    console.log(err);
  })
  ;
})();