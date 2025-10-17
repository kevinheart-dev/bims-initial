export function transformToTreeFormat(data) {
    const self = data.self?.data;
    const spouses = data.spouse?.data || [];
    const siblings = data.siblings?.data || [];
    const children = data.children?.data || [];
    const parents = data.parents?.data || [];

    const root = {
        id: "virtual-root",
        relation: "Root",
        children: [],
    };

    // --- SELF NODE ---
    const selfNode = {
        ...self,
        id: `self-${self?.id}`,
        relation: "Self",
        children: [],
    };

    // --- SPOUSE NODES ---
    const spouseNodes = spouses.map((sp) => ({
        ...sp,
        id: `spouse-${sp.id}`,
        relation: "Spouse",
        children: [],
    }));

    // --- CHILDREN NODES ---
    const childrenNodes = children.map((child) => {
        const parentIds = [self?.id, ...spouses.map((sp) => sp.id)].filter(Boolean);
        return {
            ...child,
            id: `child-${child.id}`,
            relation: "Child",
            parents: parentIds,
            children: [],
        };
    });

    // --- MAIN NODE (SELF + SPOUSE AS ONE UNIT) ---
    let mainNode;
    if (spouseNodes.length > 0) {
        mainNode = {
            id: `main-couple-${self.id}`,
            relation: "MainCouple",
            isCouple: true,
            members: [selfNode, ...spouseNodes],
            children: childrenNodes,
        };
    } else {
        mainNode = {
            ...selfNode,
            children: childrenNodes,
        };
    }

    // --- SIBLING NODES ---
    const siblingNodes = siblings.map((sib) => ({
        ...sib,
        id: `sibling-${sib.id}`,
        relation: "Sibling",
        children: [],
    }));

    // --- PARENT CONNECTION HANDLING ---
    if (parents.length === 1) {
        // One parent only
        const parentNode = {
            ...parents[0],
            id: `parent-${parents[0].id}`,
            relation: "Parent",
            children: [mainNode, ...siblingNodes],
        };
        root.children.push(parentNode);
    } else if (parents.length >= 2) {
        // Two or more parents — treat as couple
        const parentNodes = parents.slice(0, 2).map((p) => ({
            ...p,
            id: `parent-${p.id}`,
            relation: "Parent",
            children: [],
        }));

        const parentCoupleNode = {
            id: `parent-couple-${self.id}`,
            relation: "ParentCouple",
            isCouple: true,
            members: parentNodes,
            children: [mainNode, ...siblingNodes],
        };
        root.children.push(parentCoupleNode);
    } else {
        // No parents — self/siblings at root
        root.children.push(mainNode, ...siblingNodes);
    }

    return root;
}
