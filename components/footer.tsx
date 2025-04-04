// components/footer.tsx
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-100 py-4 mt-auto" role="contentinfo">
      <div className="container mx-auto text-center text-gray-600">
        &copy; {new Date().getFullYear()} My E-commerce Store. All rights reserved.
      </div>
    </footer>
  );
}
