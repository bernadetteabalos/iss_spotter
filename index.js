const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});

module.exports = printPassTimes

//const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
// });

// const ip = '142.114.244.132'
// fetchCoordsByIP(ip, (error, data) => {
//   if (error) {
//     console.log(error); 
//     return;
//   }
//   console.log(data);
// });

// const input = { latitude: 43.6412, longitude: -79.5756 };

// fetchISSFlyOverTimes(input, (error, timings) => {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   console.log(timings);
// })

