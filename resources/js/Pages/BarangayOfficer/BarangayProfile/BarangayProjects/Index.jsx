import React from 'react'

const Index = ({ projects }) => {
    if (!projects || !projects.data) {
        return <p>No projects found.</p>; // or loading spinner
    }

    return (
        <div>
            <h1 className="text-xl font-bold">Barangay Projects</h1>
            <ul>
                {projects.data.map(project => (
                    <li key={project.id}>
                        <strong>{project.title}</strong>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Index
