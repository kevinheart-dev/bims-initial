export function toTitleCase(str) {
    return str.replace(/\b\w+/g, (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

export function toSentenceCase(str) {
    if (!str) return '';
    const trimmed = str.trimStart();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function toUpperCase(str) {
    return str.toUpperCase();
}
