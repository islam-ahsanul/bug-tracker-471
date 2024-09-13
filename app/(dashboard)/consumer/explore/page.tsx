'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types for Project
interface Project {
  id: string;
  name: string;
  description: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]); // List of projects
  const router = useRouter();

  // Fetch all projects created by the admin
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/consumer/projects'); // Fetch projects from API
        const data = await res.json();
        setProjects(data.projects);
      } catch (err) {
        console.error('Error fetching projects', err);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: string) => {
    // Navigate to the project detail page
    router.push(`/consumer/explore/${projectId}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Projects</h1>

      {projects.length > 0 ? (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li
              key={project.id}
              className="border p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => handleProjectClick(project.id)} // Click to go to the project detail page
            >
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className="text-gray-700">{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
}
