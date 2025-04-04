import { render, screen, fireEvent } from '@testing-library/react';
import { ReviewCard } from '@/app/admin/reviews/page';

const mockReview = {
  id: '1',
  productId: 'product1',
  customerId: {
    name: 'عميل تجريبي',
    image: '/placeholder-user.jpg'
  },
  rating: 4,
  comment: 'تعليق تجريبي للمراجعة',
  status: 'pending',
  createdAt: '2024-02-20T12:00:00.000Z'
};

const mockHandleUpdateStatus = jest.fn();

describe('ReviewCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('يعرض معلومات المراجعة بشكل صحيح', () => {
    render(<ReviewCard review={mockReview} />);
    
    expect(screen.getByText('عميل تجريبي')).toBeInTheDocument();
    expect(screen.getByText('تعليق تجريبي للمراجعة')).toBeInTheDocument();
    expect(screen.getByText('★★★★☆')).toBeInTheDocument();
  });

  it('يعرض أزرار القبول والرفض للمراجعات المعلقة', () => {
    render(<ReviewCard review={mockReview} />);
    
    expect(screen.getByText('قبول')).toBeInTheDocument();
    expect(screen.getByText('رفض')).toBeInTheDocument();
  });

  it('لا يعرض أزرار القبول والرفض للمراجعات المعتمدة', () => {
    const approvedReview = { ...mockReview, status: 'approved' };
    render(<ReviewCard review={approvedReview} />);
    
    expect(screen.queryByText('قبول')).not.toBeInTheDocument();
    expect(screen.queryByText('رفض')).not.toBeInTheDocument();
  });

  it('يعرض ملاحظة الإشراف عند وجودها', () => {
    const reviewWithNote = {
      ...mockReview,
      moderationNote: 'ملاحظة إشرافية'
    };
    render(<ReviewCard review={reviewWithNote} />);
    
    expect(screen.getByText('ملاحظة الإشراف: ملاحظة إشرافية')).toBeInTheDocument();
  });
});