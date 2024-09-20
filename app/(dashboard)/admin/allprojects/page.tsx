'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <h2 className="text-xl mb-2">Existing Projects</h2>
      <ul className="space-y-2">
        {projects.map((project) => (
          <div key={project.id} className="p-4 border-b">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <p className="mb-2 text-gray-500">{project.description}</p>

            <Link
              href={`/admin/allprojects/${project.id}`}
              className="bg-green-500 text-white py-1 px-3 my-4 rounded-full"
            >
              Manage
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
}
