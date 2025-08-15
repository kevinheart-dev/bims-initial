import React, { useEffect, useState } from "react";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { Skeleton } from "@/Components/ui/skeleton";

const Index = ({}) => {
    const APP_URL = useAppUrl();
    const [projects, setProjects] = useState(null);
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(
                    `${APP_URL}/barangay_officer/barangay_project`
                );
                const projects = response.data.projects;
                setProjects(projects);
            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        };
        fetchProjects();
    }, []);

    if (!projects || !projects.data) {
        return (
            <div className="gap-2 space-y-4">
                <Skeleton className="h-[20px] w-[100px] rounded-full" />
                <Skeleton className="h-[10px] w-[100px] rounded-full" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-xl font-bold">Barangay Projects</h1>
            <ul>
                {projects.data.map((project) => (
                    <li key={project.id}>
                        <strong>{project.title}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Index;
