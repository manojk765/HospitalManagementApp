import React from 'react';

const AdminPage = () => {
    return (
        <div className="admin-dashboard p-6">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <section className="welcome-section mb-6">
                <h2 className="text-2xl font-semibold mb-2">Welcome, Admin!</h2>
                <p className="text-lg">Here you can manage users, view reports, and configure settings.</p>
            </section>
            <section className="quick-links-section">
                <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
                <ul className="list-disc list-inside">
                    <li className="mb-1"><a href="/admin/users" className="text-blue-500 hover:underline">Manage Users</a></li>
                    <li className="mb-1"><a href="/admin/reports" className="text-blue-500 hover:underline">View Reports</a></li>
                    <li className="mb-1"><a href="/admin/settings" className="text-blue-500 hover:underline">Settings</a></li>
                </ul>
            </section>
        </div>
    );
};

export default AdminPage;