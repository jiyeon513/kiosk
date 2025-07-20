// src/recommendationEngine.js

import { menuData } from './menuData';

// 메뉴의 대표 카테고리를 반환하는 헬퍼 함수
const getMajorCategory = (tags) => {
  if (tags.includes('#카페인(커피)') || tags.includes('#진한커피') || tags.includes('#부드러운커피')) return '커피';
  if (tags.includes('#티(Tea)')) return '티';
  return '논카페인/기타';
};

export const recommendMenus = (inputs) => {
  const { gender, attire, groupInfo, weather, temperature, time } = inputs;
  const hour = time.getHours();

  // 1. 음료 메뉴만 필터링
  const drinkData = menuData.filter(m => m.type !== 'FOOD');

  // 2. 음료 메뉴 점수 계산 (기존과 유사)
  let scoredDrinks = drinkData.map(menu => {
    let score = 0;
    const reasons = [];
    
    // 점수 계산 로직...
    const tempPreference = temperature >= 20 ? 'ICED' : 'HOT';
    if (weather === '비' || weather === '눈') {
      if (menu.type.includes('HOT')) { score += 25; reasons.push('궂은 날씨엔 따뜻하게'); }
    } else {
      if (menu.type.includes(tempPreference)) { score += 25; reasons.push(tempPreference === 'ICED' ? '더운 날씨엔 시원하게' : '쌀쌀한 날씨엔 따뜻하게');}
    }
    if (hour >= 7 && hour < 11) {
      if (menu.tags.includes('#카페인') || menu.tags.includes('#고카페인')) { score += 20; reasons.push('오전 카페인 충전'); }
    } else if (hour >= 14 && hour < 17) {
      if (menu.tags.includes('#달콤한') || menu.tags.includes('#디저트음료')) { score += 20; reasons.push('나른한 오후 당 충전'); }
    } else if (hour >= 18) {
      if (menu.tags.includes('#논카페인') || menu.tags.includes('#디카페인 가능')) { score += 20; reasons.push('편안한 저녁'); }
      if (menu.tags.includes('#고카페인')) score -= 30;
    }
    if (attire === 'shirt') {
      if (menu.tags.includes('#기본') || menu.tags.includes('#깔끔한')) { score += 15; reasons.push('셔츠에 어울리는 깔끔함'); }
      if (menu.tags.includes('#휘핑')) score -= 10;
    }
    if (groupInfo.count > 1) {
      if (menu.tags.includes('#인기') || menu.tags.includes('#기본')) { score += 15; reasons.push(`${groupInfo.count}명이 함께! 무난한 인기 메뉴`); }
      else score -= 5;
    }
    if (gender === 'female') {
      if (menu.tags.includes('#새콤달콤') || menu.tags.includes('#크리미') || menu.tags.includes('#과일')) score += 5;
    } else if (gender === 'male') {
      if (menu.tags.includes('#진한커피') || menu.tags.includes('#씁쓸한')) score += 5;
    }

    return { ...menu, score, reasons, finalType: menu.type.includes('ICED') && menu.type.includes('HOT') ? 'BOTH' : menu.type[0] };
  });
  
  const sortedDrinks = scoredDrinks.sort((a, b) => b.score - a.score);
  if (sortedDrinks.length === 0) return [];

  // 3. 새로운 추천 조합 로직
  const recommendations = [];
  
  // 1순위: Best Pick (최고 점수 메뉴)
  const topPick = sortedDrinks[0];
  recommendations.push(topPick);

  // 2순위: Alternative Pick (다른 카테고리 메뉴)
  const topPickCategory = getMajorCategory(topPick.tags);
  const alternativePick = sortedDrinks.find(
    (drink) => drink.id !== topPick.id && getMajorCategory(drink.tags) !== topPickCategory
  );
  if (alternativePick) {
    recommendations.push(alternativePick);
  }
  
  // 3순위: Wildcard Pick (랜덤 재미 메뉴)
  const wildcardPool = sortedDrinks.slice(3, 10); // 4위 ~ 10위 메뉴를 후보로
  let wildcardPick = wildcardPool[Math.floor(Math.random() * wildcardPool.length)];
  
  // 중복 추천 방지
  if (wildcardPick && !recommendations.find(rec => rec.id === wildcardPick.id)) {
     recommendations.push(wildcardPick);
  }

  // 추천 메뉴가 3개 미만일 경우, 점수 순으로 채우기
  let i = 1;
  while (recommendations.length < 3 && i < sortedDrinks.length) {
    const nextBest = sortedDrinks[i];
    if (!recommendations.find(rec => rec.id === nextBest.id)) {
      recommendations.push(nextBest);
    }
    i++;
  }

  // 최종 추천 메뉴의 HOT/ICED 타입 결정
  const tempPreference = temperature >= 20 ? 'ICED' : 'HOT';
  return recommendations.slice(0, 3).map(menu => {
    let determinedType = '';
    if (menu.finalType === 'BOTH') {
      let preferredType = tempPreference;
      if (weather === '비' || weather === '눈') preferredType = 'HOT';
      determinedType = preferredType;
    } else {
      determinedType = menu.finalType;
    }
    return { ...menu, finalType: determinedType };
  });
};