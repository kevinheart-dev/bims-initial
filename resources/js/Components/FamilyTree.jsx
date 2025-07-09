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

        // Orientation: left to right
        const treeLayout = d3.tree().nodeSize([350, 180]);
        treeLayout(root);

        // Centering
        const nodesRaw = root.descendants();
        const minY = Math.min(...nodesRaw.map((d) => d.y));
        const maxY = Math.max(...nodesRaw.map((d) => d.y));
        const totalHeight = maxY - minY;
        const svgHeight = 500;

        const verticalOffset = 1200;
        const horizontalCenterOffset = (svgHeight - totalHeight) / 2;

        const positioned = [];

        root.descendants().forEach((d) => {
            if (d.data.isCouple && d.data.members?.length === 2) {
                const [self, spouse] = d.data.members;

                const baseX = d.x + verticalOffset;
                const baseY = d.y + horizontalCenterOffset;
                const gap = 140;

                // Save selfX to adjust siblings later
                self._x = baseX + gap;

                positioned.push({
                    ...spouse,
                    x: baseX - gap,
                    y: baseY,
                    relation: "Spouse",
                    id: spouse.id,
                });

                positioned.push({
                    ...self,
                    x: self._x,
                    y: baseY,
                    relation: "Self",
                    id: self.id,
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
                                extraGap = 120; // Adjust this value to control spacing
                            }
                        }
                    }
                }

                positioned.push({
                    ...d.data,
                    x: d.x + verticalOffset + extraGap,
                    y: d.y + horizontalCenterOffset,
                    relation: d.data.relation || "Relative",
                    id: d.data.id,
                });
            }


        });

        setNodes(positioned);

        // Enable zoom + pan
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
                    {/* All zoomable content goes inside this group */}
                    <g>
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
