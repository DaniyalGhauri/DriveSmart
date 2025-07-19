"use client";

import { useAuthContext } from '@/lib/authContext';

export default function RoleTest() {
    const { user } = useAuthContext();

    if (!user) {
        return (
            <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
                <h3 className="font-bold">Authentication Status</h3>
                <p>Not logged in</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-green-100 border border-green-400 rounded">
            <h3 className="font-bold">Authentication Status</h3>
            <p><strong>User:</strong> {user.name || user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
            
            <div className="mt-4">
                <h4 className="font-semibold">Access Permissions:</h4>
                <ul className="list-disc list-inside">
                    <li>Company Dashboard: {user.role === 'company' ? '✅' : '❌'}</li>
                    <li>Admin Dashboard: {user.role === 'admin' ? '✅' : '❌'}</li>
                    <li>User Features: {user.role === 'customer' ? '✅' : '❌'}</li>
                </ul>
            </div>
        </div>
    );
} 