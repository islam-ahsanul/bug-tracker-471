'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types for Project and Task
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  issue: {
    title: string;
  };
  project: {
    name: string;
  };
}

interface Project {
  id: string;
  name: string;
}

export default function DeveloperDashboard() {
  const [projects, setProjects] = useState<Project[]>([]); // List of all projects assigned to the developer
  const [tasks, setTasks] = useState<Task[]>([]); // List of all tasks assigned to the developer
  const [loading, setLoading] = useState(true); // Loading state to handle data fetching
  const router = useRouter();

  // Fetch developer's projects and tasks
  useEffect(() => {
    const fetchDeveloperData = async () => {
      setLoading(true);
      try {
        // Fetch projects assigned to the developer
        const projectsRes = await fetch('/api/developer/projects');
        const { projects } = await projectsRes.json();
        setProjects(projects);

        // Fetch tasks/issues assigned to the developer
        const tasksRes = await fetch('/api/developer/issues');
        const { tasks } = await tasksRes.json();
        setTasks(tasks);
      } catch (err) {
        console.error('Error fetching developer data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperData();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Developer Dashboard</h1>

      <h2 className="text-xl mt-4 mb-2">Projects</h2>
      {projects.length > 0 ? (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="border p-4">
              <h3 className="text-lg font-semibold">{project.name}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects assigned yet.</p>
      )}

      <h2 className="text-xl mt-8 mb-4">Assigned Tasks</h2>
      {tasks.length > 0 ? (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="border p-4">
              <h3 className="text-lg font-semibold">{task.issue.title}</h3>
              <p className="text-sm">Project: {task.project.name}</p>
              <p className="text-sm">Status: {task.status}</p>

              {/* Button to view and update the task */}
              <button
                className="bg-blue-500 text-white py-2 px-4 mt-2"
                onClick={() => router.push(`/developer/tasks/${task.id}`)}
              >
                View and Update Task
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks assigned yet.</p>
      )}
    </div>
  );
}
