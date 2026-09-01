import { callGraphQl } from "./graphql.js";
import fs from 'fs/promises';
import * as dotenv from "dotenv";
dotenv.config();

const MATRIX_URL="https://api.mtrix.io"
const ORGANIZATION_ID=process.env.MATRIX_ORGANIZATION_ID
const PROJECT_ID=process.env.MATRIX_PROJECT_ID
const MEMBER_ID=process.env.MATRIX_MEMBER_ID
export async function fetchProductData(slug) {
  try {
      console.time("fetch-product-data");
      const query = `${MATRIX_URL}/products/view?route=${slug}`;
      const authHeaders={
        "x-mtrix-organization": ORGANIZATION_ID,
        "x-mtrix-project": PROJECT_ID,
        "x-mtrix-member": MEMBER_ID
      }
      const response=await fetch(query,{
        headers:authHeaders
      });
    if (!response.ok) {
        console.log(response)
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData=await response.json();
    const productData=responseData.data;
    console.timeEnd("fetch-product-data");
    return productData;
  } catch (error) {
    console.log("Error fetching product data:", error);
    return []; // Return an empty array in case of error
  }
}


export async function firstOfferMapping(products, optionsToSelect,alreadyMapping={}) {
    const orderMapping={
        1:{
            slug:"get-1x-extra-miracle-sheet-set-clean-cool",
        },
        2:{
            slug:"get-2x-extra-miracle-sheet-set-clean-cool"
        },
        3:{
            slug:"get-3x-extra-miracle-sheet-set-clean-cool"
        },
        4:{
            slug:"get-1x-extra-miracle-sheet-set-clean-cool"
        }
    }
    //remove mapped data when moving to production
    const mappedData=alreadyMapping;
    const desiredProducts=products.filter(product=>new RegExp(Object.values(orderMapping).map(item=>item.slug).join("|")).test(product.slug)).reduce((acc,product)=>{
        acc[product.slug]=product;
        return acc;
    },{});
    // console.log({desiredProducts})
    const result={};
    for(const [orderKey,orderValue] of Object.entries(orderMapping)){
        const product=desiredProducts[orderValue.slug];
        if(!product) continue;
        const variants=product.variants;
        const currentMapping= mappedData[orderKey] || {};
        result[orderKey]=generalVariantMapping(variants,optionsToSelect,currentMapping);
    }
    return result;
}

export function generalVariantMapping(variants, optionsToSelect, alreadyMapping={}) {
    const result = {};
    for (const variant of variants) {
        const options = { Color: "default" };
        if (variant.inventory.quantity < 1) continue;
        for (const optionValue of variant.options) {
            if (!optionsToSelect.includes(optionValue.name)) continue;
            options[optionValue.name] = optionValue.key;
        }
        let curr = result;
        let mapped=alreadyMapping;
        for (const [i, option] of Object.entries(optionsToSelect)) {
            const key = options[option];
            const index = parseInt(i);
            if (!curr[key] && index < optionsToSelect.length - 1) {
                curr[key] = {};
            }
            else if (index === optionsToSelect.length - 1) {
                curr[key] = mapped[key] ?? variant.variant_id;
            }
            curr = curr[key];
            mapped=mapped[key] || {};
        }
    }
    return result;
}

