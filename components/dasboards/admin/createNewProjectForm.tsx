'use client';
import React, {useState} from 'react';
import { useRouter } from 'next/navigation';

const CreateNewProjectForm = () => {
    const [newProject, setNewProject] = useState({ name: '', description: '' });
  const router = useRouter();
  const handleCreateProject = async () => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error('Error creating project', err);
    }
  };
  return (
    <div className="mb-6">
      <h2 className="text-xl mb-2">Create New Project</h2>
      <input
        type="text"
        placeholder="Project Name"
        value={newProject.name}
        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
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
  );
};

export default CreateNewProjectForm;
