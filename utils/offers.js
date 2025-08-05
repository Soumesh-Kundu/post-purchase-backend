function getRandomDiscount() {
  return Math.floor(Math.random() * (30 - 15 + 1)) + 15;
}
const OFFERS = [
  {
    id: "1a",
    title: "One time offer",
    productTitle: "Luxe",
    productImageURL:
      "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/01.webp",
    productImageUrls:["https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/01.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/02.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/03.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/04.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/05.webp"
      ],
    productDescription: ["Almost all of our customers eventually buy more Miracle Comforters because their relatives and friends get bed envy!"],
    originalPrice: "949.95",
    discountedPrice: "949.95",
    features:[
      "Perfect temperature for your body all night long",
      "Ultra-luxurious, 300-thread count Miracle Clean & Cool™ fabric",
      "Infused with silver that prevents up to 99.7% of bacteria growth",
      "Hypoallergenic and 100% vegan"
    ],
    size:[
      {
        name:"King/Cali King",
        size:"104 x 90 in"
      },
      {
        name: "Queen",
        size: "90 x 90 in"
      }
    ],
    colors:[
      {
        name:"White",
        img:"https://cdn.shopify.com/s/files/1/0628/4574/7315/files/white.svg?v=1751651865",
      },
      {
        name:"Stone",
        img:"https://cdn.shopify.com/s/files/1/0628/4574/7315/files/stone.svg?v=1751651866"
      }
    ],
    priceOptions:[
      {
        name:"King/Cali King USD $129.00",
        price:129
      },{
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
     productImageUrls:["https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_f44a9605-cd62-464d-b095-d45cdaa0d0d7.jpg?v=1733592307",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/02.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/03.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/04.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/05.webp"
      ],
    originalPrice: "629.95",
    discountedPrice: "629.95",
    colors:[
      {
        name:"White",
        color:"#FFFFFF",
      },
      {
        name:"Stone",
        color:"#6e707f"
      }
    ],
    priceOptions:[
      {
        name:"King/Cali King USD $129.00",
        price:129
      },{
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
       productImageUrls:["https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_f44a9605-cd62-464d-b095-d45cdaa0d0d7.jpg?v=1733592307",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/02.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/03.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/04.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/05.webp"
      ],
    productDescription: ["No description available"],
    originalPrice: "600.00",
    discountedPrice: "600.00",
    colors:[
      {
        name:"White",
        color:"#FFFFFF",
      },
      {
        name:"Stone",
        color:"#6e707f"
      }
    ],
    priceOptions:[
      {
        name:"King/Cali King USD $129.00",
        price:129
      },{
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
    productImageUrls:["https://try.miraclebrand.co/up/comforter/images/sliders/2c/charcoal/01.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/2c/charcoal/02.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/2c/charcoal/03.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/2c/charcoal/04.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/2c/charcoal/05.webp",
      ],
    productDescription: ["No description available"],
    originalPrice: "885.95",
    discountedPrice: "885.95",
    colors:[
      {
        name:"White",
        color:"#FFFFFF",
      },
      {
        name:"Stone",
        color:"#6e707f"
      }
    ],
    priceOptions:[
      {
        name:"King/Cali King USD $129.00",
        price:129
      },{
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("446968634802403"),
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
    productImageUrls:["https://try.miraclebrand.co/up/comforter/images/sliders/3b/stone/01.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/3b/stone/02.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/3b/stone/03.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/3b/stone/04.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/3b/stone/05.webp",
      ],
    productDescription: ["No description available"],
    originalPrice: "2629.95",
    discountedPrice: "2629.95",
    colors:[
      {
        name:"White",
        color:"#FFFFFF",
      },
      {
        name:"Stone",
        color:"#6e707f"
      }
    ],
    priceOptions:[
      {
        name:"King/Cali King USD $129.00",
        price:129
      },{
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("46968634573027"),
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
    productImageUrls:["https://try.miraclebrand.co/up/comforter/images/sliders/6b/stone/queen.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/6b/stone/02.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/6b/stone/03.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/6b/stone/04.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/6b/stone/05.webp"
      ],
    productDescription: ["No description available"],
    originalPrice: "885.95",
    discountedPrice: "885.95",
    colors:[
      {
        name:"White",
        color:"#FFFFFF",
      },
      {
        name:"Stone",
        color:"#6e707f"
      }
    ],
    priceOptions:[
      {
        name:"King/Cali King USD $129.00",
        price:129
      },{
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("46968634310883"),
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
    productTitle: "Comforter",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_589fc064-24a2-4236-9eaf-13b2bd35d21d.jpg?v=1733592307",
    productImageUrls:["https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/01.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/02.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/03.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/04.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/05.webp"
      ],
    productDescription: ["This PREMIUM snowboard is so SUPERDUPER awesome!"],
    originalPrice: "699.95",
    discountedPrice: "699.95",
    
    colors:[
      {
        name:"White",
        color:"#FFFFFF",
      },
      {
        name:"Stone",
        color:"#6e707f"
      }
    ],
    priceOptions:[
      {
        name:"King/Cali King USD $129.00",
        price:129
      },{
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("46968634343651"),
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
    productTitle: "Mattress Protector",
    productImageURL:
      "https://cdn.shopify.com/s/files/1/0628/4574/7315/files/snowboard_sky.png?v=1733592308",
    productImageUrls:["https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_f44a9605-cd62-464d-b095-d45cdaa0d0d7.jpg?v=1733592307",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/02.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/03.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/04.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/05.webp"
      ],
    productDescription: ["No description available"],
    originalPrice: "785.95",
    discountedPrice: "785.95",
    colors:[
      {
        name:"White",
        color:"#FFFFFF",
      },
      {
        name:"Stone",
        color:"#6e707f"
      }
    ],
    priceOptions:[
      {
        name:"King/Cali King USD $129.00",
        price:129
      },{
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("46968634376419"),
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
    productImageUrls:["https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_f44a9605-cd62-464d-b095-d45cdaa0d0d7.jpg?v=1733592307",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/02.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/03.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/04.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/05.webp"
      ],
    productDescription: ["No description available"],
    originalPrice: "24.95",
    discountedPrice: "24.95",
    colors:[
      {
        name:"White",
        color:"#FFFFFF",
      },
      {
        name:"Stone",
        color:"#6e707f"
      }
    ],
    priceOptions:[
      {
        name:"King/Cali King USD $129.00",
        price:129
      },{
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
    productImageUrls:["https://cdn.shopify.com/s/files/1/0628/4574/7315/files/Main_f44a9605-cd62-464d-b095-d45cdaa0d0d7.jpg?v=1733592307",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/02.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/03.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/04.webp",
        "https://try.miraclebrand.co/up/comforter/images/sliders/5b/white/05.webp"
      ],
    productDescription: ["No description available"],
    originalPrice: "749.95",
    discountedPrice: "749.95",
    colors:[
      {
        name:"White",
        color:"#FFFFFF",
      },
      {
        name:"Stone",
        color:"#6e707f"
      }
    ],
    priceOptions:[
      {
        name:"King/Cali King USD $129.00",
        price:129
      },{
        name: "Queen USD $119.00",
        price: 119
      }
    ],
    changes: [
      {
        type: "add_variant",
        variantID: Number("46968634441955"),
        quantity: 1,
        discount: (() => {
          const d = getRandomDiscount();
          return { value: d, valueType: "percentage", title: `${d}% off` };
        })(),
      },
    ],
  },]
  

export const prudctGraph={
    "1a": ["1b","2d"],
    "1b": ["2c","2d"],
    "2c-v2":["3b"],
    "2d": ["3b"],
    "2c":["3b"],
    "3b": ["6b"],
    "6b": ["5b"],
    "5b": ["8b"],
    "8b": ["7b"],
    "7b": [null],
}

export function getOffers() {
  return OFFERS;
}


export function getSelectedOffer(offerId) {
  return OFFERS.find((offer) => offer.id === offerId);
}
