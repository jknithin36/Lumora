import logo from "./data.png";

import logo_full from "./logo_full.svg";
import logo_full_dark from "./logo_full_dark.svg";
import search_icon from "./search_icon.svg";
import user_icon from "./user_icon.png";
import theme_icon from "./theme_icon.svg";
import send_icon from "./send_icon.svg";
import stop_icon from "./stop_icon.svg";
import mountain_img from "./mountain_img.jpg";
import menu_icon from "./menu_icon.svg";
import close_icon from "./close_icon.svg";
import bin_icon from "./bin_icon.svg";
import logout_icon from "./logout_icon.svg";
import diamond_icon from "./diamond_icon.svg";
import gallery_icon from "./gallery_icon.svg";

import ai_image1 from "./ai_image1.jpg";
import ai_image2 from "./ai_image2.jpg";
import ai_image3 from "./ai_image3.jpg";
import ai_image4 from "./ai_image4.jpg";
import ai_image5 from "./ai_image5.jpg";
import ai_image6 from "./ai_image6.jpg";
import ai_image7 from "./ai_image7.jpg";
import ai_image8 from "./ai_image8.jpg";
import ai_image9 from "./ai_image9.jpg";
import ai_image10 from "./ai_image10.jpg";
import ai_image11 from "./ai_image11.jpg";
import ai_image12 from "./ai_image12.jpg";

export const assets = {
  logo,
  logo_full,
  search_icon,
  user_icon,
  theme_icon,
  send_icon,
  stop_icon,
  mountain_img,
  menu_icon,
  close_icon,
  bin_icon,
  logout_icon,
  logo_full_dark,
  diamond_icon,
  gallery_icon,
};

export const dummyUserData = {
  _id: "689c6deed410acddc0d95a0e",
  name: "Nithin Kumar",
  email: "nithinkumarjk1@gmail.com",
  password: "$2b$10$VESVdPDjL5LF.KCU6jKyqeXNSLASAAfpR2kkIJExtMO.PJvZJAudy",
  credits: 200,
};

// copy for server controllers
export const dummyPlans = [
  {
    _id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 20,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
  },
  {
    _id: "premium",
    name: "Premium",
    price: 30,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  },
];

export const dummyChats = [
  {
    _id: "c1",
    userId: "u1",
    name: "AI Image Prompt",
    messages: [
      {
        role: "user",
        content: "Generate a futuristic city skyline",
        timestamp: 1755178179612,
      },
      {
        role: "assistant",
        content: "Here’s a cyberpunk city skyline with neon lights…",
        timestamp: 1755178194747,
      },
    ],
    createdAt: "2025-08-14T10:00:00.000Z",
    updatedAt: "2025-08-14T10:30:00.000Z",
  },
  {
    _id: "c2",
    userId: "u1",
    name: "Learning React",
    messages: [
      {
        role: "user",
        content: "Explain useEffect with example",
        timestamp: 1755106415912,
      },
      {
        role: "assistant",
        content: "useEffect runs after render. Example: fetching API…",
        timestamp: 1755106420723,
      },
    ],
    createdAt: "2025-08-13T15:00:00.000Z",
    updatedAt: "2025-08-13T16:00:00.000Z",
  },
  {
    _id: "c3",
    userId: "u1",
    name: "Travel Ideas",
    messages: [
      {
        role: "user",
        content: "Suggest best places in Europe for winter",
        timestamp: 1755158982894,
      },
      {
        role: "assistant",
        content: "Austria, Switzerland, and Prague are great options…",
        timestamp: 1755158995829,
      },
    ],
    createdAt: "2025-08-10T09:00:00.000Z",
    updatedAt: "2025-08-10T09:45:00.000Z",
  },
  {
    _id: "c4",
    userId: "u1",
    name: "Web Development",
    messages: [
      {
        role: "user",
        content: "What are top frameworks to learn in 2025?",
        timestamp: 1755159074583,
      },
      {
        role: "assistant",
        content: "React, Next.js, SvelteKit, Bun, and Rust-based APIs…",
        timestamp: 1755159100513,
      },
    ],
    createdAt: "2025-08-09T12:00:00.000Z",
    updatedAt: "2025-08-09T12:30:00.000Z",
  },
  {
    _id: "c5",
    userId: "u1",
    name: "Daily Journal",
    messages: [
      {
        role: "user",
        content: "Today I worked on my new project Lumora",
        timestamp: 1755159129597,
      },
      {
        role: "assistant",
        content: "That’s great! Keep logging your progress daily.",
        timestamp: 1755159145294,
      },
    ],
    createdAt: "2025-08-08T08:00:00.000Z",
    updatedAt: "2025-08-08T08:30:00.000Z",
  },
  {
    _id: "c6",
    userId: "u1",
    name: "Fitness Plan",
    messages: [
      {
        role: "user",
        content: "Give me a 4-day gym split routine",
        timestamp: 1755160243315,
      },
      {
        role: "assistant",
        content: "Here’s a push/pull/legs/abs routine for you…",
        timestamp: 1755160254161,
      },
    ],
    createdAt: "2025-08-07T18:00:00.000Z",
    updatedAt: "2025-08-07T18:15:00.000Z",
  },
  {
    _id: "c7",
    userId: "u1",
    name: "Cooking Recipes",
    messages: [
      {
        role: "user",
        content: "How to make a healthy chicken curry?",
        timestamp: 1755163772103,
      },
      {
        role: "assistant",
        content: "Here’s a recipe with low oil and fresh spices…",
        timestamp: 1755163783470,
      },
    ],
    createdAt: "2025-08-06T20:00:00.000Z",
    updatedAt: "2025-08-06T20:45:00.000Z",
  },
  {
    _id: "c8",
    userId: "u1",
    name: "Job Interview Prep",
    messages: [
      {
        role: "user",
        content: "Tell me about system design basics",
        timestamp: 1755163990514,
      },
      {
        role: "assistant",
        content: "System design covers scalability, load balancing…",
        timestamp: 1755164001928,
      },
    ],
    createdAt: "2025-08-05T11:00:00.000Z",
    updatedAt: "2025-08-05T11:20:00.000Z",
  },
  {
    _id: "c9",
    userId: "u1",
    name: "Movie Suggestions",
    messages: [
      {
        role: "user",
        content: "Suggest top sci-fi movies",
        timestamp: 1755169666525,
      },
      {
        role: "assistant",
        content: "Interstellar, Inception, Arrival, The Martian…",
        timestamp: 1755169683847,
      },
    ],
    createdAt: "2025-08-04T14:00:00.000Z",
    updatedAt: "2025-08-04T14:30:00.000Z",
  },
  {
    _id: "c10",
    userId: "u1",
    name: "Music Playlist",
    messages: [
      {
        role: "user",
        content: "Make me a relaxing lo-fi playlist",
        timestamp: 1755170243315,
      },
      {
        role: "assistant",
        content: "Here’s a 10-song lo-fi playlist for studying…",
        timestamp: 1755170254161,
      },
    ],
    createdAt: "2025-08-03T19:00:00.000Z",
    updatedAt: "2025-08-03T19:15:00.000Z",
  },
];

export const dummyPublishedImages = [
  {
    imageUrl: ai_image11,
    userName: "GreatStack",
  },
  {
    imageUrl: ai_image10,
    userName: "GreatStack",
  },
  {
    imageUrl: ai_image9,
    userName: "GreatStack",
  },
  {
    imageUrl: ai_image8,
    userName: "GreatStack",
  },
  {
    imageUrl: ai_image7,
    userName: "GreatStack",
  },
  {
    imageUrl: ai_image6,
    userName: "GreatStack",
  },
  {
    imageUrl: ai_image5,
    userName: "GreatStack",
  },
  {
    imageUrl: ai_image4,
    userName: "GreatStack",
  },
  {
    imageUrl: ai_image3,
    userName: "GreatStack",
  },
  {
    imageUrl: ai_image2,
    userName: "GreatStack",
  },
  {
    imageUrl: ai_image1,
    userName: "GreatStack",
  },
];
