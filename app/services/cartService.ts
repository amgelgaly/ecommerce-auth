import { toast } from 'sonner';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartResponse {
  items: CartItem[];
  error?: string;
}

// استدعاء السلة من قاعدة البيانات
export async function fetchDBCart(): Promise<CartResponse> {
  try {
    const response = await fetch('/api/cart');
    if (!response.ok) throw new Error('فشل جلب السلة');
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { items: [], error: 'فشل جلب السلة' };
  }
}

// مزامنة السلة مع قاعدة البيانات
export async function syncDBCart(items: CartItem[]): Promise<CartResponse> {
  try {
    const response = await fetch('/api/cart/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    if (!response.ok) throw new Error('فشل مزامنة السلة');
    return await response.json();
  } catch (error) {
    console.error('Error syncing cart:', error);
    return { items: [], error: 'فشل مزامنة السلة' };
  }
}

// إضافة منتج للسلة
export async function addDBItem(productId: string, quantity: number): Promise<CartResponse> {
  try {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    if (!response.ok) throw new Error('فشل إضافة المنتج للسلة');
    return await response.json();
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error; // نرمي الخطأ ليتم معالجته في CartProvider
  }
}

// تحديث كمية منتج في السلة
export async function updateDBItem(productId: string, quantity: number): Promise<CartResponse> {
  try {
    const response = await fetch('/api/cart/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    if (!response.ok) throw new Error('فشل تحديث المنتج في السلة');
    return await response.json();
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

// حذف منتج من السلة
export async function removeDBItem(productId: string): Promise<CartResponse> {
  try {
    const response = await fetch(`/api/cart/remove/${productId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('فشل حذف المنتج من السلة');
    return await response.json();
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
}

// تفريغ السلة
export async function clearDBCart(): Promise<CartResponse> {
  try {
    const response = await fetch('/api/cart/clear', {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('فشل تفريغ السلة');
    return await response.json();
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}