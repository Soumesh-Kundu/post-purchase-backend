import {config} from 'dotenv';
config();
function getRandomDiscount() {
  return Math.floor(Math.random() * (30 - 15 + 1)) + 15;
}
const HOST=process.env.HOST || 'http://localhost:3000';
const OFFERS = [
  {
    id: "1a",
    title: "One time offer",
    productTitle: "Luxe",
    productImageURL:
      "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/01.webp",
    productImageUrls: [`${HOST}/1a/1.webp`,
      `${HOST}/1a/2.webp`,
      `${HOST}/1a/3.webp`,
      `${HOST}/1a/4.webp`,
      `${HOST}/1a/5.webp`
    ],
    productDescription: ["Almost all of our customers eventually buy more Miracle Comforters because their relatives and friends get bed envy!"],
    originalPrice: "949.95",
    discountedPrice: "949.95",
    features: [
      "Perfect temperature for your body all night long",
      "Ultra-luxurious, 300-thread count Miracle Clean & Cool™ fabric",
      "Infused with silver that prevents up to 99.7% of bacteria growth",
      "Hypoallergenic and 100% vegan"
    ],
    size: [
      {
        name: "King/Cali King",
        size: "104 x 90 in"
      },
      {
        name: "Queen",
        size: "90 x 90 in"
      }
    ],
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
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("46968634933475"),
        quantity: 1,
        discount: (() => {
          const d = 30;
          return { value: d, valueType: "percentage", title: `${d}% off` };
        })(),
      },
    ],
  },
  {
    id: "1b",
    title: "One time offer",
    productTitle: "Luxe",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_52f8e304-92d9-4a36-82af-50df8fe31c69.jpg?v=1733592307",
    productDescription: ["No description available"],
    productImageUrls: [`${HOST}/1b/1.webp`,
      `${HOST}/1b/2.webp`,
      `${HOST}/1b/3.webp`,
      `${HOST}/1b/4.webp`,
      `${HOST}/1b/5.webp`
    ],
    originalPrice: "629.95",
    discountedPrice: "629.95",
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
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("446968634867939"),
        quantity: 1,
        discount: (() => {
          const d = 50;
          return { value: d, valueType: "percentage", title: `${d}% off` };
        })(),
      },
    ],
  },
  {
    id: "2d",
    title: "One time offer",
    productTitle: "Extra Sheets set Luxe",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_0a40b01b-5021-48c1-80d1-aa8ab4876d3d.jpg?v=1733592307",
    productImageUrls: ["https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_f44a9605-cd62-464d-b095-d45cdaa0d0d7.jpg?v=1733592307",
      "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/02.webp",
      "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/03.webp",
      "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/04.webp",
      "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/05.webp"
    ],
    productDescription: ["No description available"],
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
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("46968634900707"),
        quantity: 1,
        discount: (() => {
          const d = getRandomDiscount();
          return { value: d, valueType: "percentage", title: `${d}% off` };
        })(),
      },
    ],
  },
  {
    id: "2c",
    title: "One time offer",
    productTitle: "Extra Sheet set",
    productImageUrls: [`${HOST}/2c/1.webp`,
      `${HOST}/2c/2.webp`,
      `${HOST}/2c/3.webp`,
      `${HOST}/2c/4.webp`,
      `${HOST}/2c/5.webp`
    ],
    productDescription: ["No description available"],
    originalPrice: "885.95",
    discountedPrice: "885.95",
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
    size: [
      {
        name: "King/Cali King",
        size: "104 x 90 in"
      },
      {
        name: "Queen",
        size: "90 x 90 in"
      }
    ],
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("47007473041652"),
        quantity: 1,
        discount: (() => {
          const d = getRandomDiscount();
          return { value: d, valueType: "percentage", title: `${d}% off` };
        })(),
      },
    ],
  },
  {
    id: "3b",
    title: "One time offer",
    productTitle: "Extra Pillowcases",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_5127218a-8f6c-498f-b489-09242c0fab0a.jpg?v=1733592307",
    productImageUrls: [`${HOST}/3b/1.webp`,
      `${HOST}/3b/2.webp`,
      `${HOST}/3b/3.webp`,
      `${HOST}/3b/4.webp`,
      `${HOST}/3b/5.webp`
    ],
    productDescription: ["No description available"],
    originalPrice: "2629.95",
    discountedPrice: "2629.95",
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
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("47007485264116"),
        quantity: 1,
        discount: (() => {
          const d = getRandomDiscount();
          return { value: d, valueType: "percentage", title: `${d}% off` };
        })(),
      },
    ],
  },
  {
    id: "6b",
    title: "One time offer",
    productTitle: "Duvet Cover",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main.jpg?v=1733592307",
    productImageUrls: [`${HOST}/1b/1.webp`,
      `${HOST}/1b/2.webp`,
      `${HOST}/1b/3.webp`,
      `${HOST}/1b/4.webp`,
      `${HOST}/1b/5.webp`
    ],
    size: [
      {
        name: "King/Cali King",
        size: "104 x 90 in"
      },
      {
        name: "Queen",
        size: "90 x 90 in"
      }
    ],
    productDescription: ["No description available"],
    originalPrice: "885.95",
    discountedPrice: "885.95",
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
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("47007499747572"),
        quantity: 1,
        discount: (() => {
          const d = getRandomDiscount();
          return { value: d, valueType: "percentage", title: `${d}% off` };
        })(),
      },
    ],
  },
  {
    id: "5b",
    title: "One time offer",
    productTitle: "3 Zone Comforter",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_589fc064-24a2-4236-9eaf-13b2bd35d21d.jpg?v=1733592307",
    productImageUrls: [`${HOST}/5b/1.webp`,
      `${HOST}/5b/2.webp`,
      `${HOST}/5b/3.webp`,
      `${HOST}/5b/4.webp`,
      `${HOST}/5b/5.webp`
    ],
    productDescription: ["This PREMIUM snowboard is so SUPERDUPER awesome!"],
    originalPrice: "699.95",
    discountedPrice: "699.95",
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
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("47007477661940"),
        quantity: 1,
        discount: (() => {
          const d = getRandomDiscount();
          return { value: d, valueType: "percentage", title: `${d}% off` };
        })(),
      },
    ],
  },
  {
    id: "8b",
    title: "One time offer",
    productTitle: "Mattress Cover",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/snowboard_sky.png?v=1733592308",
    productImageUrls: [`${HOST}/8b/1.webp`,
      `${HOST}/8b/2.webp`,
      `${HOST}/8b/3.webp`,
      `${HOST}/8b/4.webp`,
      `${HOST}/8b/5.webp`
    ],
    productDescription: ["No description available"],
    originalPrice: "785.95",
    discountedPrice: "785.95",
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
    size: [
      {
        name: "King/Cali King",
        size: "104 x 90 in"
      },
      {
        name: "Queen",
        size: "90 x 90 in"
      }
    ],
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("47007499944180"),
        quantity: 1,
        discount: (() => {
          const d = getRandomDiscount();
          return { value: d, valueType: "percentage", title: `${d}% off` };
        })(),
      },
    ],
  },
  {
    id: "7b",
    title: "One time offer",
    productTitle: "Kitchen Towels",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/snowboard_wax.png?v=1733592308",
    productImageUrls: [`${HOST}/1b/1.webp`,
      `${HOST}/1b/2.webp`,
      `${HOST}/1b/3.webp`,
      `${HOST}/1b/4.webp`,
      `${HOST}/1b/5.webp`
    ],
    productDescription: ["No description available"],
    originalPrice: "24.95",
    discountedPrice: "24.95",
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
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("46968634409187"),
        quantity: 1,
        discount: (() => {
          const d = getRandomDiscount();
          return { value: d, valueType: "percentage", title: `${d}% off` };
        })(),
      },
    ],
  },
  {
    id: "2c-v2",
    title: "One time offer",
    productTitle: "Extra Sheets set",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_c8ff0b5d-c712-429a-be00-b29bd55cbc9d.jpg?v=1733592307",
    productImageUrls: [`${HOST}/2d/1.webp`,
      `${HOST}/2d/2.webp`,
      `${HOST}/2d/3.webp`,
      `${HOST}/2d/4.webp`,
      `${HOST}/2d/5.webp`
    ],
    productDescription: ["No description available"],
    originalPrice: "749.95",
    discountedPrice: "749.95",
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
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("46968634573027"),
        quantity: 1,
      },
    ],
  },
  {
    id: "4b",
    title: "One time offer",
    productTitle: "Limited Time Sale - Laundry Detergent Sheets",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_c8ff0b5d-c712-429a-be00-b29bd55cbc9d.jpg?v=1733592307",
    productImageUrls: [`${HOST}/4b/1.jpg`,
      `${HOST}/4b/2.jpg`,
      `${HOST}/4b/3.jpg`,
      `${HOST}/4b/4.jpg`,
      `${HOST}/4b/5.jpg`
    ],
    productDescription: ["No description available"],
    originalPrice: "749.95",
    discountedPrice: "749.95",
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
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("47007349801204"),
        quantity: 1,
      },
    ],
  },
  {
    id: "9b",
    title: "One time offer",
    productTitle: "Cotton Gauze Robe",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_c8ff0b5d-c712-429a-be00-b29bd55cbc9d.jpg?v=1733592307",
    productImageUrls: [`${HOST}/9b/1.webp`,
      `${HOST}/9b/2.webp`,
      `${HOST}/9b/3.webp`,
      `${HOST}/9b/4.webp`,
      `${HOST}/9b/5.webp`
    ],
    productDescription: ["No description available"],
    originalPrice: "749.95",
    discountedPrice: "749.95",
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
    priceOptions: [
      {
        name: "King/Cali King USD $129.00",
        price: 129
      }, {
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("47007424446708"),
        quantity: 1,
      },
    ],
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
  "2c":"gid://shopify/Product/9160101495028",
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
