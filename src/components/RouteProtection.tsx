"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/lib/authContext';

type RouteProtectionProps = {
    children: React.ReactNode;
    allowedRoles: string[];
    redirectTo?: string;
};

export default function RouteProtection({ 
    children, 
    allowedRoles, 
    redirectTo = '/' 
}: RouteProtectionProps) {
    const { user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            // User is not authenticated, redirect to login
            router.push('/login');
            return;
        }

        if (user && !allowedRoles.includes(user.role)) {
            // User is authenticated but doesn't have the required role
            router.push(redirectTo);
            return;
        }
    }, [user, allowedRoles, redirectTo, router]);

    // Show loading while checking authentication
    if (user === null) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // If user doesn't have the required role, don't render children
    if (!allowedRoles.includes(user.role)) {
        return null;
    }

    // User is authenticated and has the required role
    return <>{children}</>;
} 