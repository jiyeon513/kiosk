import React, { useState, useEffect } from 'react';

// props로 추천 결과(recommendations)와 환경 정보(environment)를 받습니다.
// recommendations는 { drinkRecommendations: [...], foodPairing: {...} } 형태의 객체입니다.
function RecommendationResult({ recommendations, environment }) {
  const [finalDrink, setFinalDrink] = useState(null);

  useEffect(() => {
    // 추천 음료 목록이 있을 경우에만 랜덤 선택을 실행합니다.
    if (recommendations?.drinkRecommendations?.length > 0) {
      const drinks = recommendations.drinkRecommendations;
      // 0부터 (배열 길이 - 1) 사이의 랜덤 인덱스를 선택합니다.
      const randomIndex = Math.floor(Math.random() * drinks.length);
      // 랜덤하게 선택된 음료를 state에 저장합니다.
      setFinalDrink(drinks[randomIndex]);
    }
  }, [recommendations]); // recommendations prop이 변경될 때마다 다시 선택합니다.

  // 렌더링 준비가 안 됐으면 아무것도 표시하지 않음 (푸드 페어링 체크 로직 제거)
  if (!finalDrink || !environment) {
    return <div style={styles.container}><p>추천 결과를 불러오는 중입니다...</p></div>;
  }

  // 시간 포맷팅
  const timeString = environment.time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // 날씨 아이콘
  const weatherIcon = environment.weather.includes('비') ? '🌧️' : '☀️';

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <span style={styles.weatherIcon}>{weatherIcon}</span>
        <span style={styles.time}>{timeString}</span>
      </div>
      <p style={styles.greeting}>좋은 아침이에요.</p>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>당신에게 힘을 줄</h2>
        <div style={styles.imageContainer}>
          {/* 이미지 플레이스홀더 하나만 남김 */}
          <div style={styles.imagePlaceholder}></div>
        </div>
        {/* 추천 텍스트를 음료 하나만 언급하도록 수정 */}
        <p style={styles.recommendationText}>
          “<span style={styles.highlight}>{finalDrink.name}</span>”
        </p>
      </div>

      <div style={styles.footer}>
        <p>바로 결제를 원하시면 손을 위아래로 움직여주세요.</p>
        <p>메뉴판 보기를 원하면 손을 좌우로 움직여주세요.</p>
        <span style={styles.handIcon}>🖐️</span>
      </div>
    </div>
  );
}

// 스타일 객체
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#e0f2f1',
    padding: '40px',
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#004d40',
  },
  weatherIcon: { fontSize: '40px' },
  greeting: {
    fontSize: '24px',
    color: '#004d40',
    marginTop: '-20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    padding: '40px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '500px',
  },
  cardTitle: {
    color: '#37474f',
    fontSize: '22px',
    marginBottom: '30px',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  imagePlaceholder: {
    width: '200px', // 크기를 조금 키워 균형을 맞춤
    height: '220px',
    backgroundColor: '#eceff1',
    borderRadius: '10px',
  },
  recommendationText: {
    fontSize: '28px', // 텍스트 크기를 키워 강조
    lineHeight: '1.5',
    color: '#37474f',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#00796b',
  },
  footer: {
    textAlign: 'center',
    color: '#37474f',
  },
  handIcon: {
    fontSize: '48px',
    marginTop: '10px',
  },
};

export default RecommendationResult;
