export interface Destination {
  id: string;
  name: string;
  country: string;
  image?: string;
  description?: string;
  airport?: string;
}

export interface FlightData {
  id: string;
  airline: string;
  airlineCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
  aircraft: string;
  departureDate: string;
  returnDate: string;
  savings: number;
}

export interface SavedTrip {
  id: string;
  destination: string;
  destinationId: string;
  country: string;
  airport: string;
  duration: number;
  month: string;
  flight: FlightData;
  savedAt: string;
}

export interface Airline {
  code: string;
  name: string;
  logo: string;
}

export interface Duration {
  days: number;
  label: string;
  description: string;
}

export interface Month {
  value: string;
  label: string;
  description: string;
}
