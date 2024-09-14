'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


interface Project {
  id: string;
  name: string;
  description: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]); 
  const router = useRouter();


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/consumer/projects');
        const data = await res.json();
        setProjects(data.projects);
      } catch (err) {
        console.error('Error fetching projects', err);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: string) => {
   
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
              onClick={() => handleProjectClick(project.id)}
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
