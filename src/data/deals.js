// Central WhatsApp number used across the whole app.
export const WHATSAPP_NUMBER = "16477408124";

// Tab definitions. `id` matches the keys in the `deals` object below.
export const tabs = [
  { id: "internet", label: "Internet Deals" },
  { id: "rental", label: "Rental" },
  { id: "homePhone", label: "Home Phone" },
  { id: "mobile", label: "Mobile Plans" },
];

// All deal data grouped by tab id.
export const deals = {
  internet: [
    {
      name: "Starter Internet",
      details: "25 Mbps",
      price: "$45/mo",
      tagline: "Best for 1-2 users",
      badge: "Popular",
    },
    {
      name: "Home Internet Plus",
      details: "150 Mbps",
      price: "$60/mo",
      tagline: "Best for families",
      badge: "",
    },
    {
      name: "Gigabit Fibre",
      details: "1 Gbps",
      price: "$85/mo",
      tagline: "Unlimited data",
      badge: "Best Value",
    },
  ],
  rental: [
    {
      name: "1 Bed Apartment",
      details: "Downtown Toronto",
      price: "$1,800/mo",
      tagline: "Available now",
      badge: "New",
    },
    {
      name: "2 Bed Apartment",
      details: "North York",
      price: "$2,200/mo",
      tagline: "Pet friendly",
      badge: "",
    },
    {
      name: "3 Bed House",
      details: "Mississauga",
      price: "$2,800/mo",
      tagline: "Garage included",
      badge: "",
    },
  ],
  homePhone: [
    {
      name: "Basic Home Phone",
      details: "Unlimited local calls",
      price: "$15/mo",
      tagline: "No contract",
      badge: "",
    },
    {
      name: "Home Phone Plus",
      details: "Unlimited Canada-wide",
      price: "$25/mo",
      tagline: "+ Voicemail",
      badge: "Popular",
    },
    {
      name: "International Bundle",
      details: "60+ countries",
      price: "$35/mo",
      tagline: "Unlimited USA & India",
      badge: "",
    },
  ],
  mobile: [
    {
      name: "Talk & Text",
      details: "5 GB data",
      price: "$25/mo",
      tagline: "Canada-wide",
      badge: "",
    },
    {
      name: "Unlimited Basic",
      details: "20 GB data",
      price: "$40/mo",
      tagline: "No overage fees",
      badge: "Popular",
    },
    {
      name: "Unlimited Premium",
      details: "Unlimited data",
      price: "$55/mo",
      tagline: "USA & Mexico roaming",
      badge: "Best Value",
    },
  ],
};
