import { DemoPreset } from "@/types/project";

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "preset-waste-ai",
    title: "AI Campus Waste Segregation & Circularity",
    category: "AI / Sustainability",
    tagline: "Signature 90-second WOW scenario",
    description:
      "We are building an AI-powered waste segregation and circularity platform. It uses computer vision to classify recyclables, wet waste, and e-waste from bin cameras, dispatches smart collection routes via a web dashboard, and requires municipal sustainability domain expertise.",
    desiredTeamSize: 4,
    domains: ["Sustainability", "Smart Cities"],
    expectedRoles: ["ML Engineer", "Full Stack Developer", "UI/UX Designer", "Domain Specialist"],
    demoNotes: "Ideal for showing Complementary Team Formation and triggering the Sustainability gap when Rahul Verma is removed.",
  },
  {
    id: "preset-pothole-cv",
    title: "Smart Pothole Detection & Municipal GIS Mapping",
    category: "AI / Smart Cities",
    tagline: "Official Problem Statement 2 Classic",
    description:
      "I want to build an AI-powered system that detects potholes and road anomalies from smartphone cameras on moving vehicles and maps them with geospatial telemetry for municipal road maintenance authorities.",
    desiredTeamSize: 4,
    domains: ["Smart Cities", "Transportation"],
    expectedRoles: ["Computer Vision Lead", "Mobile Developer", "Geospatial Lead", "Backend Developer"],
    demoNotes: "Matches Aarav (CV), Riya (Mobile), Siddharth (Geospatial), and Arjun (Full Stack).",
  },
  {
    id: "preset-agritech-drone",
    title: "Precision Agritech Crop Blight & Soil Drone AI",
    category: "Agriculture / AI / IoT",
    tagline: "High-impact AgriTech MVP",
    description:
      "Developing an autonomous drone imaging and IoT sensor network system that detects crop blight phenotypes early and alerts smallholder farmers via a mobile interface.",
    desiredTeamSize: 4,
    domains: ["Agriculture", "IoT", "Smart Cities"],
    expectedRoles: ["ML Engineer", "Agritech Domain Specialist", "IoT Engineer", "Mobile Developer"],
    demoNotes: "Pairs Gurpreet Singh (Agriculture) with Aditya Nambiar (IoT) and Aarav (ML).",
  },
  {
    id: "preset-mental-wellness",
    title: "Student Mental Wellness & Stress Companion AI",
    category: "Healthcare / NLP",
    tagline: "Human-centric AI healthcare",
    description:
      "Building an empathetic conversational companion and triage assistant that analyzes student stress markers, provides grounding exercises, and connects to campus counselors securely.",
    desiredTeamSize: 4,
    domains: ["Healthcare", "AI", "Wellness"],
    expectedRoles: ["NLP Specialist", "Healthcare Domain Lead", "UI/UX Designer", "Full Stack Developer"],
    demoNotes: "Pairs Tanvi Kulkarni (NLP) with Dr. Meera (Healthcare) and Priya (UI/UX).",
  },
  {
    id: "preset-fintech-risk",
    title: "P2P Micro-Lending Alternative Risk Engine",
    category: "FinTech / Data Science",
    tagline: "Algorithmic finance & security",
    description:
      "An automated risk scoring engine for college student micro-loans that uses alternative transaction telemetry, secure API banking gateways, and fraud detection models.",
    desiredTeamSize: 3,
    domains: ["FinTech", "Startups"],
    expectedRoles: ["FinTech Specialist", "Data Scientist", "Backend Lead"],
    demoNotes: "Pairs Devanshu Bahl (FinTech) with Neha Sundaram (Data Science) and Rohan (Backend).",
  },
];
