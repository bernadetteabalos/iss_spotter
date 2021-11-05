/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const url = 'https://api64.ipify.org?format=json';
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body).ip;
    if (data.length === 0) {
      callback(null, 'NO IP FOUND');
      return;
    } else {
      callback(error, data);
    }
  });
};

const fetchCoordsByIP = function(ip, cb) {
  const url2 = `https://api.freegeoip.app/json/${ip}?apikey=67c201d0-3dca-11ec-b74b-afb47eec3ce7`;
  request(url2, (error, response, body) => {
    if (error) {
      cb(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      cb(Error(msg), null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body);
    cb(error, {latitude, longitude});
  }
  );
};

const fetchISSFlyOverTimes = function(coords, callbackThr) {
  const url3 = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`

  request(url3, (error, response, body) => {
    if (error) {
      callbackThr(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callbackThr(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const flyover = JSON.parse(body).response;
    callbackThr(null, flyover);
  })
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        callback(error, null);
        return;
      }
      fetchISSFlyOverTimes(coords, (error, passes) => {
      if (error) {
        callback(error, null);
      }
        callback(null, passes);
      })
    })
  })
};

module.exports = { nextISSTimesForMyLocation };