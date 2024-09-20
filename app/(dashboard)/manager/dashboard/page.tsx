'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


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
  const [project, setProject] = useState<Project | null>(null); 
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  
  useEffect(() => {
    const fetchManagerProject = async () => {
      setLoading(true);
      try {
        
        const projectRes = await fetch('/api/manager/project');
        const { project } = await projectRes.json();
        setProject(project);

       
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
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {project ? (
        <div>
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h1 className="text-3xl font-bold mb-4 text-blue-600">Project: {project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Issues for This Project</h2>
          {issues.length > 0 ? (
            <div className="space-y-6">
              {issues.map((issue) => (
                <div key={issue.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-2 text-blue-600">{issue.title}</h3>
                  <p className="text-gray-600 mb-4">{issue.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Posted by: {issue.postedBy.name}</span>
                    <span className={`px-2 py-1 rounded ${issue.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {issue.status}
                    </span>
                  </div>
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                    onClick={() => router.push(`/manager/issues/${issue.id}`)}
                  >
                    View and Assign Task
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No issues posted yet.</p>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p className="text-xl">No project assigned to you yet.</p>
        </div>
      )}
    </div>
  );
}
