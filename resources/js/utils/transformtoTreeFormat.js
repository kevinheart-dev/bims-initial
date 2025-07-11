export function transformToTreeFormat(data) {
    const self = data.self?.data;
    const spouses = data.spouse?.data || []; // Support multiple spouses
    const siblings = data.siblings?.data || [];
    const children = data.children?.data || [];
    const parents = data.parents?.data || [];

    const root = {
        id: "virtual-root",
        relation: "Root",
        children: [],
    };

    const selfNode = {
        ...self,
        id: `self-${self.id}`,
        relation: "Self",
        children: [],
    };

    const siblingNodes = siblings.map((sibling) => ({
        ...sibling,
        id: `sibling-${sibling.id}`,
        relation: "Sibling",
        children: [],
    }));

    // Convert all children to tree nodes
    const childrenNodes = children.map((child) => ({
        ...child,
        id: `child-${child.id}`,
        relation: "Child",
        children: [],
    }));

    let mainNode;

    if (spouses.length > 0) {
        const spouseNodes = spouses.map((spouse) => ({
            ...spouse,
            id: `spouse-${spouse.id}`,
            relation: "Spouse",
            children: [],
        }));

        mainNode = {
            id: `couple-${self.id}`,
            isCouple: true,
            relation: "Couple",
            children: childrenNodes,
            members: [selfNode, ...spouseNodes],
        };
    } else {
        mainNode = {
            ...selfNode,
            children: childrenNodes,
        };
    }

    // Handle parent-child structure
    if (parents.length > 0) {
        const parentNodes = parents.map((parent) => ({
            ...parent,
            id: `parent-${parent.id}`,
            relation: "Parent",
            children: [],
        }));

        parentNodes[0].children.push(mainNode, ...siblingNodes);
        root.children.push(...parentNodes);
    } else {
        root.children.push(mainNode, ...siblingNodes);
    }

    return root;
}
