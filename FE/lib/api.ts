import type { FlightData } from "@/types";

export const searchFlightsViaMCP = async (
  destination: string,
  duration: number,
  month: string
): Promise<FlightData[]> => {
  // 실제 MCP 프로토콜로 외부 API 호출 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const monthNumber = parseInt(month.split("-")[1]);

  // 해당 월의 최저가 날짜들을 시뮬레이션
  const generateOptimalDates = () => {
    const year = 2024;
    const daysInMonth = new Date(year, monthNumber, 0).getDate();
    const optimalDates = [];

    // 월 중에서 가장 저렴한 5개 날짜 구간 생성
    for (let i = 0; i < 5; i++) {
      const startDay = Math.floor(Math.random() * (daysInMonth - duration)) + 1;
      const departureDate = `${year}-${monthNumber
        .toString()
        .padStart(2, "0")}-${startDay.toString().padStart(2, "0")}`;

      const returnDay = startDay + duration - 1;
      const returnDate = `${year}-${monthNumber
        .toString()
        .padStart(2, "0")}-${returnDay.toString().padStart(2, "0")}`;

      optimalDates.push({ departureDate, returnDate });
    }

    return optimalDates;
  };

  const optimalDates = generateOptimalDates();

  const airlines = [
    { code: "KE", name: "대한항공", logo: "🇰🇷" },
    { code: "OZ", name: "아시아나항공", logo: "🇰🇷" },
    { code: "AF", name: "에어프랑스", logo: "🇫🇷" },
    { code: "LH", name: "루프트한자", logo: "🇩🇪" },
    { code: "JL", name: "일본항공", logo: "🇯🇵" },
    { code: "ANA", name: "전일본공수", logo: "🇯🇵" },
    { code: "EK", name: "에미레이트", logo: "🇦🇪" },
    { code: "QR", name: "카타르항공", logo: "🇶🇦" },
  ];

  return optimalDates
    .map((dates, index) => {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const basePrice = 800000 + Math.random() * 1200000;
      const savings = Math.floor(Math.random() * 300000) + 50000;
      const finalPrice = basePrice - savings;

      const departureHour = 8 + Math.floor(Math.random() * 12);
      const departureMinute = Math.floor(Math.random() * 60);
      const flightDuration = 8 + Math.random() * 6;
      const arrivalHour = (departureHour + Math.floor(flightDuration)) % 24;
      const arrivalMinute =
        (departureMinute + Math.floor((flightDuration % 1) * 60)) % 60;

      return {
        id: `flight-${index + 1}`,
        airline: airline.name,
        airlineCode: airline.code,
        departureTime: `${departureHour
          .toString()
          .padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`,
        arrivalTime: `${arrivalHour.toString().padStart(2, "0")}:${arrivalMinute
          .toString()
          .padStart(2, "0")}`,
        duration: `${Math.floor(flightDuration)}시간 ${Math.floor(
          (flightDuration % 1) * 60
        )}분`,
        price: Math.floor(finalPrice),
        stops: Math.random() > 0.6 ? 1 : 0,
        aircraft: ["Boeing 777", "Airbus A350", "Boeing 787", "Airbus A380"][
          Math.floor(Math.random() * 4)
        ],
        departureDate: dates.departureDate,
        returnDate: dates.returnDate,
        savings: savings,
      };
    })
    .sort((a, b) => a.price - b.price);
};
