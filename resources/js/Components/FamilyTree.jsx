import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import FamilyCard from "./FamilyCard";
import { transformToTreeFormat } from "@/utils/transformtoTreeFormat";

const CARD_WIDTH = 240;
const CARD_HEIGHT = 90;

const FamilyTree = ({ familyData }) => {
    const svgRef = useRef();
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);

    useEffect(() => {
        const treeData = transformToTreeFormat(familyData);
        const root = d3.hierarchy(treeData);

        const treeLayout = d3.tree().nodeSize([350, 180]);
        treeLayout(root);

        const nodesRaw = root.descendants();
        const minY = Math.min(...nodesRaw.map((d) => d.y));
        const maxY = Math.max(...nodesRaw.map((d) => d.y));
        const totalHeight = maxY - minY;
        const svgHeight = 500;

        const verticalOffset = 1200;
        const horizontalCenterOffset = (svgHeight - totalHeight) / 2;

        const positioned = [];
        const lines = [];

        root.descendants().forEach((d) => {
            if (d.data.isCouple && d.data.members?.length >= 2) {
                const members = d.data.members;
                const self = members.find((m) => m.relation === "Self");
                const spouses = members.filter((m) => m.relation === "Spouse");

                const baseX = d.x + verticalOffset;
                const baseY = d.y + horizontalCenterOffset;
                const spacing = CARD_WIDTH + 130;

                // Place Self at the center
                self._x = baseX;
                positioned.push({
                    ...self,
                    x: baseX,
                    y: baseY,
                    relation: "Self",
                    id: self.id,
                });

                // Distribute spouses left and right of Self
                spouses.forEach((spouse, idx) => {
                    const direction = idx % 2 === 0 ? -1 : 1;
                    const multiplier = Math.ceil((idx + 1) / 2);
                    const spouseX = baseX + direction * spacing * multiplier;

                    positioned.push({
                        ...spouse,
                        x: spouseX,
                        y: baseY,
                        relation: "Spouse",
                        id: spouse.id,
                    });

                    // Add connection line
                    lines.push({
                        from: { x: baseX + CARD_WIDTH / 2, y: baseY + CARD_HEIGHT / 2 },
                        to: { x: spouseX + CARD_WIDTH / 2, y: baseY + CARD_HEIGHT / 2 },
                    });
                });

            } else if (d.data.id !== "virtual-root") {
                let extraGap = 80;

                if (d.parent && d.parent.children) {
                    const hasSelfWithSpouse = d.parent.children.some(
                        (child) => child.data.relation === "Self" && child.data._x
                    );

                    if (hasSelfWithSpouse) {
                        const selfNode = d.parent.children.find(
                            (child) => child.data.relation === "Self"
                        );

                        if (selfNode && selfNode.data._x) {
                            const selfX = selfNode.data._x;
                            if (d.x + verticalOffset < selfX + 120) {
                                extraGap = 120;
                            }
                        }
                    }
                }

                positioned.push({
                    ...d.data,
                    x: d.x + verticalOffset + extraGap - 250,
                    y: d.y + horizontalCenterOffset,
                    relation: d.data.relation || "Relative",
                    id: d.data.id,
                });
            }
        });

        setNodes(positioned);
        setConnections(lines);

        const svg = d3.select(svgRef.current);
        const g = svg.select("g");

        svg.call(
            d3.zoom()
                .scaleExtent([0.3, 2])
                .on("zoom", (event) => {
                    g.attr("transform", event.transform);
                })
        );
    }, [familyData]);

    return (
        <div className="w-full border rounded-lg bg-dot-grid">
            <div className="overflow-auto max-h-[600px] max-w-full rounded-lg">
                <svg
                    ref={svgRef}
                    width={1100}
                    height={1000}
                    viewBox="0 0 2000 2000"
                    className="block"
                >
                    <g>
                        {/* Draw lines between self and each spouse */}
                        {connections.map((line, idx) => (
                            <line
                                key={`line-${idx}`}
                                x1={line.from.x}
                                y1={line.from.y}
                                x2={line.to.x}
                                y2={line.to.y}
                                stroke="#1E40AF"
                                strokeWidth={2}
                            />
                        ))}

                        {/* Draw each person’s card */}
                        {nodes.map((node, idx) => (
                            <FamilyCard
                                key={idx}
                                x={node.x}
                                y={node.y}
                                person={node}
                                relation={node.relation}
                            />
                        ))}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default FamilyTree;
