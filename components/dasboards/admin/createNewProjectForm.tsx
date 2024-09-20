'use client';
import React, {useState} from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface CreateNewProjectFormProps {
  onProjectCreated: (newProject: Project) => void;
  setChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateNewProjectForm = ({ onProjectCreated, setChanged }: CreateNewProjectFormProps) => {
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const router = useRouter();

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (res.ok) {
        const createdProject = await res.json();
        onProjectCreated(createdProject); 
        setNewProject({ name: '', description: '' }); 
        setChanged(prevState => !prevState);
      }
    } catch (err) {
      console.error('Error creating project', err);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl mb-2">Create New Project</h2>
      <form onSubmit={handleCreateProject}>
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
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          className="border p-2 mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateNewProjectForm;
