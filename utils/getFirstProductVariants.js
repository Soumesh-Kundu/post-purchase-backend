import { callGraphQl } from "./graphql.js"
import { normalizeSize, normalizeColor, uniqueByKey } from "./optionNormalizers.js"

const FirstproductIds = {
    "2c": {
        1: "gid://shopify/Product/8695292166294",
        2: "gid://shopify/Product/8695292264598",
        3: "gid://shopify/Product/8695292297366",
        4: "gid://shopify/Product/8695292395670",
    },
    "2d": {
        1: "gid://shopify/Product/8695292493974",
        2: "gid://shopify/Product/8695292625046",
        3: "gid://shopify/Product/8695292690582",
        4: "gid://shopify/Product/8695292723350",
    }
}

const PRODUCT_OPTIONS_QUERY = `
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

export async function getFirstProductVariants(productCode) {
    const idsByQuantity = FirstproductIds[productCode];
    if (!idsByQuantity) throw new Error(`No product ids found for product code "${productCode}"`);

    const result = {};
    for (const [quantity, id] of Object.entries(idsByQuantity)) {
        const response = await callGraphQl(PRODUCT_OPTIONS_QUERY, { id });
        const product = response.data.product;

        const sizeOptionData = product.options.find(opt => opt.name === "Size");
        const colorOptionData = product.options.find(opt => opt.name === "Color");

        result[quantity] = {
            size: sizeOptionData ? uniqueByKey(sizeOptionData.values.map(normalizeSize)) : [],
            color: colorOptionData ? uniqueByKey(colorOptionData.values.map(normalizeColor)) : [],
            variants: {},
        };

        for (const variant of product.variants.nodes) {
            if (!variant.inventoryQuantity || variant.inventoryQuantity <= 0) continue;

            const sizeOption = variant.selectedOptions.find(opt => opt.name === "Size");
            const colorOption = variant.selectedOptions.find(opt => opt.name === "Color");
            if (!sizeOption || !colorOption) continue;

            const { key: size } = normalizeSize(sizeOption.value);
            const { key: color } = normalizeColor(colorOption.value);

            result[quantity].variants[size] = result[quantity].variants[size] || {};
            result[quantity].variants[size][color] = {
                id: variant.id.split("/").pop(),
                price: variant.price,
                compareAtPrice: variant.compareAtPrice,
            };
        }
    }
    return result;
}
