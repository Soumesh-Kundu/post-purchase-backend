export async function callGraphQl(query,variables={}){
    const res=await fetch('https://miracle-brand-checkout-migrate-dev.myshopify.com/admin/api/2025-07/graphql.json',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-Shopify-Access-Token':process.env.ACCESS_TOKEN
        },
        body:JSON.stringify({query,variables})
    })
    return await res.json()
}

export const mutationOrderEditBeginString = `mutation orderEditBegin($id: ID!) {
  orderEditBegin(id: $id) {
    calculatedOrder {
      id
      lineItems(first:50){
        edges{
          node{
            id
            title
            quantity
            variant{
                id
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`

export const mutationOrderEditSetQuantityString=`mutation addVariantToOrder($id:ID!,$lineItemId:ID!,$restock:Boolean!,$quantity:Int!){
  orderEditSetQuantity(id:$id, lineItemId:$lineItemId,restock:$restock,quantity: $quantity){
    calculatedOrder {
      id
      addedLineItems(first:5) {
        edges {
          node {
            id
            quantity
            originalUnitPriceSet{
              presentmentMoney{
                amount
              }
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
`

export const mutationOrderAddVariantString=`mutation addVariantToOrder($id:ID!,$variantId:ID!,$quantity:Int!){
  orderEditAddVariant(id: $id, variantId:$variantId, quantity: $quantity){
    calculatedOrder {
      id
      addedLineItems(first:5) {
        edges {
          node {
            id
            quantity
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`

export const mutationOrderEditCommitString=`mutation commitEdit($id:ID!) {
  orderEditCommit(id:$id, notifyCustomer: false, staffNote: "Updated by app") {
    order {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`