'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';


interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  postedBy: {
    name: string;
    email: string;
  } | null; 
}

interface Project {
  id: string;
  name: string;
  description: string;
}

export default function ProjectDetail() {
  const [project, setProject] = useState<Project | null>(null); 
  const [issues, setIssues] = useState<Issue[]>([]); 
  const [title, setTitle] = useState(''); 
  const [description, setDescription] = useState(''); 
  const [loading, setLoading] = useState(true); 
  const router = useRouter();
  const params = useParams();
  const { projectId } = params;


  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      setLoading(true); 
      try {
        const projectRes = await fetch(`/api/consumer/projects/${projectId}`);
        const { project } = await projectRes.json();
        setProject(project);

        const issuesRes = await fetch(
          `/api/consumer/projects/${projectId}/issues`
        );
        const { issues } = await issuesRes.json();
        setIssues(issues);
      } catch (err) {
        console.error('Error fetching project or issues', err);
      } finally {
        setLoading(false); 
      }
    };

    fetchProject();
  }, [projectId]);


  const handlePostIssue = async () => {
    try {
      const res = await fetch(`/api/consumer/projects/${projectId}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
        }),
      });
      if (res.ok) {
        const { issue } = await res.json();
        setIssues((prevIssues) => [issue, ...prevIssues]);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error('Error posting issue', err);
    }
  };

 
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {project ? (
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-gray-600 mb-8">{project.description}</p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Post an Issue</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded-md p-2 w-full"
                placeholder="Enter issue title"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded-md p-2 w-full"
                placeholder="Describe the issue"
              />
            </div>

            <button
              onClick={handlePostIssue}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title || !description}
            >
              Post Issue
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-4">All Issues for This Project</h2>
          {issues.length > 0 ? (
            <ul className="space-y-4">
              {issues.map((issue) => (
                <li key={issue?.id} className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {issue?.title || 'Untitled Issue'}
                  </h3>
                  <p className="text-gray-700 mb-4">{issue?.description || 'No description provided'}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <p>
                      Posted by: {issue?.postedBy ? `${issue.postedBy.name} (${issue.postedBy.email})` : 'Anonymous'}
                    </p>
                    <span className={`px-2 py-1 rounded-full ${
                    issue?.status === 'SOLVED' ? 'bg-green-100 text-green-800' :
                    issue?.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                      Status: {issue?.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No issues posted yet.</p>
          )}
        </div>
      ) : (
        <p className="text-xl text-center text-gray-600">Project not found</p>
      )}
    </div>
  );
}
