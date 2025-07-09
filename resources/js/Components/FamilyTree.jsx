import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import FamilyCard from "./FamilyCard";
import { transformToTreeFormat } from "@/utils/transformtoTreeFormat";

const CARD_WIDTH = 240;
const CARD_HEIGHT = 160;

const FamilyTree = ({ familyData }) => {
    const svgRef = useRef();
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        const treeData = transformToTreeFormat(familyData);
        const root = d3.hierarchy(treeData);

        // Change orientation: left to right
        const treeLayout = d3.tree().nodeSize([300, 200]); // [x, y]
        treeLayout(root);

        // Centering offset
        const nodesRaw = root.descendants();
        const minY = Math.min(...nodesRaw.map((d) => d.y));
        const maxY = Math.max(...nodesRaw.map((d) => d.y));
        const totalHeight = maxY - minY;
        const svgHeight = 500;

        const verticalOffset = 700;
        const horizontalCenterOffset = (svgHeight - totalHeight) / 2;

        const positioned = [];

        root.descendants().forEach((d) => {
            if (d.data.isCouple && d.data.members?.length === 2) {
                const [self, spouse] = d.data.members;

                const baseX = d.x + verticalOffset;
                const baseY = d.y + horizontalCenterOffset;
                const gap = 140;

                positioned.push({
                    ...spouse,
                    x: baseX - gap,
                    y: baseY,
                    relation: "Spouse",
                    id: spouse.id,
                });

                positioned.push({
                    ...self,
                    x: baseX + gap,
                    y: baseY,
                    relation: "Self",
                    id: self.id,
                    spouseX: baseX + gap,
                    spouseY: baseY,
                });

            } else if (d.data.id !== "virtual-root") {
                positioned.push({
                    ...d.data,
                    x: d.x + verticalOffset,
                    y: d.y + horizontalCenterOffset,
                    relation: d.data.relation || "Relative",
                    id: d.data.id,
                });
            }
        });

        setNodes(positioned);
    }, [familyData]);



    return (
        <svg
            ref={svgRef}
            width="100%"
            height="1200"
            viewBox="0 0 1600 1200"
            className="bg-gray-50"
        >

            {nodes.map((node, idx) => (
                <FamilyCard
                    key={idx}
                    x={node.x}
                    y={node.y}
                    person={node}
                    relation={node.relation}
                />
            ))}
        </svg>
    );
};

export default FamilyTree;
