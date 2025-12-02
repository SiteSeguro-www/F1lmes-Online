export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  freeShipping: boolean;
  fullDelivery: boolean;
  rating: number;
  reviews: number;
  installments: number;
  description: string;
  category: string;
  sold: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type SortOption = 'relevance' | 'lowest-price' | 'highest-price';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}