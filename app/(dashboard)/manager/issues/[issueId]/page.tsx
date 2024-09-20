'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Define types for Issue and Developer
interface Developer {
  id: string;
  name: string;
  email: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function IssueDetail() {
  const [issue, setIssue] = useState<Issue | null>(null); // The current issue
  const [developers, setDevelopers] = useState<Developer[]>([]); // List of developers to assign tasks to
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>(''); // Selected developer
  const [loading, setLoading] = useState(true); // Loading state
  const [assigning, setAssigning] = useState(false); // Task assignment loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const { issueId } = useParams();
  const router = useRouter();

  // Fetch issue details and available developers
  useEffect(() => {
    if (!issueId) return;

    const fetchIssueAndDevelopers = async () => {
      setLoading(true);
      setError(null); // Clear any previous error
      try {
        const issueRes = await fetch(`/api/manager/issues/${issueId}`);
        if (!issueRes.ok) throw new Error('Failed to fetch issue details');
        const { issue } = await issueRes.json();
        setIssue(issue);

        const developersRes = await fetch(`/api/manager/developers`);
        if (!developersRes.ok) throw new Error('Failed to fetch developers');
        const { developers } = await developersRes.json();
        setDevelopers(developers);
      } catch (err) {
        console.error('Error fetching issue or developers', err);
        setError('Failed to load issue or developer data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssueAndDevelopers();
  }, [issueId]);

  // Handle assigning a task to a developer
  const handleAssignTask = async () => {
    if (!selectedDeveloper) return;
    setAssigning(true);
    setError(null); // Clear any previous error
    try {
      const res = await fetch(`/api/manager/issues/${issueId}/assign-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerId: selectedDeveloper }),
      });
      if (!res.ok) throw new Error('Failed to assign task');
      // Show success message, then redirect
      setTimeout(() => router.push('/manager/dashboard'), 1000); // Optional delay for better UX
    } catch (err) {
      console.error('Error assigning task', err);
      setError('Failed to assign task. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error}</span>
    </div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {issue ? (
        <div>
          <h1 className="text-4xl font-bold mb-4 text-blue-600 border-b-2 border-blue-200 pb-2">
            {issue.title}
          </h1>
          <p className="mb-6 text-gray-700 text-lg leading-relaxed bg-gray-100 p-4 rounded-lg font-bold">
            {issue.description}
          </p>
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-4 text-gray-700">
              Assign Developer to Resolve This Issue
            </h2>
            <select
              value={selectedDeveloper}
              onChange={(e) => setSelectedDeveloper(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none"
              disabled={assigning}
            >
              <option value="">Select Developer</option>
              {developers.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name} ({dev.email})
                </option>
              ))}
            </select>
            <button
              onClick={handleAssignTask}
              className={`w-full py-2 px-4 rounded-md text-white font-semibold transition duration-300 ${
                !selectedDeveloper || assigning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={!selectedDeveloper || assigning}
            >
              {assigning ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-700">Issue not found</p>
      )}
    </div>
  );
}
