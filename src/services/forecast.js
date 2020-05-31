import axios from 'axios';
import { baseApiUrl, apiKey } from '../const/forecast';

export const getForecast = async (cityName) => {
  try {
    const url = `${baseApiUrl}?q=${cityName}&appid=${apiKey}&units=metric`
    const { status, data: { city, list } } = await axios(url);
    return { city, list, status };
  } catch (e) {
    const { status, data: { message } } = e.response;
		return { status, message };
	}
};
