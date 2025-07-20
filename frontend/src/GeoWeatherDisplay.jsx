import React, { useState, useEffect } from 'react';

const getWeatherDescription = (code) => {
    const weatherCodes = {
        0: "맑음 ☀️", 1: "대체로 맑음 🌤️", 2: "구름 조금 🌥️", 3: "흐림 ☁️",
        45: "안개 🌫️", 48: "서리 낀 안개 🌫️", 61: "약한 비 🌧️", 63: "보통 비 🌧️",
        95: "뇌우 ⛈️"
    };
    return weatherCodes[code] || "정보 없음";
};

// props로 onWeatherUpdate와 styles를 받습니다.
function GeoWeatherDisplay({ onWeatherUpdate, styles }) {
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [status, setStatus] = useState('위치/날씨 정보 로딩 중...');

    useEffect(() => {
        if (!navigator.geolocation) {
            setStatus("오류: 위치 정보 미지원 브라우저");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherData(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setStatus("오류: 위치 정보 접근 거부됨");
            }
        );
    }, []);

    const fetchWeatherData = async (lat, lon) => {
        const params = "temperature_2m,apparent_temperature,weather_code";
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${params}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('날씨 API 응답 실패');
            
            const data = await response.json();
            const current = data.current;
            
            const newWeatherInfo = {
                temperature: current.temperature_2m,
                feelsLike: current.apparent_temperature,
                weather: getWeatherDescription(current.weather_code),
                time: new Date()
            };
            
            setWeatherInfo(newWeatherInfo);
            if (onWeatherUpdate) {
              onWeatherUpdate(newWeatherInfo);
            }
        } catch (err) {
            setStatus(`오류: ${err.message}`);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>🌍 실시간 환경 정보</h2>
            {weatherInfo ? (
                <>
                    <p style={styles.infoText}>현재 시간: {weatherInfo.time.toLocaleTimeString('ko-KR')}</p>
                    <p style={styles.infoText}>현재 기온: {weatherInfo.temperature}°C</p>
                    <p style={styles.infoText}>현재 날씨: {weatherInfo.weather}</p>
                </>
            ) : (
                <p style={styles.statusText}>{status}</p>
            )}
        </div>
    );
}

export default GeoWeatherDisplay;
