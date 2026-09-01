import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { callGraphQl, mutationOrderAddVariantString, mutationOrderEditBeginString, mutationOrderEditCommitString, mutationOrderEditSetQuantityString, queryOrderByReferenceId } from "./utils/graphql.js"
import cors from 'cors';
import { FirstOffer, FirstOfferExtra, getOffers, getOffersV2, getSelectedOffer, prudctGraph, softIdToHardIdMap } from './utils/offers.js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import * as ConvertSDKModule from "@convertcom/js-sdk"
import { shopifyDev } from './utils/secondaryGraphql.js';
const ConvertSDK = ConvertSDKModule.default?.default || ConvertSDKModule.default || ConvertSDKModule;
import path from 'path';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors({
    origin: '*', // Allow all origins for testing; adjust in production
}));

// Basic route

app.get('/health', (req, res) => {
    res.send('OK');
});



// Helper function to detect device type from User-Agent
const detectDeviceType = (userAgent) => {
    if (!userAgent) {
        return 'desktop'; // default to desktop if no user-agent
    }

    const ua = userAgent.toLowerCase();

    // Tablet/Pad detection
    if (/ipad|android(?:.*?)tablet|kindle|playbook|silk|nexus 7|nexus 10|xoom|motorola|trident.*tablet|windows.*touch/i.test(ua)) {
        return 'pad';
    }

    // Mobile detection
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini|windows phone|webos|palm|symbian|j2me|midp|cldc|netfront|midp-2|plucker|teleca|u11|uberSoldier|uplink|vodafone|wap|windows ce|xda|zte|zune/i.test(ua)) {
        return 'mobile';
    }

    // Default to desktop
    return 'desktop';
};

app.post('/api/post-purchase-type', async (req, res) => {
    const { referenceId } = req.body;
    try {
        if (!referenceId) {
            return res.status(400).json({ error: 'Missing referenceId parameter' });
        }
        const orders = await shopifyDev(queryOrderByReferenceId, {
            query: `checkout_token:${referenceId}`
        })
        console.log({ referenceId })
        const order = orders.data.orders.nodes[0]
        console.dir({ orders }, { depth: null })
        return res.json({ postPurchaseType: order?.customAttributes.find(attr => attr.key === "source")?.value === "miracle-headless" ? "multi-page" : null })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Failed to fetch post-purchase type' });
    }
})

app.post('/api/v2/offer', async (req, res) => {
    try {

        const deviceType = detectDeviceType(req.headers['user-agent']);
        const offers = await getOffersV2();
        const offerProducts = offers;

        res.send(JSON.stringify({ offers: offerProducts, deviceType }));
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});
const generateRandomString = () => {
    function generateRandomSegment(length) {
        let result = '';
        const characters = 'abcdefgh0123456789';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }

    const segment1 = generateRandomSegment(8);
    const segment2 = generateRandomSegment(4);
    const segment3 = generateRandomSegment(4);
    const segment4 = generateRandomSegment(12);

    return `${segment1}-${segment2}-${segment3}-${segment4}`;
};

app.post('/api/v1/offer', async (req, res) => {
    try {

        const deviceType = detectDeviceType(req.headers['user-agent']);
        const {firstProduct} = req.body;
        let offerId = firstProduct;
        const product = offerId === '2d' ? FirstOfferExtra : FirstOffer;

        const jsonPath = path.join(process.cwd(), 'utils', 'products', `${offerId}.json`);
        const alreadyMappedVariants = await fs.readFile(jsonPath);
        const variantsMapping = JSON.parse(alreadyMappedVariants);

        const products = Object.entries(variantsMapping).map(item => ({
            ...product,
            variants: item[1],
        }))
        res.send(JSON.stringify({ offer: products,deviceType }));
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
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
    const { offerId, accept = false, referenceId, currentVariantId } = req.body;
    let shouldOfferId = offerId;
    if (offerId.includes("/")) {
        shouldOfferId = offerId.split("/")[0];
    }
    const nextOfferLinks = prudctGraph[shouldOfferId];
    const link = nextOfferLinks.length > 1 ? +accept : 0;
    const nextOfferid = nextOfferLinks[link];
    if (!nextOfferid) {
        return res.send(JSON.stringify({ offer: null }))
    }
    const nextOffer = getSelectedOffer(nextOfferid);

    const jsonPath = path.join(process.cwd(), 'utils', 'products', `${nextOfferId}.json`);
    const alreadyMappedVariants = await fs.readFile(jsonPath, 'utf-8');
    const variantsMapping = JSON.parse(alreadyMappedVariants);

    const product = {
        ...nextOffer,
        variants: variantsMapping
    };

    const orders = await shopifyDev(queryOrderByReferenceId, {
        query: `checkout_token:${referenceId}`
    })
    console.dir({ referenceId, orders }, { depth: null })
    const order = orders.data.orders.nodes[0]
    const convertId = order.customAttributes.find(attr => attr.key === "userId")?.value
    const lineItems = order.lineItems?.nodes || []
    const upsellItem = lineItems.find(item => item.variant.id === `gid://shopify/ProductVariant/${currentVariantId}`)
    console.log({ upsellItem, accept, currentVariantId })
    if (accept && currentVariantId && upsellItem && convertId) {
        const convertSDK = new ConvertSDK({
            sdkKey: '100414426/100416021',
            environment: 'production',
            dataRefreshInterval: 5000
        });
        await convertSDK.onReady();
        const transactionId = generateRandomString()
        let userContext = convertSDK.createContext(convertId);
        const upsellQuantity = upsellItem.quantity
        const upsellRevenue = Number(upsellItem.discountedUnitPriceSet?.presentmentMoney?.amount) * upsellQuantity
        const upsellProfit = (Number(upsellItem.discountedUnitPriceSet?.presentmentMoney?.amount) - Number(upsellItem.variant.inventoryItem.unitCost?.amount)) * upsellQuantity
        userContext?.trackConversion('add-upsell', {
            conversionData: [{
                transactionId: `${transactionId}_${referenceId}_upsell`,
                amount: upsellRevenue,
                productsCount: upsellQuantity
            }]
        });
        userContext?.trackConversion('total-revenue', {
            conversionData: [{
                transactionId: `${transactionId}_${referenceId}_upsell_revenue`,
                amount: upsellRevenue,
                productsCount: upsellQuantity
            }]
        });

        if (upsellProfit > 0) {
            userContext.trackConversion("profit", {
                conversionData: [{
                    transactionId: `${transactionId}_${referenceId}_profit`,
                    amount: upsellProfit,
                    productsCount: upsellQuantity
                }]
            })
            userContext.trackConversion("upsell-profit", {
                conversionData: [{
                    transactionId: `${transactionId}_${referenceId}_upsell_profit`,
                    amount: upsellProfit,
                    productsCount: upsellQuantity
                }]
            })
        }
        mp.track("Upsell_1", {
            value: upsellRevenue,
            created_at: new Date().toISOString(),
            order_number: transactionId,
            userId: convertId,
            order_id: `${transactionId}_${referenceId}_upsell`
        }
        );
        console.log(mp);
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ offer: { cid: nextOfferid, ...product } }));
})


app.post('/api/purchase-conversion', async (req, res) => {
    try {
        const { referenceId } = req.body;
        const convertSDK = new ConvertSDK({
            sdkKey: '100414426/100416021',
            environment: 'production',
            dataRefreshInterval: 5000
        });
        await convertSDK.onReady();
        const orders = await callGraphQl(queryOrderByReferenceId, {
            query: `checkout_token:${referenceId}`
        })
        const order = orders.data.orders.nodes[0]
        const convertId = order.customAttributes.find(attr => attr.key === "userId")?.value
        const lineItems = orders.data.orders.nodes[0]?.lineItems.nodes || []
        const warrentyItemId = "gid://shopify/ProductVariant/47007385452788"
        const revenue = Number(orders.data.orders.nodes[0]?.totalPriceSet.presentmentMoney.amount || 100)
        console.dir({ referenceId, order }, { depth: null })
        if (!convertId) {
            return res.status(200).json({ error: 'No convertId found' });
        }
        let userContext = convertSDK.createContext(convertId);

        const { totalProfit, totalQuantity } = lineItems.reduce((acc, items) => {
            const costPerItem = Number(items.variant?.inventoryItem?.unitCost?.amount || 0)
            const pricePerItem = Number(items.discountedUnitPriceSet?.presentmentMoney?.amount || 0)
            acc.totalProfit += (pricePerItem - costPerItem) * items.quantity
            acc.totalQuantity += items.quantity
            return acc
        }, {
            totalProfit: 0,
            totalQuantity: 0
        })
        const transactionId = generateRandomString()
        userContext.trackConversion('purchase', {
            conversionData: [{
                transactionId: transactionId,
                amount: revenue,
                productsCount: totalQuantity
            }]
        });
        userContext?.trackConversion('total-revenue', {
            conversionData: [{
                transactionId: `${transactionId}_${referenceId}`,
                amount: revenue,
                productsCount: totalQuantity
            }]
        });
        if (lineItems.find(item => item.variant.id === warrentyItemId)) {
            userContext.trackConversion('add-warrenty')
        }
        if (totalProfit > 0 && totalQuantity > 0) {
            userContext.trackConversion("profit", {
                conversionData: [{
                    transactionId: `${transactionId}_${referenceId}_profit`,
                    amount: totalProfit,
                    productsCount: totalQuantity
                }]
            })
            userContext.trackConversion("initial-profit", {
                conversionData: [{
                    transactionId: `${transactionId}_${referenceId}_initial_profit`,
                    amount: totalProfit,
                    productsCount: totalQuantity
                }]
            })
        }
        res.send(JSON.stringify({ success: true }));
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to track conversion' });
    }
});

app.post('/api/view-receipt-conversion', async (req, res) => {
    try {
        const { referenceId } = req.body;
        const convertSDK = new ConvertSDK({
            sdkKey: '100414426/100416021',
            environment: 'production',
        });
        await convertSDK.onReady();
        const orders = await callGraphQl(queryOrderByReferenceId, {
            query: `checkout_token:${referenceId}`
        })
        const order = orders.data.orders.nodes[0]
        const convertId = order.customAttributes.find(attr => attr.key === "userId")?.value
        if (!convertId) {
            return res.status(200).json({ error: 'No convertId found' });
        }
        let userContext = convertSDK.createContext(convertId);
        userContext.trackConversion('view-receipt')
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to track conversion' });
    }
})

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
