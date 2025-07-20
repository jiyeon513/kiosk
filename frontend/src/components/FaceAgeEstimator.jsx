import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

function FaceAgeEstimator() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [age, setAge] = useState(null);

  // 1. 모델 로딩 및 웹캠 설정
  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      // 모델 파일들이 있는 경로
      const MODEL_URL = '/models'; 
      
      // 필요한 모델들을 비동기적으로 로딩
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);
      console.log("모델 로딩 완료");

      // 웹캠 스트림 가져오기
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("웹캠 에러:", err);
      }
    };

    loadModelsAndStartVideo();
  }, []);

  // 2. 얼굴 인식 및 나이 추정
  const handleVideoPlay = () => {
    setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        // 얼굴 감지 및 관련 정보(나이, 성별) 가져오기
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withAgeAndGender();

        if (detections.length > 0) {
          // 한 명의 얼굴만 처리 (가장 크게 감지된 얼굴)
          const estimatedAge = detections[0].age;
          setAge(Math.round(estimatedAge)); // 추정된 나이를 state에 저장
        } else {
          setAge(null); // 얼굴이 감지되지 않으면 초기화
        }

        // (선택) 감지된 얼굴에 사각형 그리기
        const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
        if (canvasRef.current) {
          canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
          faceapi.matchDimensions(canvasRef.current, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        }
      }
    }, 500); // 0.5초마다 한 번씩 실행
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <div style={{ position: 'relative', width: '640px', height: '480px' }}>
        <video
          ref={videoRef}
          onPlay={handleVideoPlay}
          width="640"
          height="480"
          autoPlay
          muted
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      </div>
      <h2 style={{ marginTop: '20px' }}>
        추정 나이: {age ? `${age}세` : '얼굴을 인식시켜 주세요...'}
      </h2>
    </div>
  );
}

export default FaceAgeEstimator;