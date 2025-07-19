import { useEffect, useRef } from "react";

/**
 * 여러 SVG path를 순서대로 "필기" 애니메이션.
 * props:
 *  - paths: string[]  (SVG d)
 *  - viewBox: string  ("0 0 W H")
 *  - stroke, strokeWidth: 스타일
 *  - delaySec: 전체 시작 지연
 *  - drawSec: paths 전체를 그리는 데 걸릴 총 시간
 *  - gapSec: path 사이 간격
 *  - width, height: 렌더 크기(px)  반응형이면 %/vw 단위 쓰기
 */
export default function HelloHandwritingMulti({
  paths,
  viewBox,
  stroke = "#ffffff",
  strokeWidth = 8,
  delaySec = 0,
  drawSec = 2,
  gapSec = 0.05,
  width = 600,
  height = 200,
}) {
  const pathRefs = useRef([]);

  useEffect(() => {
    if (!paths?.length) return;
    const total = paths.length;
    const per = drawSec / total; // path별 애니 시간 균등 분배

    pathRefs.current.forEach((el, i) => {
      if (!el) return;
      const len = el.getTotalLength();
      el.style.strokeDasharray = len;
      el.style.strokeDashoffset = len;
      // 레이아웃 확정
      el.getBoundingClientRect();
      // 개별 애니 스케줄: delay + (i * (per + gap))
      el.style.transition = `stroke-dashoffset ${per}s ease ${delaySec + i * (per + gapSec)}s`;
      requestAnimationFrame(() => {
        el.style.strokeDashoffset = "0";
      });
    });
  }, [paths, delaySec, drawSec, gapSec]);

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      style={{ overflow: "visible" }}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          ref={el => (pathRefs.current[i] = el)}
          d={d}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
