import dotenv from 'dotenv'
dotenv.config()

export async function shopifyDev(query,variables={}){
    const res=await fetch(`https://${process.env.SHOP_DOMAIN_DEV}/admin/api/2026-01/graphql.json`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-Shopify-Access-Token':process.env.ACCESS_TOKEN_DEV
        },
        body:JSON.stringify({query,variables})
    })
    return await res.json()
}

