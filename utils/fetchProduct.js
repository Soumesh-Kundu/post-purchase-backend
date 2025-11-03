import { callGraphQl } from "./graphql.js";
import fs from 'fs/promises';

export async function fetchData(productId) {
    console.time("fetch-product-data");
    const response = await callGraphQl(PRODUCT_QUERY, { id: productId });
    const product = response.data.product;
    const size = new Set();
    const colors = new Map();
    const variantsMapping = {};
    for (const variant of product.variants.nodes) {
        let currentSizeKey = null;
        for (const option of variant.selectedOptions.sort((a, b) => b.name.localeCompare(a.name))) {
            if (option.name === "Size") {
                size.add(option.value);
                currentSizeKey = option.value;
                if (currentSizeKey && !variantsMapping[currentSizeKey]) {
                    variantsMapping[currentSizeKey] = {};
                }
            } else if (option.name === "Color") {
                const colorName = option.optionValue.name.split('/')[0].trim().toLowerCase();
                colors.set(colorName, {
                    id: option.optionValue.id,
                    color: colorName,
                    name: option.value,
                    swatch: null,
                    images: []
                });
                if (variantsMapping[currentSizeKey]) {
                    variantsMapping[currentSizeKey][colorName] = {
                        changes: [
                            {
                                type: "add_variant",
                                variantID: Number(variant.id.split('/').pop()),
                                quantity: 1,
                            },
                        ]
                    };
                }
            }
            else if(option.name==="Title"){
                size.add(option.value);
                variantsMapping[option.optionValue.name]={
                    changes: [
                        {
                            type: "add_variant",
                            variantID: Number(variant.id.split('/').pop()),
                            quantity: 1,
                        },
                    ]
                };
            }
            else {
                continue
            }
        }
    }

    const imagesWithAlt = product.images.nodes.filter(image => image.alt);
    for (const image of imagesWithAlt) {
        const altText = image.alt.split('/')[0].trim().toLowerCase();
        const colorKey = altText.replace(/^v\-/, '').trim().replace(/\-/g, ' ');
        if (/^v\-/.test(altText)) {
            const getColor = colors.get(colorKey);
            if (getColor) {
                getColor.swatch = image.preview.image.url;
            }
            colors.set(colorKey, getColor);
        }
        else {
            const getColor = colors.get(colorKey);
            if (getColor) {
                getColor.images.push(image.preview.image.url);
            }
        }
    }
    let colorsList=Array.from(colors.values()).filter(c => c?.swatch);
    if(colorsList.length===0){
      colorsList=[{
        id: "gid://shopify/MediaImage/0",
        color: "default",
        name: "Default",
        swatch: "https://via.placeholder.com/50",
        images: imagesWithAlt.length>0 ? imagesWithAlt.slice(0,5).map(img => img.preview.image.url) :product.images.nodes.slice(0,5).map(img => img.preview.image.url)
      }]
    }

    const finalProduct = {
        id: product.id,
        title: product.title,
        description: product.description,
        sizes: Array.from(size),
        colors: colorsList,
        variants: variantsMapping
    }
    await fs.writeFile('productData.json', JSON.stringify(finalProduct, null, 2));  
    console.timeEnd("fetch-product-data");
    return finalProduct;
}


const PRODUCT_QUERY = `#graphql
    query p($id: ID!) {
      product(id: $id) {
        id
        title
        description
        variants(first: 250) {
          nodes {
            id
            title
            selectedOptions {
              name
              optionValue {
                name
                swatch {
                  color
                  image {
                    originalSource {
                      url
                    }
                  }
                }
                name
                id
              }
              value
            }
          }
        }
        images:media(first:250){
          nodes{
            id
            alt
            preview{
              image{
                url
              }
            }
          }
        }
      }
    }
    `