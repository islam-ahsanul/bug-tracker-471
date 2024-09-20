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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Developer Dashboard
      </h1>
      {issues.length > 0 ? (
        <div className="space-y-6">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {issue.title}
                </h2>
                <p className="text-gray-600 mb-4">{issue.description}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      issue.status === 'SOLVED'
                        ? 'bg-green-100 text-green-800'
                        : issue.status === 'IN_PROGRESS'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {issue.status.replace('_', ' ')}
                  </span>
                  <select
                    value={issue.status}
                    onChange={(e) =>
                      updateIssueStatus(issue.id, e.target.value)
                    }
                    className="border rounded-md p-2 text-sm"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="SOLVED">Solved</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">
          No issues assigned yet.
        </p>
      )}
    </div>
  );
}
