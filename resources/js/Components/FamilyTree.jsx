import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card"; // Assuming you have this import path

const FamilyTree = ({ familyData }) => {
    if (!familyData) {
        return <div>Loading...</div>;
    }

    const {
        self,
        parents,
        grandparents,
        uncles_aunts,
        siblings,
        children,
        spouse,
    } = familyData;

    const renderPersonCard = (person, relation) => (
        <Card key={person.id || relation} className="space-y-2">
            <CardHeader>
                <h2 className="text-xl font-medium">{relation}</h2>
            </CardHeader>
            <CardContent>
                <p>
                    <strong>First Name:</strong> {person?.firstname || "N/A"}
                </p>
                <p>
                    <strong>Gender:</strong> {person?.gender || "N/A"}
                </p>
                <p>
                    <strong>Birthdate:</strong> {person?.birthdate || "N/A"}
                </p>
                <p>
                    <strong>Nationality:</strong> {person?.nationality || "N/A"}
                </p>
                <p>
                    <strong>Status:</strong> {person?.status || "N/A"}
                </p>
            </CardContent>
        </Card>
    );

    return (
        <div className="family-tree space-y-6">
            <h1 className="text-3xl font-semibold mb-4">Family Tree</h1>

            {/* Self Section */}
            {self && renderPersonCard(self.data, "Self")}

            {/* Parents Section */}
            {parents?.data?.map((parent) => renderPersonCard(parent, "Parent"))}

            {/* Grandparents Section */}
            {grandparents?.data?.map((grandparent) =>
                renderPersonCard(grandparent, "Grandparent")
            )}

            {/* Uncles and Aunts Section */}
            {uncles_aunts?.data?.map((uncle_aunt) =>
                renderPersonCard(uncle_aunt, "Uncle/Aunt")
            )}

            {/* Siblings Section */}
            {siblings?.data?.map((sibling) =>
                renderPersonCard(sibling, "Sibling")
            )}

            {/* Children Section */}
            {children?.data?.map((child) => renderPersonCard(child, "Child"))}

            {/* Spouse Section */}
            {spouse?.data?.map((spouseMember) =>
                renderPersonCard(spouseMember, "Spouse")
            )}
        </div>
    );
};

export default FamilyTree;
