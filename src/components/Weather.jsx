import { useEffect, useState } from "react";

import {
  FaSun,
  FaCloudSun,
  FaCloud,
  FaCloudMeatball,
  FaCloudSunRain,
  FaCloudShowersHeavy,
  FaPooStorm,
  FaSnowflake,
  FaSmog,
} from "react-icons/fa";

import axios from "axios";

const weatherIcon = {
  // 키값은 기본적으로 문자열임. 0이 붙어있으면 프리티어 때문에 "" 0이 붙게됨. / json 파일 형태에서는 키값, 밸류값 모두 ""로 감싸줘야 함.
  // 아래의 키값 들은 Openweather API에 따라 정해지는 것임. API 서버별 다름
  "01": <FaSun size={96} color="white" />,
  "02": <FaCloudSun size={96} color="white" />,
  "03": <FaCloud size={96} color="white" />,
  "04": <FaCloudMeatball size={96} color="white" />,
  "09": <FaCloudSunRain size={96} color="white" />,
  10: <FaCloudShowersHeavy size={96} color="white" />,
  11: <FaPooStorm size={96} color="white" />,
  13: <FaSnowflake size={96} color="white" />,
  50: <FaSmog size={96} color="white" />,
};

function Weather() {
  // 위도 경도 값 가져오기 (Openweather)
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();

  const [weatherInfo, setWeatherInfo] = useState();

  // useEffect 안에서 비동기를 사용하려면 따로 함수를 만들어 줘야 함. useEffect 안에 async, await를 쓸 수 없음. 비동기 : 서버로부터 데이터를 가져옴
  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      () => {
        alert("위치 정보에 동의 해주셔야 합니다.");
      }
    );
  };

  // 날씨 정보 가져오기
  const getWeatherInfo = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API}&units=metric`
      );

      if (response.status !== 200) {
        alert("날씨 정보를 가져오지 못했습니다.");
        // console.log 실행해보면 날씨를 불러온 객체 값에 cod : 200 부분이 날씨정보를 정상적으로 불러온것임.
        return;
      }

      console.log(response.data);
      setWeatherInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGeolocation();
  }, []);
  useEffect(() => {
    if (!lat || !lon) return;

    getWeatherInfo();
  }, [lat, lon]);
  // [lat, lon] 값이 바뀔 때마다 useEffect를 실행해라. 근데 비동기라서 매번 실행될것임.
  // 따라서 if문으로 lat / lon이 없으면 위 useEffect를 끝내라고 작성.
  // 이유는 setLat, setLon이 최초 실행되서 값을 받아오면 변경되지 않기 때문.

  useEffect(() => console.log(lat), [lat]);
  useEffect(() => console.log(lon), [lon]);
  useEffect(() => console.log(process.env.REACT_APP_WEATHER_API), []);
  // 왜 lat과 lon은 디펜던시로 추적하는데 API키는 디펜던시를 비워두나?
  // 최초 랜더링 될 때, const [lat, setLat] = useState();
  // const [lon, setLon] = useState();가 빈값임. 따라서 lat과 lon이 실행되어야 값을 불러올 수 있음.  하지만 process~~부분은 추적(디펜던시)할 필요없음.

  return (
    <div className="bg-black min-h-screen flex justify-center items-center">
      {/* <FaEthereum size={100} color="white" />
      <FaSun size={100} color="orange" />
      <FaCloudSun size={100} color="skyblue" />
      <FaCloud size={100} color="gray" />
      <FaCloudMeatball size={100} color="white" />
      <FaCloudSunRain size={100} color="gray" />
      <FaCloudShowersHeavy size={100} color="black" />
      <FaPooStorm size={100} color="gray" />
      <FaSnowflake size={100} color="skyblue" />
      <FaSmog size={100} color="gray" /> */}
      {weatherInfo ? (
        <div className="flex flex-col justify-center items-center text-white">
          {weatherIcon[weatherInfo.weather[0].icon.substring(0, 2)]}
          <div className="mt-8 text-2xl">
            {weatherInfo.name}, {Math.round(weatherInfo.main.temp * 10) / 10}℃
            {/* {weatherInfo.main.temp.toString().substring(0, 4)} ℃  -> 문자열로 바꾸고 서브스트링 사용하는 방법도 있음*/}
          </div>
        </div>
      ) : (
        "날씨 정보를 로딩중입니다..."
      )}
    </div>
  );
}

export default Weather;
