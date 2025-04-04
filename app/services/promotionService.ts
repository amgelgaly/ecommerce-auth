// app/services/promotionService.ts
import { CartItem } from "@/context/cart-context";

type Coupon = {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  validUntil?: Date;
  appliesTo?: string[]; // Product IDs
};

type Promotion = {
  id: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: Date;
  validUntil: Date;
  appliesToAll: boolean;
  appliesToCategories?: string[];
  appliesToProducts?: string[];
};

export const applyCoupon = (cartItems: CartItem[], coupon: Coupon): number => {
  let discount = 0;
  
  // Check minimum purchase requirement
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return 0;
  }
  
  // Apply coupon to applicable items
  if (coupon.appliesTo) {
    const applicableItems = cartItems.filter(item => coupon.appliesTo?.includes(item.id));
    const applicableSubtotal = applicableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    discount = coupon.discountType === 'percentage' 
      ? applicableSubtotal * (coupon.discountValue / 100)
      : Math.min(applicableSubtotal, coupon.discountValue);
  } else {
    // Apply to all items
    discount = coupon.discountType === 'percentage' 
      ? subtotal * (coupon.discountValue / 100)
      : Math.min(subtotal, coupon.discountValue);
  }
  
  return discount;
};

export const applyPromotion = (cartItems: CartItem[], promotion: Promotion): number => {
  let discount = 0;
  
  // Filter applicable items based on promotion rules
  let applicableItems = [...cartItems];
  
  if (!promotion.appliesToAll) {
    if (promotion.appliesToCategories) {
      applicableItems = applicableItems.filter(item => 
        promotion.appliesToCategories?.includes(item.categoryId)
      );
    } else if (promotion.appliesToProducts) {
      applicableItems = applicableItems.filter(item => 
        promotion.appliesToProducts?.includes(item.id)
      );
    }
  }
  
  const applicableSubtotal = applicableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  discount = promotion.discountType === 'percentage'
    ? applicableSubtotal * (promotion.discountValue / 100)
    : Math.min(applicableSubtotal, promotion.discountValue);
  
  return discount;
};

export const validateCoupon = (couponCode: string): Promise<Coupon | null> => {
  // In a real implementation, this would query your database or API
  return Promise.resolve({
    code: 'SUMMER2023',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 100,
    validUntil: new Date('2023-12-31')
  });
};

export const getActivePromotions = (): Promise<Promotion[]> => {
  // In a real implementation, this would query your database or API
  return Promise.resolve([{
    id: 'summer-sale',
    name: 'خصم الصيف',
    description: 'خصم خاص على جميع المنتجات خلال فصل الصيف',
    discountType: 'percentage',
    discountValue: 10,
    validFrom: new Date('2023-06-01'),
    validUntil: new Date('2023-08-31'),
    appliesToAll: true
  }]);
};