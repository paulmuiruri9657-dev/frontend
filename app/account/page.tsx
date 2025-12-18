'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileSkeleton } from '@/components/skeletons/ProfileSkeleton';

export default function AccountPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the comprehensive profile page
        router.replace('/profile');
    }, [router]);

    return <ProfileSkeleton />;
}
