
'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.error('Error fetching users', err);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRole }),
      });

      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, roles: newRole } : user
          )
        );
      }
    } catch (err) {
      console.error('Error changing user role', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="p-4 border-b">
            <div>
              <span className="font-semibold">{user.name}</span> ({user.email})
            </div>
            <div>
              Current Role: <strong>{user.roles}</strong>
            </div>
            <div className="mt-2">
              <select
                value={user.roles}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className="border p-2"
              >
                <option value="CONSUMER">Consumer</option>
                <option value="DEVELOPER">Developer</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
