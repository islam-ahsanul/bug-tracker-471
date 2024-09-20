<<<<<<< HEAD
=======

>>>>>>> 77c2dbf2a98380968d1b5a79ee00c0538555536b
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CreateNewProjectForm from '@/components/dasboards/admin/createNewProjectForm';
import { FiEdit } from "react-icons/fi";

<<<<<<< HEAD
=======

>>>>>>> 77c2dbf2a98380968d1b5a79ee00c0538555536b
interface Project {
  id: string;
  name: string;
  description: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [changed, setChanged] = useState<boolean>(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(data.projects);
    } catch (err) {
      console.error('Error fetching projects', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [changed]);

  const handleNewProject = (newProject: Project) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <CreateNewProjectForm onProjectCreated={handleNewProject} setChanged={setChanged} />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">Existing Projects</h2>
        <ul className="divide-y divide-gray-200">
          {projects.map((project) => (
            <li key={project.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{project.name || 'Unnamed Project'}</h3>
                  <p className="text-gray-500">{project.description || 'No description'}</p>
                </div>
                <Link
                  href={`/admin/allprojects/${project.id}`}
                  className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FiEdit className="mr-1 text-lg" />
                  Manage
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}