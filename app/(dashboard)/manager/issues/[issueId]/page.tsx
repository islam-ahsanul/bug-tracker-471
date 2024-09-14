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
    return <p>Loading issue details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Display error message if there was an issue
  }

  return (
    <div>
      {issue ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">{issue.title}</h1>
          <p className="mb-4">{issue.description}</p>

          <h2 className="text-xl mb-2">
            Assign Developer to Resolve This Issue
          </h2>

          <select
            value={selectedDeveloper}
            onChange={(e) => setSelectedDeveloper(e.target.value)}
            className="border p-2 mb-4 w-full"
            disabled={assigning} // Disable during assignment
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
            className="bg-blue-500 text-white py-2 px-4"
            disabled={!selectedDeveloper || assigning} // Disable if no developer is selected or while assigning
          >
            {assigning ? 'Assigning...' : 'Assign Task'}
          </button>
        </div>
      ) : (
        <p>Issue not found</p>
      )}
    </div>
  );
}
