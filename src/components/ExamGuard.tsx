'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type AccessType = 'FREE' | 'PAID';

export function ExamGuard({
  courseId,
  accessType,
}: {
  courseId: string;
  accessType: AccessType;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("AccessType from ", accessType);
    if (status === 'loading') return;

    // Admin bypass (optional but recommended)
    if (session?.user?.role === 'ADMIN') return;

    // FREE exam → always allow
    if (accessType === 'FREE') return;

    // PAID exam → must be enrolled
    const isSubscribed = session?.user?.enrollments?.some(
      (e) => e.courseId === courseId
    );

    if (!isSubscribed) {
      router.push(`/subscribe?courseId=${courseId}`);
    }
  }, [status, session, courseId, accessType, router]);

  return null;
}
