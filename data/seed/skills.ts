export interface CanonicalSkill {
  name: string;
  category: "AI/ML" | "Engineering" | "Design" | "Data" | "Domain" | "Product/Business" | "Hardware";
  aliases: string[];
}

export const CANONICAL_SKILLS: CanonicalSkill[] = [
  // AI/ML
  {
    name: "Machine Learning",
    category: "AI/ML",
    aliases: ["ml", "machine learning", "ml models", "machine-learning", "scikit-learn", "xgboost", "predictive modeling"],
  },
  {
    name: "Computer Vision",
    category: "AI/ML",
    aliases: ["cv", "computer vision", "image recognition", "object detection", "image classification", "yolo", "opencv", "segmentation"],
  },
  {
    name: "Natural Language Processing",
    category: "AI/ML",
    aliases: ["nlp", "natural language processing", "llm", "llms", "transformers", "text analysis", "langchain", "prompt engineering", "gemini"],
  },
  {
    name: "Deep Learning",
    category: "AI/ML",
    aliases: ["deep learning", "neural networks", "pytorch", "tensorflow", "keras", "cnn", "rnn"],
  },
  {
    name: "Python",
    category: "AI/ML",
    aliases: ["python", "py", "python3", "numpy", "pandas"],
  },

  // Engineering / Web / Mobile
  {
    name: "Frontend",
    category: "Engineering",
    aliases: ["frontend", "web frontend", "frontend development", "client side", "web ui", "html", "css", "tailwind"],
  },
  {
    name: "React",
    category: "Engineering",
    aliases: ["react", "reactjs", "react.js", "nextjs", "next.js", "next"],
  },
  {
    name: "Backend",
    category: "Engineering",
    aliases: ["backend", "server", "backend development", "api development", "web backend", "rest api"],
  },
  {
    name: "Node.js",
    category: "Engineering",
    aliases: ["node", "nodejs", "node.js", "express", "nestjs"],
  },
  {
    name: "APIs",
    category: "Engineering",
    aliases: ["api", "apis", "rest", "graphql", "fastapi", "endpoints"],
  },
  {
    name: "Mobile",
    category: "Engineering",
    aliases: ["mobile", "mobile app", "mobile development", "android", "ios", "react native", "flutter", "swift", "kotlin"],
  },
  {
    name: "Cloud",
    category: "Engineering",
    aliases: ["cloud", "aws", "gcp", "azure", "serverless", "cloud computing"],
  },
  {
    name: "DevOps",
    category: "Engineering",
    aliases: ["devops", "docker", "kubernetes", "ci/cd", "github actions", "deployment"],
  },
  {
    name: "Database",
    category: "Engineering",
    aliases: ["database", "sql", "postgresql", "postgres", "mongodb", "supabase", "firebase", "prisma"],
  },
  {
    name: "Cybersecurity",
    category: "Engineering",
    aliases: ["cybersecurity", "security", "infosec", "penetration testing", "encryption", "auth", "oauth"],
  },

  // Design
  {
    name: "UI/UX",
    category: "Design",
    aliases: ["ui/ux", "ui", "ux", "ui design", "ux design", "figma", "wireframing", "user experience", "user interface"],
  },
  {
    name: "Product Design",
    category: "Design",
    aliases: ["product design", "prototyping", "design system", "user research", "design thinking"],
  },

  // Data
  {
    name: "Data Science",
    category: "Data",
    aliases: ["data science", "data analysis", "analytics", "eda", "statistical analysis", "jupyter"],
  },
  {
    name: "Data Engineering",
    category: "Data",
    aliases: ["data engineering", "etl", "data pipelines", "spark", "hadoop", "sql warehousing"],
  },
  {
    name: "Geospatial Data",
    category: "Data",
    aliases: ["geospatial", "gis", "mapping", "geospatial data", "geopandas", "leaflet", "map visualization", "gps data"],
  },

  // Domain Specialties
  {
    name: "Sustainability",
    category: "Domain",
    aliases: ["sustainability", "green tech", "clean energy", "waste management", "recycling", "climate tech", "environmental"],
  },
  {
    name: "Healthcare",
    category: "Domain",
    aliases: ["healthcare", "health tech", "biomedical", "medical data", "telemedicine", "wellness"],
  },
  {
    name: "FinTech",
    category: "Domain",
    aliases: ["fintech", "finance", "financial analysis", "blockchain", "crypto", "algorithmic trading", "payments"],
  },
  {
    name: "Smart Cities",
    category: "Domain",
    aliases: ["smart cities", "urban planning", "municipal", "traffic", "civic tech", "public infrastructure"],
  },
  {
    name: "Agriculture",
    category: "Domain",
    aliases: ["agriculture", "agritech", "precision agriculture", "crop monitoring", "soil data", "farming tech"],
  },
  {
    name: "Domain Expertise",
    category: "Domain",
    aliases: ["domain expertise", "subject matter expert", "domain specialist", "field knowledge"],
  },

  // Hardware / Robotics
  {
    name: "IoT",
    category: "Hardware",
    aliases: ["iot", "internet of things", "arduino", "raspberry pi", "sensors", "esp32", "mqtt"],
  },
  {
    name: "Robotics",
    category: "Hardware",
    aliases: ["robotics", "ros", "ros2", "embedded systems", "drones", "hardware control", "autonomous"],
  },

  // Product & Business
  {
    name: "Product Management",
    category: "Product/Business",
    aliases: ["product management", "product", "agile", "scrum", "product strategy", "mvp planning"],
  },
  {
    name: "Pitching",
    category: "Product/Business",
    aliases: ["pitching", "presentation", "public speaking", "demo presentation", "storytelling", "communication"],
  },
  {
    name: "Marketing",
    category: "Product/Business",
    aliases: ["marketing", "growth", "branding", "user acquisition", "content"],
  },
  {
    name: "Research",
    category: "Product/Business",
    aliases: ["research", "academic research", "paper writing", "literature review", "experiment design"],
  },
];
