'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Project {
  id: string;
  name: string;
  description: string;
  manager: User | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: string;
}

export default function ProjectDetails() {
  const [project, setProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [developers, setDevelopers] = useState<User[]>([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>('');
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const params = useParams();
  const { projectId } = params;

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectAndUsers = async () => {
      try {
        const projectRes = await fetch(`/api/admin/projects/${projectId}`);
        const { project, developers } = await projectRes.json();
        setProject(project);
        setDevelopers(developers);

        const usersRes = await fetch('/api/admin/users');
        const usersData = await usersRes.json();
        setUsers(usersData.users);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    };

    fetchProjectAndUsers();
  }, [projectId]);

  const handleAssignDeveloper = async () => {
    if (!selectedDeveloper) return;
    try {
      const res = await fetch(
        `/api/admin/projects/${projectId}/assign-developer`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ developerId: selectedDeveloper }),
        }
      );
      if (res.ok) {
        const newDeveloper = users.find(
          (user) => user.id === selectedDeveloper
        );
        if (newDeveloper) {
          setDevelopers([...developers, newDeveloper]);
          setSelectedDeveloper('');
        }
      }
    } catch (err) {
      console.error('Error assigning developer', err);
    }
  };

  const handleAssignManager = async () => {
    if (!selectedManager) return;
    try {
      const res = await fetch(
        `/api/admin/projects/${projectId}/assign-manager`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ managerId: selectedManager }),
        }
      );
      if (res.ok) {
        const newManager = users.find((user) => user.id === selectedManager);
        if (newManager && project) {
          setProject({ ...project, manager: newManager });
          setSelectedManager(null);
        }
      }
    } catch (err) {
      console.error('Error assigning manager', err);
    }
  };

  const handleRemoveManager = async () => {
    try {
      const res = await fetch(
        `/api/admin/projects/${projectId}/remove-manager`,
        {
          method: 'DELETE',
        }
      );
      if (res.ok && project) {
        setProject({ ...project, manager: null });
      }
    } catch (err) {
      console.error('Error removing manager', err);
    }
  };

  const handleRemoveDeveloper = async (developerId: string) => {
    try {
      const res = await fetch(
        `/api/admin/projects/${projectId}/remove-developer`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ developerId }),
        }
      );
      if (res.ok) {
        setDevelopers(developers.filter((dev) => dev.id !== developerId));
      }
    } catch (err) {
      console.error('Error removing developer', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {project ? (
        <div>
          <h1 className="text-3xl font-bold mb-6">{project.name}</h1>
          <p className="text-gray-600 mb-8">{project.description}</p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Project Manager</h2>
            {project.manager ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{project.manager.name}</p>
                  <p className="text-gray-500">{project.manager.email}</p>
                </div>
                <button
                  onClick={handleRemoveManager}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300"
                >
                  Remove Manager
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No manager assigned</p>
            )}

            <div className="mt-4">
              <select
                value={selectedManager || ''}
                onChange={(e) => setSelectedManager(e.target.value)}
                className="border rounded p-2 mr-2"
              >
                <option value="">Select Manager</option>
                {users
                  .filter((user) => user.roles === 'MANAGER')
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
              <button
                onClick={handleAssignManager}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
              >
                Assign Manager
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Project Developers</h2>
            {developers.length > 0 ? (
              <ul className="space-y-2">
                {developers.map((dev) => (
                  <li
                    key={dev.id}
                    className="flex items-center justify-between bg-gray-100 p-3 rounded"
                  >
                    <div>
                      <p className="font-medium">{dev.name}</p>
                      <p className="text-gray-500">{dev.email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveDeveloper(dev.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No developers assigned</p>
            )}

            <div className="mt-4">
              <select
                value={selectedDeveloper}
                onChange={(e) => setSelectedDeveloper(e.target.value)}
                className="border rounded p-2 mr-2"
              >
                <option value="">Select Developer</option>
                {users
                  .filter(
                    (user) =>
                      user.roles === 'DEVELOPER' &&
                      !developers.some((dev) => dev.id === user.id)
                  )
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
              <button
                onClick={handleAssignDeveloper}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300"
              >
                Assign Developer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
