import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Site from "./models/Site.js";

dotenv.config();
await connectDB();

// Mock seed data for MongoDB
const sites = [
  {
    siteId: "SITE001",
    name: "Downtown Office Complex",
    address: "123 Main Street, Downtown, Pune",
    location: "Pune, Maharashtra",
    isActive: true
  },
  {
    siteId: "SITE002",
    name: "Luxury Residential Tower",
    address: "456 Park Avenue, Mumbai Central",
    location: "Mumbai, Maharashtra",
    isActive: true
  },
  {
    siteId: "SITE003",
    name: "City Hospital",
    address: "789 Health Road, Nagpur",
    location: "Nagpur, Maharashtra",
    isActive: true
  },
  {
    siteId: "SITE004",
    name: "Grand Mall",
    address: "321 Shopping Plaza, Bangalore",
    location: "Bangalore, Karnataka",
    isActive: true
  }
];

const projects = [
  {
    name: "Modern Office Complex - Complete MEP Installation",
    description:
      "Complete MEP installation for a 10-story modern office complex including smart building automation, energy-efficient HVAC systems, and advanced electrical infrastructure.",
    startDate: new Date("2023-05-15"),
    endDate: new Date("2024-01-15"),
    duration: 8, // in months
    status: "Completed",
    Workers: 15,
    budget: 2500000,
    client: "66d9e4f5c9d7d44d34f4a123", // <-- replace with actual Company ObjectId
    location: "Pune, Maharashtra",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    ],
    services: [
      "Electrical Installation",
      "HVAC Systems",
      "Plumbing",
      "Fire Safety",
      "Building Automation",
    ],
  },
  {
    name: "Luxury Residential Complex - HVAC & Electrical",
    description:
      "Premium HVAC and electrical systems for a luxury residential complex with 100 apartments, featuring individual climate control and smart home integration.",
    startDate: new Date("2023-05-20"),
    endDate: new Date("2023-11-20"),
    duration: 6,
    status: "Completed",
    Workers: 12,
    budget: 1800000,
    client: "66d9e4f5c9d7d44d34f4a124", // <-- replace with actual Company ObjectId
    location: "Mumbai, Maharashtra",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    services: [
      "Central Air Conditioning",
      "Electrical Distribution",
      "Home Automation",
      "Security Systems",
    ],
  },
  {
    name: "Hospital Water Treatment & Plumbing Systems",
    description:
      "Comprehensive plumbing and water treatment systems for a 200-bed hospital including medical gas systems, water purification, and waste management.",
    startDate: new Date("2023-05-10"),
    endDate: new Date("2023-09-10"),
    duration: 4,
    status: "Completed",
    Workers: 8,
    budget: 1200000,
    client: "66d9e4f5c9d7d44d34f4a125", // <-- replace with actual Company ObjectId
    location: "Nagpur, Maharashtra",
    images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
    ],
    services: [
      "Medical Plumbing",
      "Water Treatment",
      "Waste Management",
      "Medical Gas Systems",
    ],
  },
  {
    name: "Shopping Mall Electrical Infrastructure",
    description:
      "Complete electrical infrastructure for a large shopping mall including power distribution, lighting systems, emergency backup, and retail electrical services.",
    startDate: new Date("2022-09-25"),
    endDate: new Date("2023-07-25"),
    duration: 10,
    status: "Completed",
    Workers: 20,
    budget: 3200000,
    client: "66d9e4f5c9d7d44d34f4a126", // <-- replace with actual Company ObjectId
    location: "Bangalore, Karnataka",
    images: [
      "https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=800",
      "https://images.unsplash.com/photo-1472224371017-08207f84aaae?w=800",
    ],
    services: [
      "Power Distribution",
      "Commercial Lighting",
      "Emergency Systems",
      "Retail Electrical",
    ],
  },
];



const seedData = async () => {
  try {
    await Site.deleteMany();
    await Site.insertMany(sites);
    console.log("Dummy sites inserted!");

    await Project.deleteMany();
    await Project.insertMany(projects);
    console.log("Dummy projects inserted!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
