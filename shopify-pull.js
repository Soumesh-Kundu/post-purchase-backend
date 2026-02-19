import { callGraphQl } from "./utils/graphql.js"
import { writeFile } from "fs/promises";


const productIds = [
    "gid://shopify/Product/9160098578676",//comnforter
    "gid://shopify/Product/9160100708596",//pillowcase
    "gid://shopify/Product/9160098709748",//duvet cover
    "gid://shopify/Product/9160099070196",//detergent
]
const PRODUCT_QUERY = `
query($id: ID!) {
    product(id: $id) {
        options(first:10){
            name
            values
        }
        variants(first:250){
            nodes{
                id
                price
                selectedOptions{
                    name
                    value
                }
                inventoryQuantity
            }
        }
    }
}`

const optionOrdes = {
    0: ["Size", "Color"],
    1: ["Size", "Quantity"],
    2: ["Size", "Color"],
    3: ["Quantity", "Scent"]
}
async function fetchShopifyProducts(id, index) {
    const response = await callGraphQl(PRODUCT_QUERY,
        { id })
        ;
    const product = response.data.product;
    const result = {
        ...(optionOrdes[index].reduce((acc, option) => {
            acc[option.toLowerCase()] = [];
            return acc;
        }, {})),
        variants:{}
    }
    let curr = {};
    const options=product.options;
    for (const option of optionOrdes[index]) {
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
        for (const [idx, optionName] of Object.entries(optionOrdes[index])) {
            const option = variant.selectedOptions.find(option => option.name === optionName);
            if (idx < optionOrdes[index].length - 1) {
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
const idx = 2;
const data = await fetchShopifyProducts(productIds[idx], idx);
await writeFile("product-sample.json", JSON.stringify(data, null, 2));
