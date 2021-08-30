const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const csvtojsonV2=require("csvtojson");
const settings = require('./local.config.json')
const {isMainThread, parentPort } = require('worker_threads');
const Worker = require('web-worker');
const csvFilePath='/home/amir/Desktop/trafilog/coordinates_for_node_test.csv'
const csv=require('csvtojson');

async function setcsv(){
var data =  await csv().fromFile(csvFilePath);

var result = data.reduce(function(r, o){
  var k = o.vehicle_id; 
  if (r[k] || (r[k]=[])) r[k].push({key:o.row_id,long: o.longitude, leng: o.latitude});
  return r;
}, {});
// console.log(result);
// startworkers(data[0])
}
setcsv();

function create_workers(number){
  var workers = [];
    for(let i=0; i < number; i++){
        const w1 = new Worker("workers file/oneworker.js")
        workers.push(w1);
    }
      startworkers("hay" ,workers)
    // console.log(workers.length)
}
create_workers(settings.numberofserviceworkers);
function startworkers(info,webworker) {
  webworker.map((c,i) => {
   c.postMessage(info);
    c.addEventListener('message', e => {
      console.log(e.data);
    });
  })
  
}
// console.log(settings.numberofserviceworkers)
app.get('/', (request, response) => {
  return response.send('OK');
});

app.listen(5000, () => {
  console.log('App is listening on port 5000');
});