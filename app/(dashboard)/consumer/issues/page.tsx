'use client';

import { useState, useEffect } from 'react';

// Define types for Issue
interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  projectName: string; // Name of the project where the issue was posted
}

export default function ConsumerIssues() {
  const [issues, setIssues] = useState<Issue[]>([]); // List of issues

  // Fetch all posted issues by the consumer
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch('/api/consumer/get-issues'); // Fetch consumer's issues from the API
        const data = await res.json();
        setIssues(data.issues);
      } catch (err) {
        console.error('Error fetching issues', err);
      }
    };

    fetchIssues();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Posted Issues</h1>

      {issues.length > 0 ? (
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
