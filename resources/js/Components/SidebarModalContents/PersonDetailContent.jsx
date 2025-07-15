export default function PersonDetailContent({ person }) {
    if (!person) return <p className="text-red-500">No person data provided.</p>;

    return (
        <div className="space-y-2 text-black">
            <p><strong>Full Name:</strong> {person.lastname}, {person.firstname} {person.middlename}</p>
            <p><strong>Gender:</strong> {person.gender}</p>
            <p><strong>Birthdate:</strong> {person.birthdate}</p>
            <p><strong>Contact Number:</strong> {person.contact_number}</p>
            <p><strong>Email:</strong> {person.email}</p>
            <p><strong>Religion:</strong> {person.religion}</p>
            <p><strong>Residency Date:</strong> {person.residency_date}</p>
            <p><strong>Nationality:</strong> {person.nationality || "N/A"}</p>
            <p><strong>Educational Attainment:</strong> {person.educational_attainment || "N/A"}</p>
            <p><strong>Solo Parent:</strong> {person.is_solo_parent ? "Yes" : "No"}</p>
            <p><strong>Purok:</strong> {person.purok || "N/A"}</p>
        </div>
    );
}

export const personDetailTitle = "Resident Details";
