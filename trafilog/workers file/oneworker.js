function getdistance(long1 , leng1 , long2 ,leng2){
    let R = 6371e3; // earth radios 
    let φ1 = leng1 * Math.PI/180; // φ, λ in radians
    let φ2 = leng2 * Math.PI/180;
    let Δφ = (leng2-leng1) * Math.PI/180;
    let Δλ = (long2-long1) * Math.PI/180;
    let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
            //   console.log(a)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // in metres
    // console.log(d)

    return d;
}

var obj;



addEventListener('message' , e => {
    obj = e.data;

    for(var d = 1; d < obj.length; d++) {
        if(typeof e.data == 'number'){
            obj[d].workerid = e.data
        }
        obj[0].getdistance = 0;
        if(d == 1){
            obj[d].getdistance = getdistance(e.data[d-1].longitude,e.data[d-1].latitude,e.data[d].longitude,e.data[d].latitude);
        }else if(d + 1 != obj.length){
            obj[d].getdistance = getdistance(e.data[d-1].longitude,e.data[d-1].latitude,e.data[d].longitude,e.data[d].latitude);
        }else{
            obj[d].getdistance = getdistance(e.data[d].longitude,e.data[d].latitude,e.data[d-1].longitude,e.data[d-1].latitude);
        }
    } 

        postMessage(obj)

})





