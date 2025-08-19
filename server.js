const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const { getSelectedOffer, getOffers, prudctGraph } = require('./utils/offers');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json());
app.use(cors());

// Basic route

app.get('/health', (req, res) => {
    res.send('OK');
});
const luxeFabricVarientId=46968634933475
app.post('/api/offer', (req, res) => {
	const { varientIds } = req.body;
	let offerId = '2c-v2';
	if (varientIds.includes(luxeFabricVarientId)) {
		offerId = '1a';
	}
	const offers = getOffers();
	const offerProduct = offers.find((offer) => offer.id === offerId);

	res.send(JSON.stringify({ offer: offerProduct }));
});
app.post('/api/sign-changeset', (req, res) => {
    const { changes , referenceId  } = req.body;
    
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

    const {offerId,accept=false}= req.body;
    const nextOfferLinks= prudctGraph[offerId];
    const link=nextOfferLinks.length>1?+accept:0;
    const nextOfferid=nextOfferLinks[link];
    if(!nextOfferid){
        return res.send(JSON.stringify({offer:null}))
    }
    const offers=getOffers()
    const nextOffer=offers.find((offer)=>offer.id===nextOfferid);

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ offer: nextOffer }));
})


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});