// app/services/notificationService.ts
type NotificationType = 'order_update' | 'new_product' | 'promotion' | 'wishlist';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
};

export const sendNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: Record<string, any>
): Promise<Notification> => {
  // In a real implementation, this would save to database
  const notification: Notification = {
    id: Math.random().toString(36).substring(2, 9),
    type,
    title,
    message,
    userId,
    read: false,
    createdAt: new Date(),
    metadata
  };

  // TODO: Implement actual notification delivery (in-app, email, push)
  return notification;
};

export const getUnreadNotifications = async (userId: string): Promise<Notification[]> => {
  // In a real implementation, this would query your database
  return [];
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  // In a real implementation, this would update in database
};

export const sendOrderUpdateNotification = async (
  userId: string,
  orderId: string,
  status: string
): Promise<void> => {
  await sendNotification(
    userId,
    'order_update',
    'تحديث حالة الطلب',
    `تم تحديث حالة طلبك #${orderId} إلى "${status}"`,
    { orderId }
  );
};

export const sendNewProductNotification = async (
  userId: string,
  productId: string,
  productName: string
): Promise<void> => {
  await sendNotification(
    userId,
    'new_product',
    'منتج جديد في قائمة رغباتك',
    `تمت إضافة المنتج "${productName}" إلى المتجر`,
    { productId }
  );
};

export const sendPromotionNotification = async (
  userId: string,
  promotionName: string,
  discount: string
): Promise<void> => {
  await sendNotification(
    userId,
    'promotion',
    'عرض خاص',
    `خصم ${discount} على ${promotionName}`,
    { promotionName }
  );
};