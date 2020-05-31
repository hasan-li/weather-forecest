import React, { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

import { getForecast } from 'src/services/forecast';
import { baseUrl } from 'src/const/forecast';
import './App.scss';

const App = () => {
  const [forecast, setForecast] = useState([]);
  const [cityName, setCityName] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [city, setCity] = useState(undefined);
  const [chartData, setChartData] = useState(undefined);
  const [averagePressure, setAveragePressure] = useState(null);

  useEffect(() => {
    if (!error && forecast.length !== 0) {
      const graphData = forecast.map(({ dt_txt, main: { temp }}) => ({
        date: dt_txt,
        temp,
      }));
      setChartData(graphData);
    }
  }, [forecast, error]);

  useEffect(() => {
    if (!error && forecast.length !== 0) {
      const pressureAcc = forecast.reduce((acc, { main: { pressure } }) => {
        return acc + pressure;
      }, 0);
      setAveragePressure(pressureAcc / forecast.length);
    }
  }, [forecast]);

  const getForecastForCity = async () => {
    const { city, list, status, message } = await getForecast(cityName);
    if (status !== 200) {
      setError(true);
      setErrorMessage(message);
      return;
    }

    setError(false);
    setForecast(list);
    setCity(city);
  };

  const onSearch = () => {
    getForecastForCity();
    setCity(undefined);
    setChartData(undefined);
    setAveragePressure(null);
    setForecast([]);
  }

  const onSetCityName = (name) => {
    setCityName(name);
    if (name === '') {
      setCity(undefined);
      setChartData(undefined);
      setAveragePressure(null);
      setForecast([]);
    }
  }

  return (
    <div className="App">
      <div className="search">
        <input
          type="text"
          onChange={(e) => onSetCityName(e.target.value)}
          className="input-field"
        />
        <button
          type="button"
          onClick={() => onSearch()}
          className="button__neutral"
        >
          Search
        </button>
      </div>
      {error ? (
        <>
          <p className="error">{errorMessage}</p>
          <p className="error">Please try again</p>
        </>
      ) : (
        <>
          {city && (
            <div className="city">
              {city.name} <span className="city__country"> | {city.country}</span>
            </div>
          )}
          {averagePressure && (
            <div className="city">
              <span className="city__country">Average Pressure</span> {averagePressure}
          </div>
          )}
          {chartData && (
            <LineChart width={600} height={300} data={chartData} className="chart">
              <Line type="monotone" dataKey="temp" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis dataKey="temp" />
              <Tooltip />
            </LineChart>
          )}
          {forecast.length !== 0 && cityName !== '' && (
            forecast.map(item => (
              <div key={item.dt} className="forecast">
                <div className="forecast__weather">
                  <img
                    src={`${baseUrl}/img/wn/${item.weather[0].icon}.png`}
                    className="forecast__weather__icon"
                    alt={item.weather[0].description}
                  />
                  <p className="forecast__weather__name">{item.weather[0].main}</p>
                </div>
                <div className="forecast__main">
                  <div className="forecast__main__item">
                    <p className="forecast__main__item__label">Real Feel</p>
                    <p className="forecast__main__item__value">{item.main.feels_like}</p>
                  </div>
                  <div className="forecast__main__item">
                    <p className="forecast__main__item__label">Temperature</p>
                    <p className="forecast__main__item__value">{item.main.temp}</p>
                  </div>
                  <div className="forecast__main__item">
                    <p className="forecast__main__item__label">Pressure</p>
                    <p className="forecast__main__item__value">{item.main.pressure}</p>
                  </div>
                  <div className="forecast__main__item">
                    <p className="forecast__main__item__label">Humidity</p>
                    <p className="forecast__main__item__value">{item.main.humidity}</p>
                  </div>
                </div>
                <p className="forecast__date">{item.dt_txt}</p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default App;
