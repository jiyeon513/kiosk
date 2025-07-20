import React, { useState, useCallback } from 'react';
import { recommendMenus } from './recommendationEngine';
import FaceInfoEstimator from './components/FaceInfoEstimator';
import GeoWeatherDisplay from './GeoWeatherDisplay';
import RecommendationResult from './RecommendationResult'; // 새로운 결과 화면 import

function App() {
  const [environment, setEnvironment] = useState(null);
  const [detectedInfo, setDetectedInfo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false); // 결과 화면 표시 여부 state

  const handleWeatherUpdate = useCallback((weatherData) => {
    setEnvironment(weatherData);
  }, []);

  const handleInfoUpdate = useCallback((infoData) => {
    setDetectedInfo(infoData);
  }, []);

  const handleRecommendClick = () => {
    if (!environment || !detectedInfo || detectedInfo.count === 0) {
      alert("날씨와 얼굴 정보가 모두 인식되어야 추천이 가능합니다.");
      return;
    }
    
    setIsLoading(true);
    
    const finalInputs = {
      weather: environment.weather,
      temperature: environment.temperature,
      time: environment.time,
      gender: detectedInfo.people[0].gender === '남성' ? 'male' : 'female',
      attire: detectedInfo.isShirtDetected ? 'shirt' : 'casual',
      groupInfo: { count: detectedInfo.count },
    };

    setTimeout(() => {
      const result = recommendMenus(finalInputs);
      setRecommendations(result);
      setIsLoading(false);
      setShowResult(true); // 추천 완료 후 결과 화면을 보여주도록 상태 변경
    }, 1000);
  };
  
  // 조건부 렌더링: showResult가 true이면 결과 화면을, 아니면 분석 화면을 보여줌
  if (showResult) {
    return <RecommendationResult recommendations={recommendations} environment={environment} />;
  }

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1>AI Personal-Fit Kiosk</h1>
        <p>얼굴과 주변 환경을 분석하여 당신에게 꼭 맞는 메뉴를 추천해드립니다.</p>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.leftPanel}>
          <FaceInfoEstimator onInfoUpdate={handleInfoUpdate} styles={faceEstimatorStyles} />
          <GeoWeatherDisplay onWeatherUpdate={handleWeatherUpdate} styles={weatherDisplayStyles} />
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.recommendCard}>
            <h2 style={styles.cardTitle}>👇 Step 2. 추천받기</h2>
            <div style={styles.autoInfoBox}>
              <p><strong>인식된 정보:</strong>&nbsp;
                {detectedInfo ? `${detectedInfo.count}명` : '...'} /&nbsp;
                {detectedInfo?.people[0] ? `${detectedInfo.people[0].age}세 ${detectedInfo.people[0].gender}` : '...'} /&nbsp;
                {detectedInfo ? (detectedInfo.isShirtDetected ? '셔츠' : '캐주얼') : '...'}
              </p>
            </div>
            <button 
              onClick={handleRecommendClick} 
              style={isLoading ? {...styles.button, ...styles.buttonLoading} : styles.button}
              disabled={isLoading || !environment || !detectedInfo}
            >
              {isLoading ? '🤖 분석중...' : '나에게 꼭 맞는 메뉴 추천받기'}
            </button>
            
            <div style={styles.resultsContainer}>
              <h3>✨ 오늘의 추천 메뉴 ✨</h3>
              {recommendations.length > 0 ? (
                recommendations.map((item, index) => (
                  <div key={item.id} style={styles.resultItem}>
                    <span style={styles.rank}>{index + 1}</span>
                    <div style={styles.menuInfo}>
                      <h4 style={styles.menuName}>{item.name}</h4>
                      <p style={styles.reason}>{item.reasons.slice(0, 1).join(', ')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={styles.placeholderText}>카메라와 위치 정보를 허용하고, 버튼을 눌러 메뉴를 추천받으세요!</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 스타일 객체들은 이전과 동일하게 유지
const styles = {
  appContainer: { fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif", backgroundColor: '#f0f2f5', color: '#333', minHeight: '100vh' },
  header: { backgroundColor: '#fff', padding: '20px 40px', textAlign: 'center', borderBottom: '1px solid #ddd' },
  mainContent: { display: 'flex', gap: '30px', padding: '30px', justifyContent: 'center' },
  leftPanel: { flex: '1', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '30px' },
  rightPanel: { flex: '1', maxWidth: '480px' },
  recommendCard: { backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  cardTitle: { marginTop: 0, marginBottom: '20px', color: '#006241' },
  autoInfoBox: { textAlign: 'center', marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' },
  button: { width: '100%', padding: '15px', border: 'none', borderRadius: '8px', backgroundColor: '#006241', color: 'white', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' },
  buttonLoading: { backgroundColor: '#5a8d7a', cursor: 'not-allowed' },
  resultsContainer: { marginTop: '30px' },
  placeholderText: { textAlign: 'center', color: '#888' },
  resultItem: { display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #eee', borderRadius: '8px', padding: '15px', marginBottom: '10px', backgroundColor: '#f8f9fa' },
  rank: { fontSize: '20px', fontWeight: 'bold', color: '#006241' },
  menuInfo: { flex: 1 },
  menuName: { margin: 0, color: '#212529', fontWeight: 600 },
  reason: { margin: '4px 0 0', color: '#6c757d', fontSize: '14px' }
};

const faceEstimatorStyles = {
  container: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  title: { marginTop: 0, marginBottom: '0px', color: '#006241' },
  videoContainer: { position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000' },
  video: { display: 'block', width: '100%', height: '100%' }
};

const weatherDisplayStyles = {
  container: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' },
  title: { marginTop: 0, marginBottom: '15px', color: '#006241' },
  // ... (이하 스타일은 이전과 동일)
};

export default App;
