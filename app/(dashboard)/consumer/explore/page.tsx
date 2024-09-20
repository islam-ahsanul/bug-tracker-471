'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Import new components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  id: string;
  name: string;
  description: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const res = await fetch('/api/consumer/projects');
        const data = await res.json();
        setProjects(data.projects);
      } catch (err) {
        console.error('Error fetching projects', err);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: string) => {
    router.push(`/consumer/explore/${projectId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Projects</h1>

      {loading ? (
        // Show skeleton loader while fetching data
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <Button onClick={() => handleProjectClick(project.id)}>
                  View Project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No projects available at the moment.</p>
      )}
    </div>
  );
}
