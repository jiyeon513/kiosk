import React, { useRef, useEffect, useState } from 'react';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

// rgbToHsl 헬퍼 함수 (이전과 동일)
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } 
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function HumanAnalyzerFinal() {
  const videoRef = useRef();
  const canvasRef = useRef(); // 박스를 그릴 캔버스
  const [analysisResult, setAnalysisResult] = useState({ clothingColor: null, objects: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedMenu, setRecommendedMenu] = useState({ drink: null, bread: null });

  useEffect(() => {
    const setupAI = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { console.error("웹캠 에러:", err); }

      console.log("AI 모델 로딩 시작...");
      // ✅ 객체 탐지 모델(cocoSsd)도 함께 로딩
      const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
      const segmenterConfig = {
        runtime: 'mediapipe',
        solutionPath: '/mediapipe', //  সমাধান ফাইলের পাথ
      };
      await Promise.all([
        bodySegmentation.createSegmenter(model, segmenterConfig),
        cocoSsd.load(),
      ]).then(([segmenter, cocoSsdModel]) => {
        console.log("AI 모델 로딩 완료.");
        setIsLoading(false);
        startAnalysis(segmenter, cocoSsdModel);
      });
    };
    setupAI();
  }, []);

  const startAnalysis = (segmenter, cocoSsdModel) => {
    const intervalId = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current;
        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(video, 0, 0, video.width, video.height);

        // 객체 탐지 실행
        const objectDetections = await cocoSsdModel.detect(video);
        
        // ✅ 캔버스에 박스 그리기
        // 1. 이전 그림 지우기
        ctx.clearRect(0, 0, video.width, video.height); 
        // 2. 각 객체마다 박스와 라벨 그리기
        objectDetections.forEach(detection => {
          ctx.beginPath();
          ctx.rect(...detection.bbox);
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#00FF00'; // 초록색 박스
          ctx.fillStyle = '#00FF00';
          ctx.stroke();
          ctx.fillText(
            `${detection.class} (${Math.round(detection.score * 100)}%)`,
            detection.bbox[0],
            detection.bbox[1] > 10 ? detection.bbox[1] - 5 : 10
          );
        });
        
        // (이전과 동일한) 신체 분할 및 색상 분석 로직
        const people = await segmenter.segmentPeople(video);
        let clothingColorResult = null;
        if (people.length > 0) {
          const foreground = await bodySegmentation.toBinaryMask(people);
          const imageData = ctx.getImageData(0, 0, video.width, video.height).data;
          let lightPixelCount = 0;
          let personPixelCount = 0;
          for (let i = 0; i < foreground.data.length; i++) {
            if (foreground.data[i] === 1) {
              personPixelCount++;
              const [h, s, l] = rgbToHsl(imageData[i*4], imageData[i*4+1], imageData[i*4+2]);
              if (s < 0.25 && l > 0.70) lightPixelCount++;
            }
          }
          if (personPixelCount > 0) {
            const lightPercentage = (lightPixelCount / personPixelCount) * 100;
            clothingColorResult = lightPercentage > 40 ? '흰색 또는 밝은 계열' : '어두운 또는 유채색 계열';
          }
        }
        
        setAnalysisResult({
          clothingColor: clothingColorResult,
          objects: objectDetections.map(d => d.class),
        });
      }
    }, 2000);

    return () => clearInterval(intervalId);
  };

  // 분석 결과가 바뀔 때마다 추천 메뉴 업데이트
  useEffect(() => {
    const { clothingColor, objects } = analysisResult;
    
    // 간단한 추천 로직 예시
    if (clothingColor === '흰색 또는 밝은 계열' && objects.includes('person')) {
      setRecommendedMenu({
        drink: '시원한 아이스 아메리카노',
        bread: '든든한 에그 클럽 샌드위치',
      });
    } else if (clothingColor === '어두운 또는 유채색 계열' && objects.includes('person')) {
       setRecommendedMenu({
        drink: '따뜻한 라떼',
        bread: '달콤한 초코 소라빵',
      });
    } else {
      setRecommendedMenu({ drink: null, bread: null });
    }
  }, [analysisResult]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
      <h2>사용자 인식 시스템 (객체 박스 표시)</h2>
      {isLoading && <p>AI 모델을 로딩 중입니다...</p>}
      <div style={{ position: 'relative', width: '640px', height: '480px', border: '1px solid black' }}>
        <video ref={videoRef} width="640" height="480" autoPlay muted playsInline style={{ transform: 'scaleX(-1)' }} />
        {/* ✅ 캔버스를 보이도록 하고 비디오 위에 겹침 */}
        <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', top: 0, left: 0, transform: 'scaleX(-1)' }} />
      </div>
      <div style={{ marginTop: '20px', fontSize: '1.2em', textAlign: 'left', minWidth: '300px' }}>
        <h3>분석 결과</h3>
        <p><strong>의상 색상 계열:</strong> {analysisResult.clothingColor || '측정 중...'}</p>
        <p><strong>인식된 객체:</strong> {analysisResult.objects.join(', ') || '측정 중...'}</p>
      </div>

      {/* 추천 메뉴 표시 영역 */}
      {recommendedMenu.drink && recommendedMenu.bread && (
        <div style={{ marginTop: '30px', padding: '20px', border: '2px solid #6a5acd', borderRadius: '10px', textAlign: 'center' }}>
          <h3>✨ 당신을 위한 추천 메뉴 ✨</h3>
          <div style={{ marginTop: '15px', fontSize: '1.3em', textAlign: 'left', display: 'inline-block' }}>
            <p><strong>음료:</strong> {recommendedMenu.drink}</p>
            <p style={{ marginTop: '10px' }}><strong>베이커리:</strong> {recommendedMenu.bread}</p>
          </div>
          <p style={{ marginTop: '20px' }}>든든한 하루를 시작해보세요!</p>
        </div>
      )}
    </div>
  );
}

export default HumanAnalyzerFinal;