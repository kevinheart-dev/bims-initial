import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import FamilyCard from "./FamilyCard";
import { transformToTreeFormat } from "@/utils/transformtoTreeFormat";
import SidebarModal from "./SidebarModal";
import PersonDetailContent, {
    personDetailTitle,
} from "./SidebarModalContents/PersonDetailContent";

const CARD_WIDTH = 240;
const CARD_HEIGHT = 90;

const FamilyTree = ({ familyData }) => {
    const svgRef = useRef();
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const openSidebar = (person) => {
        setSelectedPerson(person);
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedPerson(null);
    };

    useEffect(() => {
        const treeData = transformToTreeFormat(familyData);
        const root = d3.hierarchy(treeData);
        const treeLayout = d3.tree().nodeSize([350, 180]);
        treeLayout(root);

        const nodesRaw = root.descendants();
        const minY = Math.min(...nodesRaw.map((d) => d.y));
        const maxY = Math.max(...nodesRaw.map((d) => d.y));
        const svgHeight = 600;

        const verticalOffset = 1200;
        const horizontalCenterOffset = (svgHeight - (maxY - minY)) / 2;

        const positioned = [];

        // === 1. Position All Nodes ===
        root.descendants().forEach((d) => {
            const baseX = d.x + verticalOffset;
            const baseY = d.y + horizontalCenterOffset;

            if (d.data.isCouple && d.data.members?.length >= 1) {
                const members = d.data.members;
                const spacing = CARD_WIDTH + 130;

                if (members.length === 1) {
                    // ✅ Single parent or self
                    positioned.push({
                        ...members[0],
                        x: baseX,
                        y: baseY,
                        relation: members[0].relation || "Relative",
                        id: members[0].id,
                    });
                } else {
                    // ✅ Couple or self + spouse
                    const self = members.find((m) => m.relation === "Self");
                    const spouses = members.filter(
                        (m) => m.relation === "Spouse"
                    );

                    if (self) {
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
                            const spouseX =
                                baseX + direction * spacing * multiplier;

                            positioned.push({
                                ...spouse,
                                x: spouseX,
                                y: baseY,
                                relation: "Spouse",
                                id: spouse.id,
                            });
                        });
                    } else {
                        const midIndex = Math.floor(members.length / 2);
                        members.forEach((member, idx) => {
                            const offset = (idx - midIndex) * spacing;
                            positioned.push({
                                ...member,
                                x: baseX + offset,
                                y: baseY,
                                relation: member.relation || "Relative",
                                id: member.id,
                            });
                        });
                    }
                }
            } else if (d.data.id !== "virtual-root") {
                // ✅ Children or other individuals
                positioned.push({
                    ...d.data,
                    x: baseX - CARD_WIDTH / 2 - 65,
                    y: baseY,
                    relation: d.data.relation || "Relative",
                    id: d.data.id,
                });
            }
        });

        setNodes(positioned);

        // === 2. Draw Lines ===
        const lines = [];
        // this handle couples
        root.descendants().forEach((d) => {
            if (d.data.isCouple && d.data.members?.length >= 1) {
                const baseY = d.y + horizontalCenterOffset;
                const members = d.data.members;

                const memberNodes = members
                    .map((m) => positioned.find((p) => p.id === m.id))
                    .filter(Boolean);

                // Horizontal lines between couple members
                for (let i = 0; i < memberNodes.length - 1; i++) {
                    lines.push({
                        from: {
                            x: memberNodes[i].x + CARD_WIDTH / 2,
                            y: memberNodes[i].y + CARD_HEIGHT / 2,
                        },
                        to: {
                            x: memberNodes[i + 1].x + CARD_WIDTH / 2,
                            y: memberNodes[i + 1].y + CARD_HEIGHT / 2,
                        },
                    });
                }

                // === ✅ CHILDREN CONNECTION ===
                if (d.children?.length > 0) {
                    const children = d.children
                        .map((child) =>
                            positioned.find((p) => p.id === child.data.id)
                        )
                        .filter(Boolean);

                    if (children.length === 0) return;

                    const parentXs = memberNodes.map(
                        (m) => m.x + CARD_WIDTH / 2
                    );
                    const parentCenterX =
                        (Math.min(...parentXs) + Math.max(...parentXs)) / 2;
                    const parentBottomY = baseY + CARD_HEIGHT / 2;
                    const junctionY = parentBottomY + 90;

                    // Vertical line from parent(s) to junction point
                    lines.push({
                        from: { x: parentCenterX, y: parentBottomY },
                        to: { x: parentCenterX, y: junctionY },
                    });

                    if (children.length === 1) {
                        // One child → single vertical line
                        const child = children[0];
                        const childX = child.x + CARD_WIDTH / 2;
                        lines.push({
                            from: { x: parentCenterX, y: junctionY },
                            to: { x: childX, y: child.y },
                        });
                    } else {
                        // Multiple children
                        const childXs = children.map(
                            (child) => child.x + CARD_WIDTH / 2
                        );
                        const minX = Math.min(...childXs);
                        const maxX = Math.max(...childXs);

                        // Horizontal line connecting children
                        lines.push({
                            from: { x: minX, y: junctionY },
                            to: { x: maxX, y: junctionY },
                        });

                        // Vertical line from junction to each child
                        children.forEach((child) => {
                            const childX = child.x + CARD_WIDTH / 2;
                            lines.push({
                                from: { x: childX, y: junctionY },
                                to: { x: childX, y: child.y },
                            });
                        });
                    }
                }
            }
        });

        // this handle single parent
        root.descendants().forEach((d) => {
            if (!d.data.isCouple && d.children?.length > 0) {
                const parent = positioned.find((p) => p.id === d.data.id);
                if (!parent) return;

                const parentX = parent.x + CARD_WIDTH / 2;
                const parentY = parent.y + CARD_HEIGHT / 2;
                const junctionY = parentY + 90;

                const children = d.children
                    .map((child) =>
                        positioned.find((p) => p.id === child.data.id)
                    )
                    .filter(Boolean);

                if (children.length === 1) {
                    const child = children[0];
                    const childX = child.x + CARD_WIDTH / 2;
                    lines.push({
                        from: { x: parentX, y: parentY },
                        to: { x: childX, y: child.y },
                    });
                } else if (children.length > 1) {
                    // Line from parent to junction
                    lines.push({
                        from: { x: parentX, y: parentY },
                        to: { x: parentX, y: junctionY },
                    });

                    // Horizontal line through all children
                    const childXs = children.map(
                        (child) => child.x + CARD_WIDTH / 2
                    );
                    const minX = Math.min(...childXs);
                    const maxX = Math.max(...childXs);

                    lines.push({
                        from: { x: minX, y: junctionY },
                        to: { x: maxX, y: junctionY },
                    });

                    // Lines down to each child
                    children.forEach((child) => {
                        const childX = child.x + CARD_WIDTH / 2;
                        lines.push({
                            from: { x: childX, y: junctionY },
                            to: { x: childX, y: child.y },
                        });
                    });
                }
            }
        });

        setConnections(lines);

        const svg = d3.select(svgRef.current);
        const g = svg.select("g");

        svg.call(
            d3
                .zoom()
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

                        {nodes.map((node, idx) => (
                            <FamilyCard
                                key={idx}
                                x={node.x}
                                y={node.y}
                                person={node}
                                relation={node.relation}
                                onViewDetail={openSidebar} // ✅ pass openSidebar
                            />
                        ))}
                    </g>
                </svg>
            </div>
            <SidebarModal
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title={personDetailTitle}
            >
                <PersonDetailContent person={selectedPerson} />
            </SidebarModal>
        </div>
    );
};

export default FamilyTree;
