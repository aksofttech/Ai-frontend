'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDirectoryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin?tab=users');
  }, [router]);

  return (
    <div className="p-12 flex justify-center items-center text-cs-gray font-semibold">
      Redirecting to User Management Canvas...
    </div>
  );
}
