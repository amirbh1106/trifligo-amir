const express = require('express');
const fs = require('fs');
const app = express();
const settings = require('./local.config.json')
const Worker = require('web-worker');
const csvFilePath='/home/amir/Desktop/trafilog/coordinates_for_node_test.csv'
const csv=require('csvtojson');
const converter = require('json-2-csv');

async function setcsv(){
let data =  await csv().fromFile(csvFilePath);
let result = data.reduce(function(r, o){
  var k = o.vehicle_id; 
  if (r[k] || (r[k]=[])) r[k].push({row_id:o.row_id,vehicle_id:o.vehicle_id,latitude: o.latitude , longitude:o.longitude});
  // console.log(r)
  return r;
}, {});
let count = 0;
for(var i in result){
    count++
}
let workers = create_workers(settings.numberofserviceworkers);
if(settings.numberofserviceworkers == 1){
    useworkers(result, workers , data);
}else if(count <= settings.numberofserviceworkers){
  console.log(`no need for more than ${count}` )
}else{
    useworkers(result , workers , data);
}
}
setcsv();


function create_workers(number){
  var workers = [];
    for(let i=0; i < number; i++){
        const w1 = new Worker("workers file/oneworker.js")
        w1.postMessage(i)
        workers.push(w1);
    }
    return workers;
}


function useworkers(carsinfo,webworkers,rawjson) {
  var a =[]
  var workersindexarray = [];
  for(var i in carsinfo){
   workersindexarray.push(i)
   workersindexarray.fill(0)
  }
  webworkers.map((c, t) =>{
    if(a.length < workersindexarray.length){
       a.push(t)
    }
    if(a.length < workersindexarray.length){
      a.push(t)
   }
 })


 var carcount = -1
  for(let car in carsinfo){
    carcount++;
    var webworkerindex = a[carcount]
// console.log(carsinfo)
   webworkers[webworkerindex].postMessage(carsinfo[car])
   webworkers[webworkerindex].addEventListener('message', e => {
    for(let x in e.data){
        e.data[x].workerid = webworkerindex
    }
      for(let d in rawjson){
        for(let y in e.data){
          if(rawjson[d].row_id == e.data[y].row_id){
            rawjson[d].workerid = e.data[y].workerid
            rawjson[d].getdistance = e.data[y].getdistance
          }
        }
      }
      // console.log(rawjson)
      converter.json2csv(rawjson, (err, csv) => {
        if (err) {
            throw err;
        }
    
        // print CSV string
        fs.writeFile('./localcsv', csv, function (err) {
          if (err) return console.log(err);
          // console.log('Hello World > helloworld.txt');
        });
        // console.log(csv);
    });
    });
}


}

// console.log(settings.numberofserviceworkers)
app.get('/', (request, response) => {
  return response.send('OK');
});

app.listen(5200, () => {
  // console.log('App is listening on port 5000');
});