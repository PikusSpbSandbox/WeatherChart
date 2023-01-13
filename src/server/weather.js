const express = require('express');
const https = require('https');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
const port = 8181;

const weatherHistoryFile = __dirname + '/weather-history.json';
const CITIES = {
  rus: {
    'Murmansk': [68.970663, 33.074918],
    'St.-Petersburg': [59.938955, 30.315644],
    'Arkhangelsk': [64.539911, 40.515762],
    'Astrakhan': [46.347614, 48.030178],
    'Roschino': [60.256511, 29.603100],
    'Vladivostok': [43.115542, 131.885494],
    'Khabarovsk': [48.480229, 135.071917],
    'Nizhny Novgorod': [56.326797, 44.006516],
    'Krasnoyarsk': [56.010569, 92.852572],
    'Magadan': [59.565155, 150.808586],
    'Salekhard': [66.529903, 66.614544],
    'Moscow': [55.755864, 37.617698]
  },
  capitals: {
    'London (GBR)': [51.507351, -0.127696],
    'Tokyo (JPN)': [35.681729, 139.753927],
    'Paris (FRA)': [48.856663, 2.351556],
    'Rome (ITA)': [41.902695, 12.496176],
    'Washington (USA)': [35.551037, -77.058276],
    'Berlin (DEU)': [52.518621, 13.375142],
    'Buenos Aires (ARG)': [-34.615697, -58.435104],
    'Bangkok (THA)': [13.771370, 100.513782],
    'Cape Town (ZAF)': [-33.919785, 18.425596],
    'Wellington (NZL)': [-41.288741, 174.777075]
  },
  favourite: {
    'Valencia (ESP)': [39.464109, -0.375720],
    'Galway (IRL)': [53.276059, -9.050913],
    'Munich (DEU)': [48.137193, 11.575691],
    'Sofia (BGR)': [42.697839, 23.314498],
    'Budapest (HUN)': [47.492647, 19.051399],
    'Nicosia (CYP)': [35.172927, 33.353965],
    'Sydney (AUS)': [-33.865255, 151.216484],
    'Quebec (CAN)': [46.807102, -71.211788],
    'Seoul (KOR)': [37.570705, 126.976946]
  }
};
const labels = {
  capitals: Object.keys(CITIES.capitals),
  rus: Object.keys(CITIES.rus),
  favourite: Object.keys(CITIES.favourite),
  average: []
};
const values = {
  capitals: new Array(labels.capitals.length),
  rus: new Array(labels.rus.length),
  favourite: new Array(labels.favourite.length),
  average: []
};
const allValues = [];
let retried = 0;

function request(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          let json = JSON.parse(body);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      });

    }).on('error', (error) => {
      reject(error);
    });
  });
}

function retry(fn, retries, err= null) {
  if (!retries) {
    return Promise.reject(err);
  }
  return fn().catch(async (err) => {
    retried++;
    await new Promise(resolve => {
      setTimeout(() => resolve(true), 800);
    });
    return retry(fn, (retries - 1), err);
  });
}

function requestWeather(groupName, latitude, longitude, index) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  return request(url).then(response => {
    allValues.push(values[groupName][index] = response.current_weather.temperature);
  });
}

app.get('/weather', (req, res) => {
  retried = 0;
  retry(() => Promise.all(
    Object.keys(CITIES).map(groupName => {
      return Object.keys(CITIES[groupName]).map((cityName, index) => {
        return requestWeather(
          groupName,
          CITIES[groupName][cityName][0],
          CITIES[groupName][cityName][1],
          index
        );
      })
    }).flat()
  ), 5).then(() => {
    let averageNow = allValues.reduce((memo, value) => {
      memo += value;
      return memo;
    }, 0) / allValues.length;

    const weatherHistory = JSON.parse(fs.readFileSync(weatherHistoryFile, 'utf8'));
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const todayString = `${now.getFullYear()}.${month}.${date}`;

    let todayInHistory = weatherHistory.find(item => todayString in item);
    if (todayInHistory) {
      averageNow = (averageNow + todayInHistory[todayString]) / 2;
      todayInHistory[todayString] = averageNow;
    } else {
      todayInHistory = {};
      todayInHistory[todayString] = averageNow
      weatherHistory.push(todayInHistory);
    }

    labels.average = weatherHistory.map(item => Object.keys(item)[0]);
    values.average = weatherHistory.map(item => Object.values(item)[0]);

    weatherHistory.sort((a, b) => {
      return Object.keys(a)[0].localeCompare(Object.keys(b)[0]);
    });

    const content = JSON.stringify(weatherHistory);

    fs.writeFile(weatherHistoryFile, content, err => {
      if (err) {
        console.error(err);
      }
    });
  }).finally(() => {
    res.json( { labels, values,retried } );
  });
});

app.listen(port, () => {
  console.log(`Weather app listening on port ${port}`);
});
