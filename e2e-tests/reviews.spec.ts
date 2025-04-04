import { test, expect } from '@playwright/test';

test.describe('نظام إدارة المراجعات', () => {
  test.beforeEach(async ({ page }) => {
    // تسجيل الدخول كمشرف
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('يمكن للمشرف عرض وإدارة المراجعات المعلقة', async ({ page }) => {
    // الانتقال إلى صفحة المراجعات
    await page.goto('/admin/reviews');
    await expect(page.locator('h1')).toContainText('إدارة التقييمات');

    // التأكد من وجود علامة التبويب "معلق"
    const pendingTab = page.getByRole('tab', { name: /معلق/ });
    await expect(pendingTab).toBeVisible();
    await pendingTab.click();

    // اختبار قبول مراجعة
    const firstReview = page.locator('.card').first();
    if (await firstReview.isVisible()) {
      const approveButton = firstReview.getByRole('button', { name: 'قبول' });
      await approveButton.click();
      await expect(page.getByText('تم تحديث حالة التقييم بنجاح')).toBeVisible();
    }

    // اختبار رفض مراجعة
    const secondReview = page.locator('.card').nth(1);
    if (await secondReview.isVisible()) {
      const rejectButton = secondReview.getByRole('button', { name: 'رفض' });
      await rejectButton.click();
      await page.fill('[role="dialog"] input', 'مخالف للشروط');
      await page.click('[role="dialog"] button:has-text("تأكيد")');
      await expect(page.getByText('تم تحديث حالة التقييم بنجاح')).toBeVisible();
    }
  });

  test('يمكن للمشرف عرض المراجعات المقبولة والمرفوضة', async ({ page }) => {
    await page.goto('/admin/reviews');

    // التحقق من المراجعات المقبولة
    const approvedTab = page.getByRole('tab', { name: /مقبول/ });
    await approvedTab.click();
    await expect(page.locator('div[role="tabpanel"]')).toBeVisible();

    // التحقق من المراجعات المرفوضة
    const rejectedTab = page.getByRole('tab', { name: /مرفوض/ });
    await rejectedTab.click();
    await expect(page.locator('div[role="tabpanel"]')).toBeVisible();
  });

  test('يعرض رسائل مناسبة عندما لا توجد مراجعات', async ({ page }) => {
    await page.goto('/admin/reviews');

    // التحقق من رسالة عدم وجود مراجعات معلقة
    const pendingTab = page.getByRole('tab', { name: /معلق/ });
    await pendingTab.click();
    await expect(page.getByText('لا توجد تقييمات معلقة')).toBeVisible();

    // التحقق من رسالة عدم وجود مراجعات مقبولة
    const approvedTab = page.getByRole('tab', { name: /مقبول/ });
    await approvedTab.click();
    await expect(page.getByText('لا توجد تقييمات مقبولة')).toBeVisible();

    // التحقق من رسالة عدم وجود مراجعات مرفوضة
    const rejectedTab = page.getByRole('tab', { name: /مرفوض/ });
    await rejectedTab.click();
    await expect(page.getByText('لا توجد تقييمات مرفوضة')).toBeVisible();
  });
});