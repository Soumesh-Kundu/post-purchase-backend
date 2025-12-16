import { fetchProductData } from "./utils/fetchProduct.js";
import fs from 'fs/promises';

const slug = "2c"
const fileName = `./utils/matrix/${slug}.json`

const data = await fs.readFile(fileName, 'utf-8');
const products = JSON.parse(data);
// const variants=product.variants;
const slugs = products.map(products => ({ slug: products.slug })).sort((a, b) =>
    a.slug.localeCompare(b.slug))
const optionsArray=["Fabric","Size","Color"];
// const optionsArray = ["Fabric", "Quantity", "Color"];
const optionsToSelect = optionsArray.slice(1);
const result =await firstOfferMapping(products, optionsToSelect);
console.log(result);
// console.dir(slugs, { depth: null });

async function firstOfferMapping(products, optionsToSelect) {
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
    const mappedData=JSON.parse(await fs.readFile(`./utils/products/${slug}.json`, 'utf-8'));
    const desiredProducts=products.filter(product=>new RegExp(Object.values(orderMapping).map(item=>item.slug).join("|")).test(product.slug)).reduce((acc,product)=>{
        acc[product.slug]=product;
        return acc;
    },{});
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

function generalVariantMapping(variants, optionsToSelect, alreadyMapping={}) {
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