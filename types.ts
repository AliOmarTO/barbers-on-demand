export interface Barber {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  clients: number;
  avatar: string;
  address: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}
