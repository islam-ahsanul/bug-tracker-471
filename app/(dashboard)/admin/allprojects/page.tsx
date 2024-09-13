// app/admin/allprojects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types for Project
interface Project {
  id: string;
  name: string;
  description: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]); // State typed as Project[]
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/admin/projects');
        const data = await res.json();
        setProjects(data.projects);
      } catch (err) {
        console.error('Error fetching projects', err);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (res.ok) {
        router.refresh(); // Refresh page to show new project
      }
    } catch (err) {
      console.error('Error creating project', err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <div className="mb-6">
        <h2 className="text-xl mb-2">Create New Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) =>
            setNewProject({ ...newProject, name: e.target.value })
          }
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Project Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
          className="border p-2 mb-2"
        />
        <button
          onClick={handleCreateProject}
          className="bg-blue-500 text-white py-2 px-4"
        >
          Create Project
        </button>
      </div>

      <h2 className="text-xl mb-2">Existing Projects</h2>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li key={project.id} className="p-4 border-b">
            <h3 className="font-semibold">{project.name}</h3>
            <p>{project.description}</p>
            <div>
              <button
                onClick={() => router.push(`/admin/allprojects/${project.id}`)}
                className="bg-green-500 text-white py-1 px-3 mt-2"
              >
                Manage
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
