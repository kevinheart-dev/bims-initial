export function transformToTreeFormat(data) {
    const self = data.self?.data;
    const spouse = data.spouse?.data?.[0];
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

    let mainNode;
    if (spouse) {
        mainNode = {
            id: `couple-${self.id}-${spouse.id}`,
            isCouple: true,
            relation: "Couple",
            children: children.map((child) => ({
                ...child,
                id: `child-${child.id}`,
                relation: "Child",
                children: [],
            })),
            members: [
                selfNode,
                {
                    ...spouse,
                    id: `spouse-${spouse.id}`,
                    relation: "Spouse",
                    children: [],
                },
            ],
        };
    } else {
        mainNode = {
            ...selfNode,
            children: children.map((child) => ({
                ...child,
                id: `child-${child.id}`,
                relation: "Child",
                children: [],
            })),
        };
    }

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
