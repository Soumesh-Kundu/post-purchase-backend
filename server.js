import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { callGraphQl, mutationOrderAddVariantString, mutationOrderEditBeginString, mutationOrderEditCommitString, mutationOrderEditSetQuantityString, queryOrderByReferenceId } from "./utils/graphql.js"
import { fetchProductData, firstOfferMapping, generalVariantMapping } from "./utils/fetchProduct.js"
import cors from 'cors';
import { FirstOffer, getOffers, getOffersV2, getSelectedOffer, prudctGraph, softIdToHardIdMap } from './utils/offers.js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import * as ConvertSDKModule from "@convertcom/js-sdk"
import mixpanel from 'mixpanel';
const ConvertSDK = ConvertSDKModule.default?.default || ConvertSDKModule.default || ConvertSDKModule;
dotenv.config();
const mp=mixpanel.init(process.env.MIXPANEL_ID)


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
            if (result.data.orderEditSetQuantity) {
                const userErrors = result.data.orderEditSetQuantity.userErrors
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

const luxeFabricVarientId = 46968634933475
app.post('/api/v2/offer', async (req, res) => {
    const { varientIds } = req.body;
    // console.log(req.headers)
    
    // Detect device type from User-Agent header
    const deviceType = detectDeviceType(req.headers['user-agent']);
    
    // console.log("deviceType", deviceType)
    // let offerId = '2c-v2';
    let offerId = '2c';
    // if (varientIds.includes(luxeFabricVarientId)) {
    //     offerId = '1a';
    // }
    const offers = await getOffersV2();
    const offerProducts = offers;

    res.send(JSON.stringify({ offers: offerProducts, deviceType }));
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
    let offerId = '2c';
    const {referenceId}=req.body;
    const product = FirstOffer;

    const alreadyMappedVariantsPromise = fs.readFile(`./utils/products/${offerId}.json`, 'utf-8');

    const productDataPromise = fetchProductData(`/up/v6/${offerId}`)
    const [alreadyMappedVariants, productData] = await Promise.all([alreadyMappedVariantsPromise, productDataPromise]);

    const variantsMapping =await firstOfferMapping(productData, ["Size", "Color"], JSON.parse(alreadyMappedVariants));

    const products = Object.entries(variantsMapping).map(item => ({
        ...product,
        variants: item[1],
    }))
    console.log({referenceId})
    const orders=await callGraphQl(queryOrderByReferenceId,{
        query:`checkout_token:${referenceId}`
    })
    console.log("orders",orders)
    res.send(JSON.stringify({ offer: products }));
});
app.post('/api/sign-changeset', (req, res) => {
    const { changes, referenceId } = req.body;

    console.log("changes", changes);
    const payload = {
        iss: process.env.SHOPIFY_API_KEY,
        jti: uuidv4(),
        iat: Date.now(),
        sub: referenceId,
        changes: changes,
    };

	   mp.track("Upsell_1",{
                value: '97898797'
            }
        );

    const token = jwt.sign(payload, process.env.SHOPIFY_API_SECRET);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ token }));
})

app.post('/api/next-offer', async (req, res) => {
    const { offerId, accept = false, referenceId,currentVariantId} = req.body;
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

    const productDataPromise = fetchProductData(`/up/v6/${nextOfferid}`);
    const alreadyMappedVariantsPromise = fs.readFile(`./utils/products/${nextOfferid}.json`, 'utf-8');

    const [productData, alreadyMappedVariants] = await Promise.all([productDataPromise, alreadyMappedVariantsPromise]);
    const variants = productData?.[0].variants || {};

    let optionArray = ["Size", "Color"];
    if (nextOfferid === "3b") {
        optionArray.unshift("Fabric");
    }
    else if (nextOfferid === "4b") {
        optionArray = ["Quantity", "Color"];
    }


    const variantsMapping = generalVariantMapping(variants, optionArray, JSON.parse(alreadyMappedVariants));
    
    const product = {
        ...nextOffer,
        variants: variantsMapping
    };

    const orders=await callGraphQl(queryOrderByReferenceId,{
        query:`checkout_token:${referenceId}`
    })
    const order=orders.data.orders.nodes[0]
    const convertId=order.customAttributes.find(attr=>attr.key==="userId")?.value
    const lineItems=order.lineItems.nodes||[]
    const upsellItem=lineItems.find(item=>item.variant.id===`gid://shopify/ProductVariant/${currentVariantId}`)
    console.log({upsellItem,accept,currentVariantId})
    if(accept && currentVariantId && upsellItem && convertId){
         const convertSDK = new ConvertSDK({
           sdkKey: '100414426/100416021',
           environment: 'production',
           dataRefreshInterval: 5000
        });
        await convertSDK.onReady();
        const transactionId=generateRandomString()
        let userContext = convertSDK.createContext(convertId);
        const upsellQuantity=upsellItem.quantity
        const upsellRevenue=Number(upsellItem.discountedUnitPriceSet?.presentmentMoney?.amount)*upsellQuantity
        const upsellProfit=(Number(upsellItem.discountedUnitPriceSet?.presentmentMoney?.amount)-Number(upsellItem.variant.inventoryItem.unitCost?.amount))*upsellQuantity
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

        if (upsellProfit>0){
            userContext.trackConversion("profit",{
                conversionData:[{
                    transactionId:`${transactionId}_${referenceId}_profit`,
                    amount: upsellProfit,
                    productsCount: upsellQuantity
                }]
            })
            userContext.trackConversion("upsell-profit",{
                conversionData:[{
                    transactionId:`${transactionId}_${referenceId}_upsell_profit`,
                    amount: upsellProfit,
                    productsCount: upsellQuantity
                }]
            })
        }
        mp.track("Upsell_1",{
                value: upsellRevenue,
                created_at: new Date().toISOString(),
                order_number: transactionId,
                userId:  convertId,
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
        const orders=await callGraphQl(queryOrderByReferenceId,{
            query:`checkout_token:${referenceId}`
        })
        const order=orders.data.orders.nodes[0]
        const convertId=order.customAttributes.find(attr=>attr.key==="userId")?.value
        const lineItems=orders.data.orders.nodes[0]?.lineItems.nodes||[]
        const warrentyItemId="gid://shopify/ProductVariant/47007385452788"
        const revenue=Number(orders.data.orders.nodes[0]?.totalPriceSet.presentmentMoney.amount||100)
        console.dir({referenceId, order},{depth:null})
        if(!convertId){
            return res.status(200).json({ error: 'No convertId found' });
        }
        let userContext = convertSDK.createContext(convertId);

        const {totalProfit,totalQuantity}=lineItems.reduce((acc,items)=>{
            const costPerItem=Number(items.variant?.inventoryItem?.unitCost?.amount || 0)
            const pricePerItem=Number(items.discountedUnitPriceSet?.presentmentMoney?.amount || 0)
            acc.totalProfit+= (pricePerItem - costPerItem)*items.quantity
            acc.totalQuantity+=items.quantity
            return acc
        },{
            totalProfit:0,
            totalQuantity:0
        })
        const transactionId=generateRandomString()
        userContext.trackConversion('purchase',{
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
        if(lineItems.find(item=>item.variant.id===warrentyItemId)){
            userContext.trackConversion('add-warrenty')
        }
        if(totalProfit>0 && totalQuantity>0){
            userContext.trackConversion("profit",{
                conversionData:[{
                    transactionId:`${transactionId}_${referenceId}_profit`,
                    amount: totalProfit,
                    productsCount: totalQuantity
                }]
            })
            userContext.trackConversion("initial-profit",{
                conversionData:[{
                    transactionId:`${transactionId}_${referenceId}_initial_profit`,
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

app.post('/api/view-receipt-conversion',async (req,res)=>{
    try {
        const { referenceId } = req.body;
        const convertSDK = new ConvertSDK({
           sdkKey: '100414426/100416021',
           environment: 'production',
        });
        await convertSDK.onReady();
        const orders=await callGraphQl(queryOrderByReferenceId,{
            query:`checkout_token:${referenceId}`
        })
        const order=orders.data.orders.nodes[0]
        const convertId=order.customAttributes.find(attr=>attr.key==="userId")?.value
        if(!convertId){
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
