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
    console.log(familyData);
    const svgRef = useRef();
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const openSidebar = (person) => {
        setSelectedPerson(person);
        setIsSidebarOpen(true);
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

        root.descendants().forEach((d) => {
            const baseX = d.x + verticalOffset;
            const baseY = d.y + horizontalCenterOffset;

            if (d.data.isCouple && d.data.members?.length >= 1) {
                const members = d.data.members;
                const spacing = CARD_WIDTH + 130;


                if (members.length === 1) {
                    positioned.push({
                        ...members[0],
                        x: baseX,
                        y: baseY,
                        relation: members[0].relation || "Relative",
                        id: members[0].id,
                    });
                } else {
                    const self = members.find((m) => m.relation === "Self");
                    const spouses = members.filter((m) => m.relation === "Spouse");

                    if (self) {
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
                positioned.push({
                    ...d.data,
                    x: baseX - CARD_WIDTH / 2 - 65,
                    y: baseY,
                    relation: d.data.relation || "Relative",
                    id: d.data.id,
                });
            }
        });

        // === 🧩 FIX OVERLAP ===
        const adjusted = [...positioned];

        const selfNode = adjusted.find((n) => n.relation === "Self"); // ✅ declare ONCE
        const spouseNode = adjusted.find((n) => n.relation === "Spouse");

        if (selfNode && spouseNode && familyData.siblings?.data?.length > 0) {
            const sameLevelNodes = adjusted.filter(
                (n) =>
                    n.y === selfNode.y &&
                    (n.relation === "Sibling" || n.relation === "Self")
            );

            sameLevelNodes.sort((a, b) => a.x - b.x);
            const selfIndex = sameLevelNodes.findIndex((n) => n.id === selfNode.id);

            if (selfIndex !== -1) {
                const gapSize = CARD_WIDTH * 0.8;
                for (let i = selfIndex + 1; i < sameLevelNodes.length; i++) {
                    const sib = sameLevelNodes[i];
                    const idx = adjusted.findIndex((n) => n.id === sib.id);
                    if (idx !== -1) adjusted[idx].x += gapSize;
                }
            }
        }

        setNodes(adjusted);

        // === 2. Draw Lines ===
        const lines = [];

        // --- Handle Couple Connections and their Children ---
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

                // === CHILDREN CONNECTION FOR COUPLES ===
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

                    if (children.length === 1 && memberNodes.length === 1) {
                        // Special case: Single parent in a 'couple' node with one child
                        const child = children[0];
                        const childX = child.x + CARD_WIDTH / 2;
                        lines.push({
                            from: { x: parentCenterX, y: parentBottomY },
                            to: { x: childX, y: child.y },
                        });
                    } else if (children.length === 1) {
                        // Couple with one child
                        const child = children[0];
                        const childX = child.x + CARD_WIDTH / 2;
                        // Vertical line from parent(s) to junction point
                        lines.push({
                            from: { x: parentCenterX, y: parentBottomY },
                            to: { x: parentCenterX, y: junctionY },
                        });
                        // Line from junction to child
                        lines.push({
                            from: { x: parentCenterX, y: junctionY },
                            to: { x: childX, y: child.y },
                        });
                    } else {
                        lines.push({
                            from: { x: parentCenterX, y: parentBottomY },
                            to: { x: parentCenterX, y: junctionY },
                        });

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

        // --- Handle Single Parent (non-couple) Connections and their Children ---
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
                    // ✅ Condition for one parent and one child: directly connect them
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

        // --- Handle Top-Level Siblings (including Self if siblings exist) ---
        const topLevelSiblingGroups = new Map();

        root.descendants().forEach((d) => {
            if (d.parent) {
                const parentId = d.parent.data.id;
                const parentInPositioned = positioned.some((p) => p.id === parentId);

                const isTopLevelSibling =
                    parentId === "virtual-root" ||
                    (!parentInPositioned && !d.parent.data.isCouple);

                if (isTopLevelSibling) {
                    if (!topLevelSiblingGroups.has(parentId)) {
                        topLevelSiblingGroups.set(parentId, []);
                    }

                    const positionedNode = positioned.find((p) => p.id === d.data.id);
                    if (positionedNode) {
                        topLevelSiblingGroups.get(parentId).push(positionedNode);
                    }
                }
            }
        });

        // const selfNode = positioned.find((p) => p.relation === "Self");
        if (selfNode && familyData.siblings?.data?.length > 0) {
            const parentId = "virtual-root-self";
            if (!topLevelSiblingGroups.has(parentId)) {
                topLevelSiblingGroups.set(parentId, []);
            }
            // Add self and siblings together
            const siblings = [selfNode, ...familyData.siblings.data
                .map((sib) => positioned.find((p) => p.id === sib.id))
                .filter(Boolean)];
            topLevelSiblingGroups.set(parentId, siblings);
        }


        // --- Draw sibling connection lines (supports couples) ---
        topLevelSiblingGroups.forEach((siblings) => {
            if (siblings.length > 1) {
                // Sort siblings (including couples) by x position
                siblings.sort((a, b) => a.x - b.x);

                const siblingCenters = siblings.map((sibling) => {
                    if (sibling.isCouple) {
                        // Get all member nodes (self + spouse)
                        const memberNodes = [];
                        sibling.members?.forEach((m) => {
                            const memberPos = positioned.find((p) => p.id === m.id);
                            if (memberPos) memberNodes.push(memberPos);
                        });

                        if (memberNodes.length > 0) {
                            const minX = Math.min(...memberNodes.map((n) => n.x));
                            const maxX = Math.max(...memberNodes.map((n) => n.x));
                            const centerX = (minX + maxX + CARD_WIDTH) / 2;
                            const centerY = memberNodes[0].y + CARD_HEIGHT / 2;
                            return { ...sibling, centerX, centerY };
                        }
                    }
                    return {
                        ...sibling,
                        centerX: sibling.x + CARD_WIDTH / 2,
                        centerY: sibling.y + CARD_HEIGHT / 2,
                    };
                });

                const first = siblingCenters[0];
                const last = siblingCenters[siblingCenters.length - 1];
                const siblingLineY = first.centerY + 5;

                // Horizontal line connecting all siblings (continuous)
                lines.push({
                    from: { x: first.centerX, y: siblingLineY },
                    to: { x: last.centerX, y: siblingLineY },
                });

                // Vertical connectors down to each sibling/couple
                siblingCenters.forEach((sib) => {
                    lines.push({
                        from: { x: sib.centerX, y: siblingLineY },
                        to: { x: sib.centerX, y: sib.centerY },
                    });
                });
            }
        });

        // --- Handle Parent → Child Connection (only when couple has exactly ONE child) ---
        // root.descendants().forEach((d) => {
        //     if (d.parent && d.parent.data.isCouple) {
        //         const parentCouple = d.parent;
        //         const parentMembers = parentCouple.data.members || [];

        //         const parentMemberNodes = parentMembers
        //             .map((m) => positioned.find((p) => p.id === m.id))
        //             .filter(Boolean);

        //         if (parentMemberNodes.length === 0) return;

        //         const children = d.parent.children || [];
        //         // ✅ Only proceed if the couple has exactly ONE child
        //         if (children.length !== 1) return;

        //         const parentXs = parentMemberNodes.map((m) => m.x + CARD_WIDTH / 2);
        //         const parentCenterX =
        //             (Math.min(...parentXs) + Math.max(...parentXs)) / 2;
        //         const parentBottomY = parentMemberNodes[0].y + CARD_HEIGHT / 2;

        //         if (d.data.isCouple && d.data.members?.length) {
        //             // Find only the 'self' inside members
        //             const selfMember = d.data.members.find(
        //                 (m) => m.relation === "Self" || m.id?.startsWith("self-")
        //             );

        //             const selfNodePos = positioned.find((p) => p.id === selfMember?.id);
        //             if (!selfNodePos) return;

        //             // Connect parent couple → self node
        //             lines.push({
        //                 from: { x: parentCenterX, y: parentBottomY },
        //                 to: {
        //                     x: selfNodePos.x + CARD_WIDTH / 2,
        //                     y: selfNodePos.y,
        //                 },
        //             });
        //         } else {
        //             // Normal single child (non-couple)
        //             const childNodePos = positioned.find((p) => p.id === d.data.id);
        //             if (!childNodePos) return;

        //             lines.push({
        //                 from: { x: parentCenterX, y: parentBottomY },
        //                 to: {
        //                     x: childNodePos.x + CARD_WIDTH / 2,
        //                     y: childNodePos.y,
        //                 },
        //             });
        //         }
        //     }
        // });

        setConnections(lines);

        // === D3 ZOOM SETUP ===
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
        <div className="w-[1170px] border rounded-lg bg-dot-grid">
            <div className="overflow-auto max-h-[600px] max-w-full rounded-lg">
                <svg
                    ref={svgRef}
                    width={1200}
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
                                key={`card-${idx}`}
                                x={node.x}
                                y={node.y}
                                person={node}
                                relation={node.relation}
                                onViewDetail={openSidebar}
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
