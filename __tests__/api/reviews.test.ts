import { NextRequest } from 'next/server';
import { POST, PATCH, GET } from '@/app/api/reviews/route';
import { getServerSession } from 'next-auth/next';
import { Review } from '@/lib/models/review';
import { dbConnect } from '@/lib/dbConnect';

jest.mock('next-auth/next');
jest.mock('@/lib/dbConnect');
jest.mock('@/lib/models/review');

describe('Reviews API', () => {
  const mockSession = {
    user: {
      id: 'user1',
      role: 'admin'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (dbConnect as jest.Mock).mockResolvedValue(undefined);
  });

  describe('POST /api/reviews', () => {
    it('يجب أن يتحقق من صحة بيانات المراجعة', async () => {
      const req = new NextRequest('http://localhost:3000/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          productId: '',
          rating: 0,
          comment: 'قصير'
        })
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('خطأ في التحقق من البيانات');
      expect(data.errors).toBeDefined();
    });

    it('يجب أن ينشئ مراجعة جديدة بنجاح', async () => {
      const mockReview = {
        productId: 'product1',
        rating: 4,
        comment: 'تعليق تجريبي للمراجعة'
      };

      (Review.create as jest.Mock).mockResolvedValue(mockReview);

      const req = new NextRequest('http://localhost:3000/api/reviews', {
        method: 'POST',
        body: JSON.stringify(mockReview)
      });

      const response = await POST(req);
      expect(response.status).toBe(201);
    });
  });

  describe('PATCH /api/reviews', () => {
    it('يجب أن يتحقق من صلاحيات المشرف', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { role: 'user' }
      });

      const req = new NextRequest('http://localhost:3000/api/reviews', {
        method: 'PATCH',
        body: JSON.stringify({
          reviewId: 'review1',
          status: 'approved'
        })
      });

      const response = await PATCH(req);
      expect(response.status).toBe(401);
    });

    it('يجب أن يحدث حالة المراجعة بنجاح', async () => {
      const mockUpdatedReview = {
        id: 'review1',
        status: 'approved',
        moderationNote: 'تم الموافقة'
      };

      (Review.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedReview);

      const req = new NextRequest('http://localhost:3000/api/reviews', {
        method: 'PATCH',
        body: JSON.stringify(mockUpdatedReview)
      });

      const response = await PATCH(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('approved');
    });
  });

  describe('GET /api/reviews', () => {
    it('يجب أن يجلب المراجعات حسب الحالة', async () => {
      const mockReviews = [
        { id: 'review1', status: 'pending' },
        { id: 'review2', status: 'pending' }
      ];

      (Review.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockReviews)
        })
      });

      const req = new NextRequest('http://localhost:3000/api/reviews?status=pending');
      const response = await GET(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].status).toBe('pending');
    });
  });
});