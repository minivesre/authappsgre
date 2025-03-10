import React from 'react';
import { useRouter } from 'next/router';

function UserPage() {
    const router = useRouter();

    const handleLogout = () => {
        // Hapus token atau sesi pengguna jika ada
        localStorage.removeItem('token');
        alert('You have been logged out.');
        router.push('/login'); // Redirect ke halaman login
    };

    return (
        <div>
            <h1>User Dashboard</h1>
            <p>Welcome, User!</p>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mt-4">Logout</button>
        </div>
    );
}

export default UserPage;
