import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { callGraphQl, mutationOrderAddVariantString, mutationOrderEditBeginString, mutationOrderEditCommitString, mutationOrderEditSetQuantityString } from "./utils/graphql.js"
import { fetchData } from "./utils/fetchProduct.js"
import cors from 'cors';
import { FirstOffer, getOffers, getSelectedOffer,prudctGraph, softIdToHardIdMap } from './utils/offers.js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json());
app.use(express.static('static'));
app.use(cors());

// Basic route

app.get('/health', (req, res) => {
    res.send('OK');
});

const requiredVariants = [
    "gid://shopify/ProductVariant/46968634802403",
    "gid://shopify/ProductVariant/46968634573027"
]
const addingVariant = "gid://shopify/ProductVariant/47065776292067"

app.post('/api/order-update', async (req, res) => {
    try {
        console.time("update-order")
        const orderId = req.body.admin_graphql_api_id
        if (!orderId) {
            return res.status(400).json({ error: 'Missing orderId parameter' });
        }
        const { data } = await callGraphQl(mutationOrderEditBeginString, {
            id: orderId
        }
        )
        const calculatedOrderId = data.orderEditBegin.calculatedOrder.id
        const lineItems = data.orderEditBegin.calculatedOrder.lineItems.edges.map(edge => edge.node).reduce((acc, item) => {
            acc[item.variant.id] = {
                id: item.id,
                title: item.title,
                quantity: item.quantity
            }
            return acc
        }, {})
        let skipEdit = false
        for (const variantId of requiredVariants) {
            if (!lineItems[variantId]) {
                skipEdit = true
                break
            }
        }
        if (skipEdit) {
            return res.json({ message: "No need to update", lineItems })
        }
        const editPromise = []
        for (const variantId of requiredVariants) {
            const lineItem = lineItems[variantId]
            if (lineItem.quantity > 0) {
                editPromise.push(callGraphQl(mutationOrderEditSetQuantityString, {
                    id: calculatedOrderId,
                    lineItemId: lineItem.id,
                    restock: true,
                    quantity: 0
                }))
            }
        }
        editPromise.push(callGraphQl(mutationOrderAddVariantString, {
            id: calculatedOrderId,
            variantId: addingVariant,
            quantity: 1
        }))
        const editResults = await Promise.all(editPromise)
        for (const result of editResults) {
            console.log(result)
            if (result.data.orderEditSetQuantity) {
                const userErrors = result.data.orderEditSetQuantity.userErrors
                console.log(userErrors, "from set quantity")
                if (userErrors.length) {
                    return res.status(500).json({ error: userErrors })
                }
            }
            if (result.data.orderEditAddVariant) {
                const userErrors = result.data.orderEditAddVariant.userErrors
                if (userErrors.length) {
                    return res.status(500).json({ error: userErrors, lineItems })
                }
            }
        }
        const result = await callGraphQl(mutationOrderEditCommitString, {
            id: calculatedOrderId
        })
        const userErrors = result.data.orderEditCommit.userErrors
        if (userErrors.length) {
            return res.status(500).json({ error: userErrors })
        }
        return res.json({ message: "Order updated successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch products' });
    }
    console.timeEnd("update-order")
})


const luxeFabricVarientId = 46968634933475
app.post('/api/v2/offer', (req, res) => {
    const { varientIds } = req.body;
    // let offerId = '2c-v2';
    let offerId = '2c';
    // if (varientIds.includes(luxeFabricVarientId)) {
    //     offerId = '1a';
    // }
    const offers = getOffers();
    const offerProducts = offers.slice(0,4);

    res.send(JSON.stringify({ offers: offerProducts }));
});
app.post('/api/v1/offer', async (req, res) => {
    let offerId = '2c';
    const product=FirstOffer;
    const variantsMapping=await fs.readFile(`./utils/products/${offerId}.json`, 'utf-8');
    const products=Object.entries(JSON.parse(variantsMapping)).map(item => ({
        ...product,
        variants: item[1],
    }))
    res.send(JSON.stringify({ offer: products }));
});
app.post('/api/sign-changeset', (req, res) => {
    const { changes, referenceId } = req.body;

    const payload = {
        iss: process.env.SHOPIFY_API_KEY,
        jti: uuidv4(),
        iat: Date.now(),
        sub: referenceId,
        changes: changes,
    };

    const token = jwt.sign(payload, process.env.SHOPIFY_API_SECRET);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ token }));
})

app.post('/api/next-offer', async (req, res) => {
    const { offerId, accept = false } = req.body;
    let shouldOfferId = offerId;
    if(offerId.includes("/")){
      shouldOfferId=offerId.split("/")[0];
    }
    const nextOfferLinks = prudctGraph[shouldOfferId];
    const link = nextOfferLinks.length > 1 ? +accept : 0;
    const nextOfferid = nextOfferLinks[link];
    if (!nextOfferid) {
        return res.send(JSON.stringify({ offer: null }))
    }
    const nextOffer = getSelectedOffer(nextOfferid);
    const variantsMapping=await fs.readFile(`./utils/products/${nextOfferid}.json`, 'utf-8');
    const product= {
        ...nextOffer,
        variants: JSON.parse(variantsMapping)
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ offer: {cid:nextOfferid,...product} }));
})


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});