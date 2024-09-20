'use client';

import { useState, useEffect } from 'react';

// Define types for Issue
interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function DeveloperDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch('/api/developer/issues');
        const data = await res.json();
        setIssues(data.issues);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const updateIssueStatus = async (issueId: string, status: string) => {
    try {
      // Ensure correct issueId and API path
      const res = await fetch(`/api/developer/issues/${issueId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error('Failed to update issue status');
      }

      // Handle success
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === issueId ? { ...issue, status } : issue
        )
      );
    } catch (error) {
      console.error('Error updating issue status:', error);
    }
  };

  if (loading) {
    return <p>Loading issues...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Developer Dashboard</h1>
      {issues.length > 0 ? (
        <ul className="space-y-4">
          {issues.map((issue) => (
            <li key={issue.id} className="border p-4">
              <h2 className="text-xl font-semibold mb-2">{issue.title}</h2>
              <p className="mb-2">{issue.description}</p>
              <p className="text-sm text-gray-500">Status: {issue.status}</p>

              {/* Dropdown for issue status change */}
              <select
                value={issue.status}
                onChange={(e) => updateIssueStatus(issue.id, e.target.value)}
                className="border p-2 mt-2"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="SOLVED">Solved</option>
              </select>
            </li>
          ))}
        </ul>
      ) : (
        <p>No issues assigned yet.</p>
      )}
    </div>
  );
}
