'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';


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
  const router = useRouter();
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
        router.refresh(); 
      }
    } catch (err) {
      console.error('Error assigning developer', err);
    }
  };

 
  const handleAssignManager = async () => {
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
        router.refresh(); 
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
      if (res.ok) {
        router.refresh(); 
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
        router.refresh(); 
      }
    } catch (err) {
      console.error('Error removing developer', err);
    }
  };

  return (
    <div>
      {project ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Project: {project.name}</h1>
          <p>{project.description}</p>

          <h2 className="text-xl mt-6 mb-2">Current Manager</h2>
          {project.manager ? (
            <div>
              <p>
                {project.manager.name} ({project.manager.email})
              </p>
              <button
                onClick={handleRemoveManager}
                className="bg-red-500 text-white py-2 px-4 mt-2"
              >
                Remove Manager
              </button>
            </div>
          ) : (
            <p>No manager assigned</p>
          )}

          <h2 className="text-xl mt-6 mb-2">Assign Manager</h2>
          <select
            value={selectedManager || ''}
            onChange={(e) => setSelectedManager(e.target.value)}
            className="border p-2 mb-4"
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
            className="bg-blue-500 text-white py-2 px-4"
          >
            Assign Manager
          </button>

          <h2 className="text-xl mt-6 mb-2">Current Developers</h2>
          {developers.length > 0 ? (
            <ul>
              {developers.map((dev) => (
                <li key={dev.id}>
                  {dev.name} ({dev.email}){' '}
                  <button
                    onClick={() => handleRemoveDeveloper(dev.id)}
                    className="bg-red-500 text-white py-1 px-2 ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No developers assigned</p>
          )}

          <h2 className="text-xl mt-6 mb-2">Assign Developer</h2>
          <select
            value={selectedDeveloper}
            onChange={(e) => setSelectedDeveloper(e.target.value)}
            className="border p-2 mb-4"
          >
            <option value="">Select Developer</option>
            {users
              .filter(
                (user) =>
                  user.roles === 'DEVELOPER' &&
                  !developers.some((dev) => dev.id === user.id)
              ) // Exclude already assigned developers
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
          </select>
          <button
            onClick={handleAssignDeveloper}
            className="bg-green-500 text-white py-2 px-4"
          >
            Assign Developer
          </button>
        </div>
      ) : (
        <p>Loading project...</p>
      )}
    </div>
  );
}
