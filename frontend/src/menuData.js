// src/menuData.js

export const menuData = [
    // ===================================
    // PART 1: 푸드 메뉴 (Food Menu)
    // ===================================
  
    // 🍞 베이커리 (Bakery)
    {
      id: 'scope_choco_chip_scone', name: '스코프 초콜릿 칩 스콘', type: ['FOOD'],
      tags: ['#달콤한', '#진한초코', '#디저트']
    },
    {
      id: 'lotus_bischoff_babka', name: '로투스 비스코프 바브카', type: ['FOOD'],
      tags: ['#달콤한', '#시나몬/향신료', '#카라멜', '#디저트']
    },
    {
      id: 'tangjong_blueberry_bagel', name: '탕종 블루베리 베이글', type: ['FOOD'],
      tags: ['#새콤달콤', '#과일', '#담백한']
    },
    {
      id: 'tangjong_parmesan_bagel', name: '탕종 파마산 치즈 베이글', type: ['FOOD'],
      tags: ['#짭짤한', '#치즈', '#고소한', '#식사대용']
    },
    {
      id: 'tangjong_plain_bagel', name: '탕종 플레인 베이글', type: ['FOOD'],
      tags: ['#담백한', '#식사대용']
    },
    {
      id: 'english_scone', name: '잉글리쉬 스콘', type: ['FOOD'],
      tags: ['#담백한', '#고소한']
    },
    {
      id: 'peanut_ssuk_scone', name: '피넛 쑥 떡 스콘', type: ['FOOD'],
      tags: ['#고소한', '#흑임자/쑥', '#할매니얼']
    },
    {
      id: 'geomun_oreum_croissant', name: '거문 오름 크루아상', type: ['FOOD'],
      tags: ['#진한초코', '#달콤한', '#제주한정']
    },
    {
      id: 'glazed_donut', name: '글레이즈드 도넛', type: ['FOOD'],
      tags: ['#달콤한', '#클래식']
    },
    {
      id: 'sausage_pretzel_salt_bread', name: '소시지 프레첼 소금빵', type: ['FOOD'],
      tags: ['#짭짤한', '#든든한', '#식사대용']
    },
    {
      id: 'redbean_cream_bread', name: '우리 단팥 크림 소라빵', type: ['FOOD'],
      tags: ['#달콤한', '#크리미', '#어르신취향']
    },
    {
      id: 'french_croissant', name: '프렌치 크루아상', type: ['FOOD'],
      tags: ['#고소한', '#버터풍미', '#담백한']
    },
  
    // 🍰 케이크 & 디저트 (Cake & Dessert)
    {
      id: 'fruit_cream_cake', name: '과일 생크림 케이크', type: ['FOOD'],
      tags: ['#달콤한', '#과일', '#크리미', '#부드러운']
    },
    {
      id: 'black_sapphire_cheesecake', name: '블랙 사파이어 치즈 케이크', type: ['FOOD'],
      tags: ['#새콤달콤', '#과일', '#치즈', '#크리미']
    },
    {
      id: 'strawberry_choco_cake', name: '딸기 촉촉 초코 생크림 케이크', type: ['FOOD'],
      tags: ['#달콤한', '#진한초코', '#과일']
    },
    {
      id: 'ladyfinger_tiramisu', name: '레이디핑거 티라미수 케이크', type: ['FOOD'],
      tags: ['#진한커피', '#크리미', '#치즈', '#카페인']
    },
    {
      id: 'basque_choco_cheesecake', name: '바스크 초코 치즈 케이크', type: ['FOOD'],
      tags: ['#진한초코', '#치즈', '#달콤한']
    },
    {
      id: 'soft_cream_castella', name: '부드러운 생크림 카스텔라', type: ['FOOD'],
      tags: ['#달콤한', '#크리미', '#부드러운', '#클래식']
    },
    {
      id: 'black_sesame_roll', name: '부드러운 흑임자 롤', type: ['FOOD'],
      tags: ['#고소한', '#흑임자/쑥', '#크리미', '#할매니얼']
    },
    {
      id: 'blueberry_cookie_cheesecake', name: '블루베리 쿠키 치즈 케이크', type: ['FOOD'],
      tags: ['#새콤달콤', '#치즈', '#과일', '#달콤한']
    },
    {
      id: 'ganache_9layer_cake', name: '진한 가나슈 9 레이어 케이크', type: ['FOOD'],
      tags: ['#진한초코', '#극강의달콤함', '#초코덕후']
    },
    {
      id: 'carrot_basalt_cake', name: '당근 현무암 케이크', type: ['FOOD'],
      tags: ['#시나몬/향신료', '#고소한', '#크리미', '#제주한정']
    },
    {
      id: 'mascarpone_tiramisu', name: '마스카포네 티라미수', type: ['FOOD'],
      tags: ['#진한커피', '#크리미', '#치즈', '#카페인']
    },
    {
      id: 'ganache_7layer_cake', name: '세븐 레이어 가나슈 케이크', type: ['FOOD'],
      tags: ['#진한초코', '#달콤한', '#초코덕후']
    },
  
    // 🥪 샌드위치 & 샐러드 (Sandwich & Salad)
    {
      id: 'blt_sandwich', name: 'B.L.T. 샌드위치', type: ['FOOD'],
      tags: ['#짭짤한', '#식사대용', '#든든한', '#클래식']
    },
    {
      id: 'fresh_garden_chicken_box', name: '프레시 가든 치킨 밀박스', type: ['FOOD'],
      tags: ['#건강한', '#가벼운', '#식사대용']
    },
    {
      id: 'double_egg_sandwich', name: '더블 에그 브렉퍼스트 & 체다 샌드위치', type: ['FOOD'],
      tags: ['#짭짤한', '#고소한', '#든든한', '#아침메뉴']
    },
    {
      id: 'ham_rucola_pesto_sandwich', name: '햄 & 루꼴라 페스토 샌드위치', type: ['FOOD'],
      tags: ['#짭짤한', '#향긋한', '#식사대용']
    },
  
    // 🥣 기타 (푸드)
    {
      id: 'truffle_mushroom_soup', name: '트러플 머쉬룸 수프', type: ['FOOD'],
      tags: ['#고소한', '#향긋한', '#따뜻한', '#가벼운식사']
    },
    {
      id: 'organic_greek_yogurt', name: '오가닉 그릭 요거트 플레인', type: ['FOOD'],
      tags: ['#담백한', '#건강한', '#가벼운', '#요거트']
    },
    {
      id: 'mini_sweet_potato', name: '한 입에 쏙 고구마', type: ['FOOD'],
      tags: ['#달콤한', '#건강한', '#간편스낵']
    },
  
    // ===================================
    // PART 2: 음료 메뉴 (Drink Menu)
    // ===================================
  
    // ☕ 커피 메뉴 (Coffee)
    {
      id: 'americano', name: '카페 아메리카노', type: ['HOT', 'ICED'],
      tags: ['#진한커피', '#씁쓸한', '#기본', '#인기', '#카페인', '#디카페인 가능', '#깔끔한']
    },
    {
      id: 'latte', name: '카페 라떼', type: ['HOT', 'ICED'],
      tags: ['#부드러운커피', '#고소한', '#기본', '#인기', '#카페인', '#디카페인 가능', '#식사대용']
    },
    {
      id: 'dolce_latte', name: '스타벅스 돌체 라떼', type: ['HOT', 'ICED'],
      tags: ['#달콤한', '#크리미', '#부드러운커피', '#시그니처', '#인기', '#카페인', '#디카페인 가능']
    },
    {
      id: 'caramel_macchiato', name: '카라멜 마키아또', type: ['HOT', 'ICED'],
      tags: ['#달콤한', '#카라멜', '#부드러운커피', '#인기', '#카페인', '#디카페인 가능']
    },
    {
      id: 'vanilla_cream_cold_brew', name: '바닐라 크림 콜드 브루', type: ['ICED'],
      tags: ['#달콤한', '#바닐라', '#크리미', '#부드러운커피', '#고카페인', '#인기']
    },
    {
      id: 'java_chip_frappuccino', name: '자바 칩 프라푸치노', type: ['ICED'],
      tags: ['#달콤한', '#진한초코', '#커피맛', '#디저트음료', '#휘핑', '#카페인', '#디카페인 가능']
    },
    {
      id: 'double_espresso_chip_frappe', name: '더블 에스프레소 칩 프라푸치노', type: ['ICED'],
      tags: ['#진한커피', '#달콤한', '#디저트음료', '#고카페인', '#휘핑']
    },
    {
      id: 'injeolmi_cream_latte', name: '인절미 크림 라떼', type: ['HOT', 'ICED'],
      tags: ['#고소한', '#달콤한', '#할매니얼', '#카페인(커피)', '#디카페인 가능']
    },
  
    // 🍵 티 & 논카페인 (Tea & Non-Caffeine)
    {
      id: 'gfh_black_tea', name: '자몽 허니 블랙 티', type: ['HOT', 'ICED'],
      tags: ['#새콤달콤', '#과일', '#인기', '#티(Tea)', '#카페인(티)', '#리프레시']
    },
    {
      id: 'jeju_matcha_latte', name: '제주 말차 라떼', type: ['HOT', 'ICED'],
      tags: ['#녹차/말차', '#쌉쌀달콤', '#고소한', '#티(Tea)', '#카페인(티)']
    },
    {
      id: 'mint_blend_tea', name: '민트 블렌드 티', type: ['HOT', 'ICED'],
      tags: ['#상쾌한', '#민트', '#향긋한', '#티(Tea)', '#논카페인', '#깔끔한']
    },
    {
      id: 'chamomile_blend_tea', name: '캐모마일 블렌드 티', type: ['HOT', 'ICED'],
      tags: ['#향긋한', '#안정', '#릴렉스', '#티(Tea)', '#논카페인', '#깔끔한']
    },
    {
      id: 'cool_lime_fizzio', name: '쿨 라임 피지오', type: ['ICED'],
      tags: ['#상큼한', '#라임', '#청량한', '#카페인(소량)', '#리프레시']
    },
    {
      id: 'strawberry_acai_refresher', name: '딸기 아사이 레모네이드 리프레셔', type: ['ICED'],
      tags: ['#새콤달콤', '#과일', '#청량한', '#카페인(소량)', '#리프레시']
    },
    {
      id: 'strawberry_delight_yogurt', name: '딸기 딜라이트 요거트 블렌디드', type: ['ICED'],
      tags: ['#새콤달콤', '#과일', '#요거트', '#든든한', '#논카페인', '#디저트음료']
    },
    {
      id: 'signature_hot_chocolate', name: '시그니처 핫 초콜릿', type: ['HOT', 'ICED'], // 아이스도 가능
      tags: ['#진한초코', '#달콤한', '#크리미', '#논카페인', '#따뜻한']
    }
  ];