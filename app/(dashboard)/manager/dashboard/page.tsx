'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types for Project and Issue
interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  postedBy: {
    name: string;
    email: string;
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
}

export default function ManagerDashboard() {
  const [project, setProject] = useState<Project | null>(null); // The current project assigned to the manager
  const [issues, setIssues] = useState<Issue[]>([]); // List of all issues for the manager's project
  const [loading, setLoading] = useState(true); // Loading state to handle data fetching
  const router = useRouter();

  // Fetch project and issues for the manager
  useEffect(() => {
    const fetchManagerProject = async () => {
      setLoading(true);
      try {
        // Fetch the manager's assigned project
        const projectRes = await fetch('/api/manager/project');
        const { project } = await projectRes.json();
        setProject(project);

        // Fetch all issues for the manager's project
        const issuesRes = await fetch(`/api/manager/issues`);
        const { issues } = await issuesRes.json();
        setIssues(issues);
      } catch (err) {
        console.error('Error fetching manager project or issues', err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerProject();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      {project ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Project: {project.name}</h1>
          <p>{project.description}</p>

          <h2 className="text-2xl mt-8 mb-4">All Issues for This Project</h2>
          {issues.length > 0 ? (
            <ul className="space-y-4">
              {issues.map((issue) => (
                <li key={issue.id} className="border p-4">
                  <h3 className="text-xl font-semibold">{issue.title}</h3>
                  <p>{issue.description}</p>
                  <p className="text-sm text-gray-500">
                    Posted by: {issue.postedBy.name} ({issue.postedBy.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {issue.status}
                  </p>

                  {/* Button to view and assign task for this issue */}
                  <button
                    className="bg-blue-500 text-white py-2 px-4 mt-2"
                    onClick={() => router.push(`/manager/issues/${issue.id}`)}
                  >
                    View and Assign Task
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No issues posted yet.</p>
          )}
        </div>
      ) : (
        <p>No project assigned to you yet.</p>
      )}
    </div>
  );
}
