import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

function FaceInfoEstimator({ onInfoUpdate, styles }) {
  const videoRef = useRef();
  const [models, setModels] = useState(null);
  const [detectionStatus, setDetectionStatus] = useState("모델을 로딩 중입니다...");

  // 1. 모델 로딩 및 웹캠 시작 (한 번만 실행)
  useEffect(() => {
    const setup = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        
        const MODEL_URL = '/models';
        const loadedFaceApiModel = await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        const loadedCocoSsdModel = await cocoSsd.load();
        
        await Promise.all([
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ]);

        setModels({
          faceApi: loadedFaceApiModel,
          objectDetector: loadedCocoSsdModel
        });

        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setDetectionStatus("카메라를 바라봐 주세요...");

      } catch (e) {
        console.error("모델 또는 웹캠 로딩 에러:", e);
        setDetectionStatus("초기화 실패");
      }
    };
    setup();
  }, []);

  // 2. 모델이 로드되면 실시간 감지 시작
  useEffect(() => {
    if (!models || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    
    const detectionInterval = setInterval(async () => {
      if (video.readyState !== 4) return;
      
      const faceDetections = await faceapi
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withAgeAndGender();
      
      const objectDetections = await models.objectDetector.detect(video);
      
      if (onInfoUpdate) {
        const shirtDetected = objectDetections.some(p => p.class === 'tie');
        const peopleInfo = faceDetections.map(d => ({
          age: Math.round(d.age),
          gender: d.gender === 'male' ? '남성' : '여성',
        }));
        
        onInfoUpdate({
          count: faceDetections.length,
          isShirtDetected: shirtDetected,
          people: peopleInfo,
        });
      }

    }, 1500); // 감지 간격을 1.5초로 조정하여 안정성 확보

    return () => clearInterval(detectionInterval); // 컴포넌트 unmount 시 interval 정리

  }, [models, onInfoUpdate]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👤 Step 1. 카메라 분석</h2>
      <div style={{...styles.videoContainer, width: '128px', height: '96px', margin: '0 auto'}}>
        <video
          ref={videoRef}
          autoPlay
          muted
          style={styles.video}
        />
      </div>
      <p style={{ textAlign: 'center', color: '#6c757d', marginTop: '10px' }}>
        {detectionStatus}
      </p>
    </div>
  );
}

export default FaceInfoEstimator;
