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
        const svgHeight = 600; // y poition for all cards


        const verticalOffset = 1200; // x poition for all cards
        const horizontalCenterOffset = (svgHeight - (maxY - minY)) / 2;

        const positioned = [];

        // === 1. Position All Nodes ===
        root.descendants().forEach((d) => {
            const baseX = d.x + verticalOffset;
            const baseY = d.y + horizontalCenterOffset;

            if (d.data.isCouple && d.data.members?.length >= 2) {
                const members = d.data.members;
                const self = members.find((m) => m.relation === "Self");
                const spouses = members.filter((m) => m.relation === "Spouse");
                const spacing = CARD_WIDTH + 130; // x or width for card between spouce and self

                self._x = baseX;
                positioned.push({
                    ...self,
                    x: baseX,
                    y: baseY,
                    relation: "Self",
                    id: self.id,
                });

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
                });
            } else if (d.data.id !== "virtual-root") {
                positioned.push({
                    ...d.data,
                    x: baseX - 185, // x position for all child card
                    y: baseY,
                    relation: d.data.relation || "Relative",
                    id: d.data.id,
                });
            }
        });

        setNodes(positioned);

        // === 2. After positioning, draw lines ===
        const lines = [];

        root.descendants().forEach((d) => {
            if (d.data.isCouple && d.data.members?.length >= 2) {
                const baseY = d.y + horizontalCenterOffset;
                const members = d.data.members;
                const self = members.find((m) => m.relation === "Self");
                const spouses = members.filter((m) => m.relation === "Spouse");

                const selfNode = positioned.find((p) => p.id === self.id);
                const spouseNodes = spouses.map((s) => positioned.find((p) => p.id === s.id)).filter(Boolean);

                spouseNodes.forEach((spouseNode) => {
                    lines.push({
                        from: {
                            x: selfNode.x + CARD_WIDTH / 2,
                            y: selfNode.y + CARD_HEIGHT / 2,
                        },
                        to: {
                            x: spouseNode.x + CARD_WIDTH / 2,
                            y: spouseNode.y + CARD_HEIGHT / 2,
                        },
                    });
                });

                // If couple has children, draw T-line connection
                if (d.children?.length > 0) {
                    const partnerXs = [selfNode.x, ...spouseNodes.map(s => s.x)];
                    const minX = Math.min(...partnerXs);
                    const maxX = Math.max(...partnerXs);
                    const coupleCenterX = (minX + maxX + CARD_WIDTH) / 2;
                    const coupleLineY = baseY + CARD_HEIGHT / 2;
                    const junctionY = coupleLineY + 90;

                    lines.push({
                        from: { x: coupleCenterX, y: coupleLineY },
                        to: { x: coupleCenterX, y: junctionY },
                    });

                    // Gather children
                    const children = d.children.map(child => positioned.find(p => p.id === child.data.id)).filter(Boolean);
                    const childXs = children.map(child => child.x + CARD_WIDTH / 2);

                    // Horizontal line connecting all children
                    lines.push({
                        from: { x: Math.min(...childXs), y: junctionY },
                        to: { x: Math.max(...childXs), y: junctionY },
                    });

                    // Vertical lines from junction to each child
                    children.forEach(child => {
                        lines.push({
                            from: { x: child.x + CARD_WIDTH / 2, y: junctionY },
                            to: { x: child.x + CARD_WIDTH / 2, y: child.y },
                        });
                    });
                }
            }
        });

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
