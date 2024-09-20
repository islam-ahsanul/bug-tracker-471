'use client';

import { useState, useEffect } from 'react';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  projectName: string;
}

export default function ConsumerIssues() {
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/consumer/get-issues');
        if (!res.ok) throw new Error('Failed to fetch issues');
        const data = await res.json();
        setIssues(data.issues);
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Error fetching your issues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return <p>Loading your posted issues...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Posted Issues</h1>

      {issues && issues.length > 0 ? (
        <ul className="space-y-4">
          {issues.map((issue) => (
            <li key={issue.id} className="border p-4">
              <h2 className="text-xl font-semibold mb-2">{issue.title}</h2>
              <p className="mb-2">{issue.description}</p>
              <p className="text-sm text-gray-500">
                Project: {issue.projectName}
              </p>
              <p className="text-sm text-gray-500">Status: {issue.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No issues posted yet.</p>
      )}
    </div>
  );
}
