import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { callGraphQl, mutationOrderAddVariantString, mutationOrderEditBeginString, mutationOrderEditCommitString, mutationOrderEditSetQuantityString } from "./utils/graphql.js"
import cors from 'cors';
import { getOffers, getSelectedOffer,prudctGraph } from './utils/offers.js';
import dotenv from 'dotenv';

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
app.post('/api/offer', (req, res) => {
    const { varientIds } = req.body;
    let offerId = '2c-v2';
    if (varientIds.includes(luxeFabricVarientId)) {
        offerId = '1a';
    }
    const offers = getOffers();
    const offerProducts = offers.slice(0,4);

    res.send(JSON.stringify({ offers: offerProducts }));
});
app.post('/api/sign-changeset', (req, res) => {
    const { changes, referenceId } = req.body;

    const selectedOffer = getSelectedOffer(changes);

    const payload = {
        iss: process.env.SHOPIFY_API_KEY,
        jti: uuidv4(),
        iat: Date.now(),
        sub: referenceId,
        changes: selectedOffer?.changes,
    };

    const token = jwt.sign(payload, process.env.SHOPIFY_API_SECRET);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ token }));
})

app.post('/api/next-offer', (req, res) => {

    const { offerId, accept = false } = req.body;
    const nextOfferLinks = prudctGraph[offerId];
    const link = nextOfferLinks.length > 1 ? +accept : 0;
    const nextOfferid = nextOfferLinks[link];
    if (!nextOfferid) {
        return res.send(JSON.stringify({ offer: null }))
    }
    const offers = getOffers()
    const nextOffer = offers.find((offer) => offer.id === nextOfferid);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ offer: nextOffer }));
})


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});