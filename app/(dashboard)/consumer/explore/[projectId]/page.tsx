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
    return <p>Loading project details...</p>;
  }

  return (
    <div>
      {project ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
          <p className="mb-4">{project.description}</p>

          <h2 className="text-xl mb-2">Post an Issue</h2>

          <div className="mb-4">
            <label className="block text-lg mb-2">Issue Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full"
              placeholder="Enter issue title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg mb-2">Issue Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
              placeholder="Describe the issue"
            />
          </div>

          <button
            onClick={handlePostIssue}
            className="bg-blue-500 text-white py-2 px-4"
            disabled={!title || !description}
          >
            Post Issue
          </button>

          <h2 className="text-2xl mt-8 mb-4">All Issues for This Project</h2>
          {issues.length > 0 ? (
            <ul className="space-y-4">
              {issues.map((issue) => (
                <li key={issue?.id} className="border p-4">
                  <h3 className="text-xl font-semibold">
                    {issue?.title || 'Untitled Issue'}
                  </h3>
                  <p>{issue?.description || 'No description provided'}</p>
                  {issue?.postedBy ? (
                    <p className="text-sm text-gray-500">
                      Posted by: {issue.postedBy.name} ({issue.postedBy.email})
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Posted by: Anonymous
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Status: {issue?.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No issues posted yet.</p>
          )}
        </div>
      ) : (
        <p>Project not found</p>
      )}
    </div>
  );
}
