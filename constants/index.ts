import type { Destination, Airline, Duration, Month } from '@/types';

export const destinations: Destination[] = [
  {
    id: 'paris',
    name: '파리',
    country: '프랑스',
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20Paris%20cityscape%20with%20Eiffel%20Tower%20in%20soft%20pastel%20blue%20and%20purple%20tones%2C%20dreamy%20atmosphere%2C%20romantic%20European%20architecture%2C%20gentle%20lighting%2C%20minimalist%20aesthetic%20background&width=400&height=300&seq=paris1&orientation=landscape',
    description: '로맨틱한 유럽의 중심지',
    airport: 'CDG'
  },
  {
    id: 'tokyo',
    name: '도쿄',
    country: '일본',
    image: 'https://readdy.ai/api/search-image?query=Modern%20Tokyo%20skyline%20with%20cherry%20blossoms%20in%20soft%20pastel%20purple%20and%20blue%20tones%2C%20serene%20Japanese%20cityscape%2C%20gentle%20lighting%2C%20minimalist%20aesthetic%20background&width=400&height=300&seq=tokyo1&orientation=landscape',
    description: '전통과 현대가 만나는 도시',
    airport: 'NRT'
  },
  {
    id: 'santorini',
    name: '산토리니',
    country: '그리스',
    image: 'https://readdy.ai/api/search-image?query=Santorini%20white%20buildings%20and%20blue%20domes%20in%20soft%20pastel%20blue%20and%20purple%20tones%2C%20Mediterranean%20sea%20view%2C%20dreamy%20Greek%20island%20atmosphere%2C%20gentle%20lighting%2C%20minimalist%20aesthetic%20background&width=400&height=300&seq=santorini1&orientation=landscape',
    description: '에게해의 보석 같은 섬',
    airport: 'JTR'
  },
  {
    id: 'bali',
    name: '발리',
    country: '인도네시아',
    image: 'https://readdy.ai/api/search-image?query=Tropical%20Bali%20landscape%20with%20rice%20terraces%20and%20temples%20in%20soft%20pastel%20blue%20and%20purple%20tones%2C%20peaceful%20Indonesian%20paradise%2C%20gentle%20lighting%2C%20minimalist%20aesthetic%20background&width=400&height=300&seq=bali1&orientation=landscape',
    description: '열대 낙원의 평화로운 섬',
    airport: 'DPS'
  },
  {
    id: 'iceland',
    name: '아이슬란드',
    country: '아이슬란드',
    image: 'https://readdy.ai/api/search-image?query=Iceland%20northern%20lights%20and%20glacial%20landscape%20in%20soft%20pastel%20blue%20and%20purple%20tones%2C%20mystical%20Nordic%20scenery%2C%20aurora%20borealis%2C%20gentle%20lighting%2C%20minimalist%20aesthetic%20background&width=400&height=300&seq=iceland1&orientation=landscape',
    description: '신비로운 북유럽의 자연',
    airport: 'KEF'
  },
  {
    id: 'maldives',
    name: '몰디브',
    country: '몰디브',
    image: 'https://readdy.ai/api/search-image?query=Maldives%20crystal%20clear%20waters%20and%20overwater%20bungalows%20in%20soft%20pastel%20blue%20and%20purple%20tones%2C%20tropical%20paradise%2C%20peaceful%20ocean%20view%2C%20gentle%20lighting%2C%20minimalist%20aesthetic%20background&width=400&height=300&seq=maldives1&orientation=landscape',
    description: '인도양의 수상 낙원',
    airport: 'MLE'
  }
];

export const airlines: Airline[] = [
  { code: 'KE', name: '대한항공', logo: '🇰🇷' },
  { code: 'OZ', name: '아시아나항공', logo: '🇰🇷' },
  { code: 'AF', name: '에어프랑스', logo: '🇫🇷' },
  { code: 'LH', name: '루프트한자', logo: '🇩🇪' },
  { code: 'JL', name: '일본항공', logo: '🇯🇵' },
  { code: 'ANA', name: '전일본공수', logo: '🇯🇵' },
  { code: 'EK', name: '에미레이트', logo: '🇦🇪' },
  { code: 'QR', name: '카타르항공', logo: '🇶🇦' },
  { code: 'SQ', name: '싱가포르항공', logo: '🇸🇬' }
];

export const durations: Duration[] = [
  { days: 3, label: '3일', description: '주말 여행' },
  { days: 5, label: '5일', description: '짧은 휴가' },
  { days: 7, label: '7일', description: '일주일 여행' },
  { days: 10, label: '10일', description: '여유로운 여행' },
  { days: 14, label: '14일', description: '장기 여행' },
  { days: 21, label: '21일', description: '깊이 있는 탐험' }
];

export const months: Month[] = [
  { value: '2024-03', label: '3월', description: '봄의 시작' },
  { value: '2024-04', label: '4월', description: '벚꽃 시즌' },
  { value: '2024-05', label: '5월', description: '완연한 봄' },
  { value: '2024-06', label: '6월', description: '초여름' },
  { value: '2024-07', label: '7월', description: '여름 성수기' },
  { value: '2024-08', label: '8월', description: '휴가철' },
  { value: '2024-09', label: '9월', description: '가을 시작' },
  { value: '2024-10', label: '10월', description: '단풍 시즌' },
  { value: '2024-11', label: '11월', description: '늦가을' },
  { value: '2024-12', label: '12월', description: '겨울 여행' }
];
