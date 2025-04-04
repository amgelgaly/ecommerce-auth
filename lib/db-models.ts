export interface Product {
  _id: string;
  id: string; // Assuming id is added in model transform
  name: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Category {
  _id: string;
  name: string;
  image?: string;
}
