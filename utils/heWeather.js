const fetch = require('./fetch')
const config = require('./config.js');
const heKey = config.Config.heKey;
const URI = 'https://free-api.heweather.com/s6';

function getWeatherInfo(path, search) {
  const params = { key: heKey }
  return fetch(URI, path, search ? Object.assign(search, params) : params)
    .then(res => res.data)
}
module.exports = { getWeatherInfo }