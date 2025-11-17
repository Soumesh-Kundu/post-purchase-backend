import { config } from 'dotenv';
config();
function getRandomDiscount() {
  return Math.floor(Math.random() * (30 - 15 + 1)) + 15;
}
const HOST = process.env.HOST || 'http://localhost:3000';


export const FirstOffer = {
  id: "2c",
  title: "Get some extra sheets",
  productTitle: "Luxe",
  productDescription: ["Thousands of our customers come back for more once they feel the life-changing differences in their sleep. Enjoy the silver-infused benefits of Miracle Made® Sheets throughout every bedroom in your home, or even keep an extra set on hand since you have this huge discount opportunity!"],
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
    title: "Extra Pillowcases",
    productTitle: "Luxe",
    productDescription: ['Our premium pillowcases are infused with silver to help prevent up to 99.7% of bacterial growth, keeping your bedding cleaner for longer. Say goodbye to bacteria build-up and rest easy on pillowcases that stay fresh and inviting—night after night'],
    features: [
      "3x less laundry",
      "Designed for a Cleaner Sleep",
      "Luxuriously soft sleep, every. single. night."
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
    title: "Get our Comforter",
    productTitle: "Get our Comforter",
    productDescription: ['Designed to keep you at the perfect temperature all night long. To top it off, the silver-infused fibers prevent up to 99.7% of bacteria growth, helping you sleep in clean comfort.'],
    features: [
      'Perfect temperature for your body all night long',
      'Ultra-luxurious, 300-thread count Miracle Clean & Cool™ fabric',
      'Infused with silver that prevents up to 99.7% of bacteria growth',
      'Hypoallergenic and 100% vegan'
    ],
    sizes: [
      {
      label: 'Queen',
      value: 'queen'
      }, 
      {
      label: 'King/Cali King',
      value: 'king/cali_king'
      } 
  ],
    colors: [
      { label: 'Stone', value: 'stone' },
      { label: 'White', value: 'white' }
    ]
  },
  {
    id: "6b",
    title: "Miracle Made® Duvet Cover",
    productTitle: "Miracle Made® Duvet Cover",
    productDescription: ['Complete your collection for the ultimate sleep experience. Made with silver-infused Miracle Clean & Cool™ to keep you cool and prevent up to 99.7% of bacteria growth.'],
    features: [
    ],
    sizes: [
      {
        label: 'Full/Queen',
        value: 'full/queen'
      },
      {
        label: 'King/Cali King',
        value: 'king/cali_king'
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
    title: "Mattress Protector",
    productTitle: "Mattress Protector",
    productDescription: ['Sleep cool and keep your mattress cleaner for longer with our silver-infused and leak-proof mattress protector that prevents up to 99.7% of bacteria growth.'],
    features: [
      'Cooling comfort',
      'Liquid-proof to protect from spills and stains',
      'Prevents up to 99.7% bacteria-growth',
    ],
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
    title: "Miracle Detergent",
    productTitle: "Miracle Detergent",
    productDescription: ['Tired of bulky detergent bottles? With our Buy 1, Get 1 Free deal, enjoy less waste, cleaner laundry, and more shelf space—all while keeping your skin safe from harsh chemicals.'],
    features: [
      'Removes even the toughest stains',
      'No toxic ingredients',
      'Crafted for sensitive skin',
      'Less space, less waste',
      'No more messy spills',
    ],
    sizes: [
      {
        label:"64 Loads",
        value: "64_loads"
      },
      {
        label: "128 Loads",
        value: "128_loads"
      },
      {
        label: "192 Loads",
        value: "192_loads"
      },
    ],
    colors:[{
      label: 'Default', value: 'default'
    }]
  },
  {
    id: "9b",
    title: "Miracle Gauze Robe",
    productTitle: "Miracle Gauze Robe",
    productDescription: [`Slip into something softer. Our new breathable gauze robe is crafted from 4-ply cotton that feels light yet cozy—and only gets softer with every wash. Silver-treated to prevent up to 99.7% of bacteria growth, it stays fresher between wears so you can relax without the laundry stress. Designed with thoughtful details like Japanese sashiko-inspired stitching, easy patch pockets, and a mid-calf fit that flatters and flows. It's not just a robe—it’s your new evening ritual.`],
    features: [
      'Lightweight, breathable 4-ply cotton gauze',
      'Silver-treated to prevent up to 99.7% of bacteria growth',
      'Relaxed mid-calf fit with Japanese sashiko-inspired stitching',
      'Practical patch pockets and adjustable waist tie',
      'Easy to wash, hard to wear out—saves you time, effort, and money',
    ],
    sizes: [
      {
        label:"Small",
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
    colors:[
      { label: 'White', value: 'white' },
      { label: 'Oatmeal', value: 'oatmeal' }
    ]
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


export function getSelectedOffer(offerId) {
  return OFFERS.find((offer) => offer.id === offerId);
}

export function getSizes() {
  return SIZES;
}
