import { callGraphQl } from "./graphql.js"
import {
    normalizeValue,
    normalizeFabric,
    normalizeSizeAfterSlash,
    normalizeDuvetSize,
    normalizeMiddleDash,
    uniqueByKey,
    normalizeQuantity,
    normalizeSizeWithSuffix,
} from "./optionNormalizers.js"

const PRODUCT_QUERY = `
query($id: ID!) {
    product(id: $id) {
        title
        options(first:10){
            name
            values
        }
        variants(first:250){
            nodes{
                id
                price
                compareAtPrice
                selectedOptions{
                    name
                    value
                }
                inventoryQuantity
            }
        }
    }
}`

const DEFAULT_OPTION_NAME_MAP = {
    sizes: "Size",
    colors: "Color",
    fabric: "Fabric",
    quantity: "Quantity",
}

const PRODUCT_CONFIG = {
    "11b": {
        normalizers: { quantity: normalizeQuantity,sizes: normalizeSizeWithSuffix },
    },
    "3b": {
        normalizers: { fabric: normalizeFabric },
    },
    "5b": {
        normalizers: { sizes: normalizeSizeAfterSlash },
    },
    "5b-cooling": {
        normalizers: { sizes: normalizeSizeAfterSlash },
    },
    "6b": {
        normalizers: { sizes: normalizeDuvetSize },
    },
    "8b": {
        normalizers: { sizes: normalizeMiddleDash },
        orderOverrides: { sizes: ['cali_king'] },
    },
    "4b": {
        optionNameMap: { sizes: "Title" },
    },
}

function moveToEnd(items, valuesToEnd, getValue) {
    if (!valuesToEnd || valuesToEnd.length === 0) return items;
    const rest = items.filter(item => !valuesToEnd.includes(getValue(item)));
    const moved = valuesToEnd
        .map(value => items.find(item => getValue(item) === value))
        .filter(Boolean);
    return [...rest, ...moved];
}

export async function getSecondProductVariants(id, productCode, selectionOrder) {
    const { normalizers = {}, optionNameMap = {}, orderOverrides = {} } = PRODUCT_CONFIG[productCode] || {};
    const sourceOptionNameMap = { ...DEFAULT_OPTION_NAME_MAP, ...optionNameMap };

    const response = await callGraphQl(PRODUCT_QUERY, { id });
    const product = response.data.product;

    const normalizeByOption = (optionName, value) =>
        (normalizers[optionName] || normalizeValue)(value);
    const sourceOptionName = optionName => sourceOptionNameMap[optionName] || optionName;

    const result = {};
    for (const optionName of selectionOrder) {
        const optionData = product.options.find(
            opt => opt.name.toLowerCase() === sourceOptionName(optionName).toLowerCase()
        );
        const entries = optionData
            ? uniqueByKey(optionData.values.map(value => normalizeByOption(optionName, value)))
                .map(({ key, name, bestSeller }) => ({ value: key, label: name, ...(bestSeller ? { bestSeller } : {}) }))
            : [];
        result[optionName] = moveToEnd(entries, orderOverrides[optionName], item => item.value);
    }

    // Sort variants so any value listed in orderOverrides is inserted last,
    // which keeps the nested `variants` object's key order (and therefore
    // any "pick the first key as default" logic downstream) in sync with
    // the reordered options list above.
    const rankVariant = variant => selectionOrder.map(optionName => {
        const overrideList = orderOverrides[optionName];
        if (!overrideList || overrideList.length === 0) return 0;
        const selected = variant.selectedOptions.find(
            opt => opt.name.toLowerCase() === sourceOptionName(optionName).toLowerCase()
        );
        if (!selected) return 0;
        const key = normalizeByOption(optionName, selected.value).key;
        return overrideList.includes(key) ? 1 : 0;
    });
    const sortedVariants = Object.keys(orderOverrides).length === 0
        ? product.variants.nodes
        : [...product.variants.nodes].sort((a, b) => {
            const rankA = rankVariant(a);
            const rankB = rankVariant(b);
            for (let i = 0; i < rankA.length; i++) {
                if (rankA[i] !== rankB[i]) return rankA[i] - rankB[i];
            }
            return 0;
        });

    const variants = {};
    for (const variant of sortedVariants) {
        if (!variant.inventoryQuantity || variant.inventoryQuantity <= 0) continue;

        const path = [];
        for (const optionName of selectionOrder) {
            const selected = variant.selectedOptions.find(
                opt => opt.name.toLowerCase() === sourceOptionName(optionName).toLowerCase()
            );
            if (!selected) { path.length = 0; break; }
            path.push(normalizeByOption(optionName, selected.value).key);
        }
        if (path.length !== selectionOrder.length) continue;

        let curr = variants;
        for (let i = 0; i < path.length - 1; i++) {
            curr[path[i]] = curr[path[i]] || {};
            curr = curr[path[i]];
        }
        curr[path[path.length - 1]] = {
            id: variant.id.split("/").pop(),
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
        };
    }
    result.variants = variants;

    return result;
}
