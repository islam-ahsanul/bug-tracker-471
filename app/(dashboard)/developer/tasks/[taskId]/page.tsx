'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Define types for Task
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function TaskDetail() {
  const [task, setTask] = useState<Task | null>(null); // The current task
  const [newStatus, setNewStatus] = useState<string>(''); // New status for the task
  const [loading, setLoading] = useState(true); // Loading state
  const { taskId } = useParams();
  const router = useRouter();

  // Fetch task details
  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      setLoading(true);
      try {
        const taskRes = await fetch(`/api/developer/tasks/${taskId}`);
        const { task } = await taskRes.json();
        setTask(task);
        setNewStatus(task.status);
      } catch (err) {
        console.error('Error fetching task', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // Handle updating the task status
  const handleUpdateStatus = async () => {
    try {
      const res = await fetch(`/api/developer/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.push('/developer/dashboard'); // Redirect back to dashboard after updating the status
      }
    } catch (err) {
      console.error('Error updating task status', err);
    }
  };

  if (loading) {
    return <p>Loading task details...</p>;
  }

  return (
    <div>
      {task ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
          <p className="mb-4">{task.description}</p>

          <h2 className="text-xl mb-2">Update Task Status</h2>

          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border p-2 mb-4 w-full"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SOLVED">Solved</option>
          </select>

          <button
            onClick={handleUpdateStatus}
            className="bg-blue-500 text-white py-2 px-4"
            disabled={task.status === newStatus} // Disable if the status hasn't changed
          >
            Update Status
          </button>
        </div>
      ) : (
        <p>Task not found</p>
      )}
    </div>
  );
}
