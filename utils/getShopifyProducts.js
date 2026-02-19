import { PRODUCT_QUERY } from "./graphql.js";
import { callGraphQl } from "./graphql.js"
import { writeFile } from "fs/promises";


export const productIds = [
    "gid://shopify/Product/9160098578676",//comnforter
    "gid://shopify/Product/9160100708596",//pillowcase
    "gid://shopify/Product/9160098709748",//duvet cover
    "gid://shopify/Product/9160099070196",//detergent
]

const optionOrders = {
    0: ["Size", "Color"],
    1: ["Size", "Quantity"],
    2: ["Size", "Color"],
    3: ["Quantity", "Scent"]
}
export const productOptionMapping=productIds.reduce((acc, id, index)=>{
    acc[id]=optionOrders[index];
    return acc;
},{});

export async function fetchShopifyProducts(id, optionOrders) {
    const response = await callGraphQl(PRODUCT_QUERY,
        { id })
        ;
    const product = response.data.product;
    const result = {
        ...(optionOrders.reduce((acc, option) => {
            acc[option.toLowerCase()] = [];
            return acc;
        }, {})),
        variants:{}
    }
    let curr = {};
    const options=product.options;
    for (const option of optionOrders) {
        const optionData = options.find(opt => opt.name === option);
        if (optionData) {
            result[option.toLowerCase()] = optionData.values.map(value=>{
                return {
                    key:value,
                    name:value
                }
            });
        }
    }
    const variants = product.variants.nodes;
    for (const variant of variants) {
        curr = result.variants;
        for (const [idx, optionName] of Object.entries(optionOrders)) {
            const option = variant.selectedOptions.find(option => option.name === optionName);
            if (idx < optionOrders.length - 1) {
                curr[option.value] = curr[option.value] || {};
                curr = curr[option.value];
            }
            else {
                curr[option.value] = {
                    price: variant.price,
                    inventory: variant.inventoryQuantity,
                    id: variant.id.split("/").pop(),
                }
            }
        }
    }


    return result;
}
