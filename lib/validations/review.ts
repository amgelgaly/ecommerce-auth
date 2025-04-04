import { z } from 'zod';

export const reviewSchema = z.object({
  productId: z.string({
    required_error: 'معرف المنتج مطلوب'
  }),
  rating: z.number({
    required_error: 'التقييم مطلوب'
  }).min(1, 'التقييم يجب أن يكون بين 1 و 5').max(5, 'التقييم يجب أن يكون بين 1 و 5'),
  comment: z.string({
    required_error: 'التعليق مطلوب'
  }).min(10, 'التعليق يجب أن يكون 10 أحرف على الأقل').max(500, 'التعليق يجب أن لا يتجاوز 500 حرف'),
});

export const reviewUpdateSchema = z.object({
  reviewId: z.string({
    required_error: 'معرف المراجعة مطلوب'
  }),
  status: z.enum(['approved', 'rejected'], {
    required_error: 'حالة المراجعة غير صالحة'
  }),
  moderationNote: z.string().optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;