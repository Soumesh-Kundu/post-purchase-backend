export function toSnakeCase(str) {
    return str
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

export function normalizeSize(value) {
    const name = value.split(" - ").pop().trim();
    return { key: toSnakeCase(name), name };
}

export function normalizeColor(value) {
    const name = value.split("/")[0].trim();
    return { key: toSnakeCase(name), name };
}

export function normalizeValue(value) {
    let name = value;
    if (name.includes("/")) name = name.split("/")[0];
    if (name.includes(" - ")) name = name.split(" - ").pop();
    name = name.trim();
    return { key: toSnakeCase(name), name };
}

export function normalizeSizeAfterSlash(value) {
    let name = value;
    if (name.includes(" - ")) name = name.split(" - ").pop();
    if (name.includes("/")) name = name.split("/").pop();
    name = name.trim();
    return { key: toSnakeCase(name), name };
}

export function normalizeDuvetSize(value) {
    let name = value;
    if (name.includes("–")) name = name.split("–").pop();
    if (name.includes(" - ")) name = name.split(" - ")[0];
    if (name.includes("/")) name = name.split("/").pop();
    name = name.trim();
    return { key: toSnakeCase(name), name };
}

export function normalizeMiddleDash(value) {
    const parts = value.split(" - ");
    const name = (parts.length >= 3 ? parts[1] : parts[0]).trim();
    return { key: toSnakeCase(name), name };
}

export function normalizeFabric(value) {
    const name = value.includes("Extra Luxe") ? "Extra Luxe" : "Luxe";
    return { key: toSnakeCase(name), name };
}

export function uniqueByKey(entries) {
    const seen = new Map();
    for (const entry of entries) {
        if (!seen.has(entry.key)) seen.set(entry.key, entry);
    }
    return [...seen.values()];
}
