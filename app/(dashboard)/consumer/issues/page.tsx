'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    return <p className="text-center py-4">Loading your issues...</p>;
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Posted Issues</h1>

      {issues && issues.length > 0 ? (
        <div className="space-y-4">
          {issues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{issue.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{issue.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-600 font-medium">Project: {issue.projectName}</span>
                  <span className={`px-2 py-1 rounded-full ${
                    issue.status === 'SOLVED' ? 'bg-green-100 text-green-800' :
                    issue.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {issue.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No issues posted yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
