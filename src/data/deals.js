// Central WhatsApp number used across the whole app.
export const WHATSAPP_NUMBER = "16477408124";

/*
 * CATEGORIES — the single source of truth for the whole app.
 * ---------------------------------------------------------
 * Each category is one tab. Developer can configure everything here:
 *
 *   id        unique key
 *   name      tab label
 *   active    show/hide this whole tab           (CHANGE 3)
 *   poster    top banner image URL ("" = none)   (CHANGE 1)
 *   voiceNote audio URL for the voice player ("" = none)  (CHANGE 2)
 *   posters   extra poster image URLs, shown as a scroll strip (CHANGE 4)
 *   deals     the plan cards; each deal has its own `active` flag
 *
 *   deal = { name, details, price, tag, badge, active }
 */
export const categories = [
  {
    id: "internet",
    name: "Internet Deals",
    active: true,
    poster: "/posters/internet.svg",
    // Short placeholder audio (CORS-friendly). Swap for a real recording later.
    voiceNote: "https://www.w3schools.com/html/horse.mp3",
    posters: ["/posters/strip-cashback.svg", "/posters/strip-600.svg"],
    deals: [
      {
        name: "Starter Internet",
        details: "25 Mbps",
        price: "$45/mo",
        tag: "Best for 1-2 users",
        badge: "Popular",
        active: true,
      },
      {
        name: "Home Internet Plus",
        details: "150 Mbps",
        price: "$60/mo",
        tag: "Best for families",
        badge: "",
        active: true,
      },
      {
        name: "Gigabit Fibre",
        details: "1 Gbps",
        price: "$85/mo",
        tag: "Unlimited data",
        badge: "Best Value",
        active: true,
      },
    ],
  },
  {
    id: "rental",
    name: "Rental",
    active: true,
    poster: "/posters/rental.svg",
    voiceNote: "",
    posters: [],
    deals: [
      {
        name: "1 Bed Apartment",
        details: "Downtown Toronto",
        price: "$1,800/mo",
        tag: "Available now",
        badge: "New",
        active: true,
      },
      {
        name: "2 Bed Apartment",
        details: "North York",
        price: "$2,200/mo",
        tag: "Pet friendly",
        badge: "",
        active: true,
      },
      {
        name: "3 Bed House",
        details: "Mississauga",
        price: "$2,800/mo",
        tag: "Garage included",
        badge: "",
        active: true,
      },
    ],
  },
  {
    id: "homePhone",
    name: "Home Phone",
    active: true,
    poster: "/posters/homephone.svg",
    voiceNote: "",
    posters: [],
    deals: [
      {
        name: "Basic Home Phone",
        details: "Unlimited local calls",
        price: "$15/mo",
        tag: "No contract",
        badge: "",
        active: true,
      },
      {
        name: "Home Phone Plus",
        details: "Unlimited Canada-wide",
        price: "$25/mo",
        tag: "+ Voicemail",
        badge: "Popular",
        active: true,
      },
      {
        name: "International Bundle",
        details: "60+ countries",
        price: "$35/mo",
        tag: "Unlimited USA & India",
        badge: "",
        active: true,
      },
    ],
  },
  {
    id: "mobile",
    name: "Mobile Plans",
    active: true,
    poster: "/posters/mobile.svg",
    voiceNote: "",
    posters: [],
    deals: [
      {
        name: "Talk & Text",
        details: "5 GB data",
        price: "$25/mo",
        tag: "Canada-wide",
        badge: "",
        active: true,
      },
      {
        name: "Unlimited Basic",
        details: "20 GB data",
        price: "$40/mo",
        tag: "No overage fees",
        badge: "Popular",
        active: true,
      },
      {
        name: "Unlimited Premium",
        details: "Unlimited data",
        price: "$55/mo",
        tag: "USA & Mexico roaming",
        badge: "Best Value",
        active: true,
      },
    ],
  },
];
