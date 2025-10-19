export function transformToTreeFormat(data) {
    const self = data.self?.data;
    const spouses = data.spouse?.data || [];
    const siblings = data.siblings?.data || [];
    const children = data.children?.data || [];
    const parents = data.parents?.data || [];

    // Root placeholder
    const root = {
        id: "virtual-root",
        relation: "Root",
        children: [],
    };

    // --- SELF NODE ---
    const selfNode = {
        ...self,
        id: `person-${self?.id}`, // ✅ consistent ID used across both single/couple forms
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

    // --- CHILDREN ---
    const childrenNodes = children.map((child) => ({
        ...child,
        id: `child-${child.id}`,
        relation: "Child",
        children: [],
    }));

    // --- MAIN NODE (Self or Couple) ---
    const mainNode =
        spouseNodes.length > 0
            ? {
                ...selfNode,
                relation: "MainCouple",
                isCouple: true,
                members: [selfNode, ...spouseNodes],
                children: childrenNodes,
            }
            : {
                ...selfNode,
                children: childrenNodes,
            };

    // --- SIBLINGS ---
    const siblingNodes = siblings
        .filter((sib) => sib.id !== self?.id) // ✅ Prevent adding self as sibling
        .map((sib) => ({
            ...sib,
            id: `sibling-${sib.id}`,
            relation: "Sibling",
            children: [],
        }));

    // --- PARENTS ---
    if (parents.length === 1) {
        // Single parent
        const parentNode = {
            ...parents[0],
            id: `parent-${parents[0].id}`,
            relation: "Parent",
            children: [mainNode, ...siblingNodes],
        };
        root.children = [parentNode];
    } else if (parents.length >= 2) {
        // Parent couple
        const parentNodes = parents.slice(0, 2).map((p) => ({
            ...p,
            id: `parent-${p.id}`,
            relation: "Parent",
            children: [],
        }));

        const parentCoupleNode = {
            id: `parent-couple-${parents.map((p) => p.id).join("-")}`,
            relation: "ParentCouple",
            isCouple: true,
            members: parentNodes,
            children: [mainNode, ...siblingNodes],
        };

        root.children = [parentCoupleNode];
    } else {
        // No parents
        root.children = [mainNode, ...siblingNodes];
    }

    // ✅ DEDUPE — make sure no duplicate child references exist
    const seen = new Set();
    function dedupe(node) {
        if (!node?.children) return;
        node.children = node.children.filter((child) => {
            if (seen.has(child.id)) return false;
            seen.add(child.id);
            return true;
        });
        node.children.forEach(dedupe);
    }
    dedupe(root);

    return root;
}
