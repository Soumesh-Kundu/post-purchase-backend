import { PRODUCT_QUERY } from "./graphql.js";
import { callGraphQl } from "./graphql.js"
import {config } from "dotenv";
config();

const devProductIds=[
    "gid://shopify/Product/9426670878964",//comnforter
    "gid://shopify/Product/9426670944500",//pillowcase
    "gid://shopify/Product/9426670780660",//duvet cover
    "gid://shopify/Product/9426671010036",//detergent
]

const prodProductIds=[
    "gid://shopify/Product/8610367111318",//comnforter
    "gid://shopify/Product/8610367176854",//pillowcase
    "gid://shopify/Product/8610366914710",//duvet cover
    "gid://shopify/Product/8611540205718",//detergent
]

const envoirment=process.env.NODE_ENV || "development";
export let productIds;
if(envoirment==="development"){
    productIds = prodProductIds;
}
else if(envoirment==="production"){
    productIds = prodProductIds;    
}

const detergentID=productIds[3];

const optionOrders = {
    0: ["Size", "Color"],
    1: ["Size", "Quantity"],
    2: ["Size", "Color"],
    3: ["Quantity"]
}

const detergentOptions={
    "miracle_made®_detergent_-_buy_1_box_get_1_free_(64_loads)":"b1g1",
    "miracle_made®_detergent_-_buy_2_boxes_get_2_free_(128_loads)":"b2g2",
    "miracle_made®_detergent_-_buy_3_boxes_get_3_free_(192_loads)":"b3g3"
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
        const searchKey=id!==detergentID ? option : "Title";
        const optionData = options.find(opt => opt.name === searchKey);
        if (optionData) {
            result[option.toLowerCase()] = optionData.values.map(value=>{
                const optionValue=value.toLowerCase().replace(/\s|\//g, "_");
                return {
                    key:id!==detergentID ? optionValue : detergentOptions[optionValue],
                    name:id!==detergentID ?value: value.split(" - ")[1]
                }
            });
        }
    }
    const variants = product.variants.nodes;
    for (const variant of variants) {
        curr = result.variants;
        for (const [idx, optionName] of Object.entries(optionOrders)) {
            const searchKey=id!==detergentID ? optionName : "Title";
            const option = variant.selectedOptions.find(option => option.name === searchKey);
            const optionValue=option.value.toLowerCase().replace(/\s|\//g, "_");
            if (idx < optionOrders.length - 1) {
                curr[optionValue] = curr[optionValue] || {};
                curr =id!==detergentID ?  curr[optionValue]: curr[detergentOptions[optionValue]];
            }
            else {
                const key=id!==detergentID ? optionValue : detergentOptions[optionValue];
                curr[key] = {
                    price: variant.price,
                    inventory: variant.inventoryQuantity,
                    id: variant.id.split("/").pop(),
                }
            }
        }
    }


    return result;
}

