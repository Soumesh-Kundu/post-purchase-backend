import { config } from 'dotenv';
import { readFile, writeFile } from 'fs/promises';
import { productOptionMapping, fetchShopifyProducts, productIds } from './getShopifyProducts.js';
config();
function getRandomDiscount() {
  return Math.floor(Math.random() * (30 - 15 + 1)) + 15;
}
const HOST = process.env.HOST || 'http://localhost:3000';


export const FirstOffer = {
  id: "2c",
  preTitle: 'WAIT! WE HAVE SOMETHING SPECIAL FOR YOU!',
  title: [{
    type: 'normal',
    text: "Get some extra sheets for"
  }, {
    type: 'success',
    text: "up to 75% OFF!"
  }],
  subTitle: [{
    type: 'normal',
    text: "Note: This is a one-time-only offer that you will never see again."
  }],
  productTitle: "Luxe",
  productDescription: ["Thousands of our customers come back for more once they feel the life-changing differences in their sleep. Enjoy the silver-infused benefits of Miracle Made® Sheets throughout every bedroom in your home, or even keep an extra set on hand since you have this huge discount opportunity!"],
  price: 112,
  compareAtPrice: 112,
  discount: 50,
  optionsOrder: ['sizes', 'colors'],
  sizes: [
    { label: 'Twin', value: 'twin' },
    { label: 'Twin XL', value: 'twin_xl' },
    { label: 'Full', value: 'full' },
    { label: 'Queen', value: 'queen' },
    { label: 'King', value: 'king' },
    { label: 'Split King', value: 'split_king' },
    { label: 'Cali King', value: 'cali_king' }
  ],
  colors: [
    { label: 'Rosewood', value: 'rosewood' },
    { label: 'Stone', value: 'stone' },
    { label: 'White', value: 'white' },
    { label: 'Sky Blue', value: 'sky_blue' },
    { label: 'Silver Grey', value: 'silver_grey' },
    { label: 'Charcoal', value: 'charcoal' },
    { label: 'Navy Blue', value: 'navy_blue' },
    { label: 'Sand', value: 'sand' },
    { label: 'Ivory', value: 'ivory' },
    { label: 'Terracotta', value: 'terracotta' },
    { label: 'Sage', value: 'sage' },
    { label: 'Slate Blue', value: 'slate_blue' }
  ]
}


const OFFERS = [
  {
    id: "3b",
    preTitle: null,
    title: [{
      type: 'normal',
      text: "Your order isn't complete without pillowcases!"
    }],
    subTitle: [{
      type: 'normal',
      text: "As a special Thank You for joining the Miracle family we want to offer you our premium Pillowcases for"
    },
    {
      type: "success",
      text: "up to 28% OFF!"
    }
    ],
    productTitle: "Luxe",
    productDescription: ['Our premium pillowcases are infused with silver to help prevent up to 99.7% of bacterial growth, keeping your bedding cleaner for longer. Say goodbye to bacteria build-up and rest easy on pillowcases that stay fresh and inviting—night after night'],
    features: [
      "3x less laundry",
      "Designed for a Cleaner Sleep",
      "Luxuriously soft sleep, every. single. night."
    ],
    price: 44,
    compareAtPrice: 61,
    discount: 27,
    optionsOrder: ['fabric', 'sizes', 'colors'],
    fabric: [
      { label: 'Set of 2 (Luxe)', value: 'luxe' },
      { label: 'Set of 2 (Extra Luxe)', value: 'extra_luxe' }
    ],
    sizes: [
      {
        label: 'Standard',
        value: 'standard'
      },
      {
        label: "King",
        value: "king"
      }
    ],
    colors: [
      { label: 'Stone', value: 'stone' },
      { label: 'Rosewood', value: 'rosewood' },
      { label: 'White', value: 'white' },
      { label: 'Sky Blue', value: 'sky_blue' },
      { label: 'Navy Blue', value: 'navy_blue' },
      { label: 'Sand', value: 'sand' },
      { label: 'Ivory', value: 'ivory' },
      { label: 'Terracotta', value: 'terracotta' },
      { label: 'Charcoal', value: 'charcoal' },
      { label: 'Sage', value: 'sage' },
      { label: 'Slate Blue', value: 'slate_blue' },
      { label: 'Silver Grey', value: 'silver_grey' }
    ]
  },
  {
    id: "5b",
    preTitle: "Your Antimicrobial Bedroom Isn't Complete Without a Comforter!",
    title: [{
      type: 'normal',
      text: "Get our newest silver infused comforter"
    }, {
      type: 'success',
      text: "up to 54% OFF!"
    }],
    subTitle: [{
      type: 'normal',
      text: "We are offering our premium comforter to new customers only!"
    }],
    productTitle: "Get our Comforter",
    productDescription: ['Designed to keep you at the perfect temperature all night long. To top it off, the silver-infused fibers prevent up to 99.7% of bacteria growth, helping you sleep in clean comfort.'],
    features: [
      'Perfect temperature for your body all night long',
      'Ultra-luxurious, 300-thread count Miracle Clean & Cool™ fabric',
      'Infused with silver that prevents up to 99.7% of bacteria growth',
      'Hypoallergenic and 100% vegan'
    ],
    price: 132,
    compareAtPrice: 132,
    discount: 0,
    optionsOrder: ['colors', 'sizes'],
    sizes: [
      {
        label: 'Queen',
        value: 'queen'
      },
      {
        label: 'King/Cali King',
        value: 'cali_king'
      }
    ],
    colors: [
      { label: 'Stone', value: 'stone' },
      { label: 'White', value: 'white' }
    ]
  },
  {
    id: "6b",
    preTitle: "Wait! COMPLETE YOUR ULTIMATE SLEEP SET",
    title: [{
      type: "normal",
      text: "Add a Miracle Made® Duvet Cover for"
    }, {
      type: "success",
      text: "up to 47% OFF!"
    }],
    subTitle: [{
      type: "normal",
      text: "Note: This is a one-time-only offer that you will never see again."
    }],
    productTitle: "Miracle Made® Duvet Cover",
    productDescription: ['Complete your collection for the ultimate sleep experience. Made with silver-infused Miracle Clean & Cool™ to keep you cool and prevent up to 99.7% of bacteria growth.'],
    features: [
    ],
    price: 105,
    compareAtPrice: 200,
    discount: 47,
    optionsOrder: ['sizes', 'colors'],
    sizes: [
      {
        label: 'Queen',
        value: 'queen'
      },
      {
        label: 'Cali King',
        value: 'cali_king',
      }
    ],
    colors: [
      { label: 'Stone', value: 'stone' },
      { label: 'White', value: 'white' },
      { label: 'Sky Blue', value: 'sky_blue' }
    ]
  },
  {
    id: "8b",
    preTitle: "WAIT! COMPLETE YOUR ULTIMATE SLEEP SET",
    title: [{
      type: "normal",
      text: "Add a self-cleaning & self-cooling Mattress Protector for"
    }, {
      type: "success",
      text: "up to 50% OFF!"
    }],
    subTitle: [{
      type: "normal",
      text: "Note: This is a one-time-only offer that you will never see again."
    }],
    productTitle: "Mattress Protector",
    productDescription: ['Sleep cool and keep your mattress cleaner for longer with our silver-infused and leak-proof mattress protector that prevents up to 99.7% of bacteria growth.'],
    features: [
      'Cooling comfort',
      'Liquid-proof to protect from spills and stains',
      'Prevents up to 99.7% bacteria-growth',
    ],
    price: 179,
    compareAtPrice: 104,
    discount: 41,
    optionsOrder: ['sizes', 'colors'],
    sizes: [
      { label: 'Twin', value: 'twin' },
      { label: 'Full', value: 'full' },
      { label: 'Queen', value: 'queen' },
      { label: 'King', value: 'king' },
      { label: 'Cali King', value: 'cali_king' }
    ],
    colors: [
      { label: 'White', value: 'white' },
    ]
  },
  {
    id: "4b",
    preTitle: "Before you go, give Miracle Made Detergent Sheets a try!",
    title: [{
      type: "Success",
      text: "Buy 1 Box, Get 1 FREE"
    }, {
      type: "normal",
      text: "—Our Best Deal Yet!"
    }],
    subTitle: [{
      type: "normal",
      text: "Say goodbye to bulky detergent bottles and get twice the clean with our BOGO offer!"
    }],
    productTitle: "Miracle Detergent",
    productDescription: ['Tired of bulky detergent bottles? With our Buy 1, Get 1 Free deal, enjoy less waste, cleaner laundry, and more shelf space—all while keeping your skin safe from harsh chemicals.'],
    features: [
      'Removes even the toughest stains',
      'No toxic ingredients',
      'Crafted for sensitive skin',
      'Less space, less waste',
      'No more messy spills',
    ],
    optionsOrder: ['sizes', 'colors'],
    sizes: [
      {
        label: "Buy 1 Get 1 FREE (64 Loads) - $29*",
        value: "1"
      },
      {
        label: "Buy 2 Get 2 FREE (128 Loads) - $58*",
        value: "2"
      },
      {
        label: "Buy 3 Get 3 FREE (192 Loads) - $87*",
        value: "3"
      },
    ],
    colors: [{
      label: 'Default', value: 'default'
    }]
  },
  {
    id: "9b",
    preTitle: "Just Dropped",
    title: [{
      type: "normal",
      text: "Our New Robe Is Made to Breathe (and Feel Amazing)"
    }],
    subTitle: [{
      type: "normal",
      text: "Wrap yourself in clean comfort—lighter, fresher, better."
    }],
    productTitle: "Miracle Gauze Robe",
    productDescription: [`Slip into something softer. Our new breathable gauze robe is crafted from 4-ply cotton that feels light yet cozy—and only gets softer with every wash. Silver-treated to prevent up to 99.7% of bacteria growth, it stays fresher between wears so you can relax without the laundry stress. Designed with thoughtful details like Japanese sashiko-inspired stitching, easy patch pockets, and a mid-calf fit that flatters and flows. It's not just a robe—it’s your new evening ritual.`],
    features: [
      'Lightweight, breathable 4-ply cotton gauze',
      'Silver-treated to prevent up to 99.7% of bacteria growth',
      'Relaxed mid-calf fit with Japanese sashiko-inspired stitching',
      'Practical patch pockets and adjustable waist tie',
      'Easy to wash, hard to wear out—saves you time, effort, and money',
    ],
    price: 89,
    compareAtPrice: 119,
    discount: 24,
    optionsOrder: ['colors', 'sizes'],
    sizes: [
      {
        label: "Small",
        value: "small"
      },
      {
        label: "Medium",
        value: "medium"
      },
      {
        label: "Large",
        value: "large"
      }
    ],
    colors: [
      { label: 'White', value: 'white' },
      { label: 'Oatmeal', value: 'oatmeal' }
    ]
  },
]


const OFFERS_V2 = [
  {
    id: productIds[0],
    title: "One time offer",
    tag: "3-zone-comforter",
    productTitle: "3-Temperature-Zone Comforter",
    default: {
      option1: "full_queen",
      option2: "white"
    },
    productImageURL:
      "https://cdn.shopify.com/s/files/1/1647/4405/files/MIR_3-ZoneComforter-PDP-product_white1.webp?v=1737147697",
    productImageUrls: [`https://cdn.shopify.com/s/files/1/1647/4405/files/MIR_3-ZoneComforter-PDP-product_white1.webp?v=1737147697`,
      `${HOST}/1a/2.webp`,
      `${HOST}/1a/3.webp`,
      `${HOST}/1a/4.webp`,
      `${HOST}/1a/5.webp`
    ],
    productDescription: ["Warm where you want it. Breathable where you don't. Designed to prevent overheating without sacrificing that soft, cozy feel."],
    originalPrice: "949.95",
    discountedPrice: "949.95",
    features: [
      "Perfect temperature for your body all night long",
      "Ultra-luxurious, 300-thread count Miracle Clean & Cool™ fabric",
      "Infused with silver that prevents up to 99.7% of bacteria growth",
      "Hypoallergenic and 100% vegan"
    ],
  },
  {
    id: productIds[1],
    title: "One time offer",
    tag: "remycloud-pillow",
    productTitle: "RemyCloud Adjustable Cooling Pillow",
    default: {
      option1: "standard",
      option2: "set_of_2"
    },
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_52f8e304-92d9-4a36-82af-50df8fe31c69.jpg?v=1733592307",
    productDescription: [`Cool-to-the-touch, adjustable support for that "just right" feel—whether you sleep on your back, side, or stomach.`],
    productImageUrls: [`${HOST}/v2/2.png`,
    `${HOST}/1b/2.webp`,
    `${HOST}/1b/3.webp`,
    `${HOST}/1b/4.webp`,
    `${HOST}/1b/5.webp`
    ],
    variants: JSON.parse(await readFile('./utils/multiple-products-staging/pillow.json', 'utf-8')),
    originalPrice: "629.95",
    discountedPrice: "629.95",
  },
  {
    id: productIds[2],
    title: "One time offer",
    productTitle: "Luxe Duvet Cover",
    default: {
      option1: "full_queen",
      option2: "sky_blue"
    },
    tag: "duvet-cover",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_0a40b01b-5021-48c1-80d1-aa8ab4876d3d.jpg?v=1733592307",
    productImageUrls: [`${HOST}/v2/3.png`,
      "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/02.webp",
      "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/03.webp",
      "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/04.webp",
      "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/05.webp"
    ],
    productDescription: ["Finish the look with the same cool, stay-fresh fabric—so your whole bed works together."],
    originalPrice: "600.00",
    discountedPrice: "600.00",
    colors: [
      {
        name: "White",
        img: "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/white.svg?v=1751651865",
      },
      {
        name: "Stone",
        img: "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/stone.svg?v=1751651866"
      }
    ],
  },
  {
    id: productIds[3],
    title: "One time offer",
    productTitle: "Detergent Sheets",
    tag: "detergent",
    default:{
      option1:"b1g1"
    },
    productImageUrls: [`${HOST}/v2/4.png`,
    `${HOST}/2d/2.webp`,
    `${HOST}/2d/3.webp`,
    `${HOST}/2d/4.webp`,
    `${HOST}/2d/5.webp`
    ],
    productDescription: ["Pre-measured detergent sheets with cleaner ingredients and no bulky plastic—so caring for your sheets stays simple."],
    originalPrice: "885.95",
    discountedPrice: "885.95",
  },
]


export const prudctGraph = {
  "1a": ["1b", "2d"],
  "1b": ["2c", "2d"],
  "2c-v2": ["3b"],
  "2d": ["3b"],
  "2c": ["3b"],
  "3b": ["5b"],
  "5b": ["6b"],
  "6b": ["8b"],
  "8b": ["4b"],
  "4b": ["9b"],
  "9b": [null],
}

export const softIdToHardIdMap = {
  "2c": "gid://shopify/Product/9160101495028",
  "3b": "gid://shopify/Product/9160102707444",
  "5b": "gid://shopify/Product/9160101953780",
  "6b": "gid://shopify/Product/9160106475764",
  "8b": "gid://shopify/Product/9160106639604",
  "4b": "gid://shopify/Product/9160093532404",
  "9b": "gid://shopify/Product/9160100020468"
}

export function getOffers() {
  return OFFERS;
}

export async function getOffersV2() {
  const products = OFFERS_V2.map(async (offer) => {
    const optionOrder = productOptionMapping[offer.id];
    const productData = await fetchShopifyProducts(offer.id, optionOrder);
    return {
      ...offer,
      optionOrder: optionOrder.map((option) => option.toLowerCase()),
      ...productData
    }

  });
  return Promise.all(products);

}

export function getSelectedOffer(offerId) {
  return OFFERS.find((offer) => offer.id === offerId);
}

export function getSizes() {
  return SIZES;
}

// console.dir(await getOffersV2(),{ depth: null });