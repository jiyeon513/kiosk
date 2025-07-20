import React, { useRef, useEffect, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

function ShirtDetector() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [detectedApparel, setDetectedApparel] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 모델 로딩 및 웹캠 설정
  useEffect(() => {
    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("웹캠 에러:", err);
      }
      
      console.log("객체 탐지 모델 로딩...");
      const model = await cocoSsd.load();
      console.log("모델 로딩 완료.");
      setIsLoading(false);
      startDetection(model);
    };
    setup();
  }, []);

  // 실시간 객체 탐지
  const startDetection = (model) => {
    const intervalId = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current;
        const predictions = await model.detect(video);
        
        // ✅ 의류 관련 객체만 필터링
        const apparel = predictions.filter(p => 
          ['shirt', 'blouse', 'dress', 'tie', 'jacket'].includes(p.class)
        );
        setDetectedApparel(apparel); // 인식된 의류 정보 저장

        // 캔버스에 박스 그리기
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, video.width, video.height);
        
        apparel.forEach(item => {
          ctx.beginPath();
          ctx.rect(...item.bbox);
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#00FF00'; // 초록색
          ctx.stroke();
          ctx.fillStyle = '#00FF00';
          ctx.fillText(
            `${item.class} (${Math.round(item.score * 100)}%)`,
            item.bbox[0],
            item.bbox[1] > 10 ? item.bbox[1] - 5 : 20
          );
        });
      }
    }, 1000); // 1초마다 탐지

    return () => clearInterval(intervalId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
      <h2>셔츠 인식 시스템</h2>
      {isLoading && <p>AI 모델을 로딩 중입니다...</p>}
      <div style={{ position: 'relative', width: '640px', height: '480px', border: '1px solid black' }}>
        <video ref={videoRef} width="640" height="480" autoPlay muted playsInline style={{ transform: 'scaleX(-1)' }} />
        <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', top: 0, left: 0, transform: 'scaleX(-1)' }} />
      </div>
      <div style={{ marginTop: '20px', fontSize: '1.2em' }}>
        <h3>인식된 의류:</h3>
        <p>{detectedApparel.length > 0 ? detectedApparel.map(item => item.class).join(', ') : '탐지 중...'}</p>
      </div>
    </div>
  );
}

export default ShirtDetector;