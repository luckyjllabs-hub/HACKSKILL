import fs from "fs";
import path from "path";

const firstNames = [
  "Aarav", "Aanya", "Aditi", "Aditya", "Advait", "Akash", "Ananya", "Aniket", "Anika", "Anushka",
  "Arjun", "Armaan", "Aryan", "Avani", "Ayush", "Bhavya", "Chetan", "Deepak", "Dev", "Dia",
  "Divya", "Dhruv", "Gaurav", "Gayatri", "Harsh", "Ishaan", "Isha", "Kabir", "Kalyani", "Karan",
  "Kavya", "Khushi", "Krishna", "Kunal", "Laksh", "Madhav", "Manish", "Meera", "Mihir", "Mohit",
  "Nakul", "Neha", "Nikhil", "Nisha", "Ojas", "Palak", "Parth", "Pooja", "Pranav", "Pranay",
  "Priya", "Rahul", "Rhea", "Rishi", "Riya", "Rohan", "Rohit", "Sahil", "Sakshi", "Samarth",
  "Sameer", "Sanjana", "Sara", "Sarthak", "Shaan", "Shreya", "Siddharth", "Simran", "Sneha", "Soham",
  "Sparsh", "Srishti", "Tanmay", "Tanvi", "Tarun", "Trisha", "Tushar", "Utkarsh", "Vaibhav", "Varun",
  "Vedant", "Vidhi", "Vikram", "Vikramaditya", "Vinay", "Vipul", "Yash", "Yuvraj", "Zara", "Zoya",
  "Alex", "David", "Emma", "Lucas", "Maya", "Nathan", "Olivia", "Sam", "Sophia", "Liam"
];

const lastNames = [
  "Sharma", "Verma", "Mehta", "Patel", "Nair", "Rao", "Reddy", "Gupta", "Kapoor", "Chopra",
  "Singh", "Bose", "Sen", "Chatterjee", "Banerjee", "Mukherjee", "Das", "Dutta", "Iyer", "Iyengar",
  "Menon", "Pillai", "Kulkarni", "Deshmukh", "Joshi", "Patil", "Shinde", "Pawar", "Bhat", "Hegde",
  "Shetty", "Gowda", "Naidu", "Choudhury", "Bhattacharya", "Mishra", "Pandey", "Tripathi", "Dubey", "Tiwari",
  "Saxena", "Srivastava", "Bhardwaj", "Aggarwal", "Goel", "Bansal", "Mittal", "Jindal", "Garg", "Singhal",
  "Malhotra", "Khurana", "Sethi", "Bhasin", "Ahluwalia", "Gill", "Dhillon", "Sandhu", "Sidhu", "Grewal",
  "Shah", "Parekh", "Gandhi", "Merchant", "Zaveri", "Kothari", "Desai", "Amin", "Modi", "Doshi"
];

const departments = [
  "Computer Science & Engineering",
  "Artificial Intelligence & Machine Learning",
  "Data Science & Analytics",
  "Information Technology",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering & Robotics",
  "Biotechnology & Bioinformatics",
  "Environmental Science & Sustainable Tech",
  "Human-Centered Design & UI/UX",
  "Economics & Quantitative Finance",
  "Cognitive Science & HCI"
];

const rolesList = [
  "ML Engineer", "Computer Vision Lead", "NLP Researcher", "Full Stack Developer", "Frontend Lead",
  "Backend Architect", "UI/UX Designer", "Product Designer", "Data Scientist", "Mobile App Developer",
  "IoT & Embedded Engineer", "Sustainability Lead", "FinTech Analyst", "Healthcare AI Specialist",
  "Cloud & DevOps Engineer", "GIS & Geospatial Specialist", "Blockchain Developer", "Robotics Engineer"
];

const canonicalSkillsPool = [
  "Machine Learning", "Computer Vision", "Natural Language Processing", "Deep Learning", "Python",
  "TensorFlow", "PyTorch", "Full Stack", "Frontend", "Backend", "React", "Next.js", "TypeScript",
  "Node.js", "FastAPI", "GraphQL", "PostgreSQL", "MongoDB", "Redis", "UI/UX", "Figma",
  "Product Design", "Design Systems", "Sustainability", "Domain Expertise", "IoT", "Embedded Systems",
  "Hardware", "Geospatial Data", "GIS", "Mobile", "React Native", "Flutter", "Healthcare",
  "FinTech", "Blockchain", "Solidity", "Cloud", "AWS", "Docker", "Kubernetes", "Data Science",
  "Pandas", "Analytics", "Bioinformatics", "Robotics", "ROS", "Edge AI", "Cybersecurity", "APIs"
];

const domainsPool = [
  "Artificial Intelligence", "Computer Vision", "Natural Language Processing", "Sustainability",
  "Clean Energy", "Smart Cities", "FinTech", "Healthcare", "BioTech", "AgriTech", "EdTech",
  "Robotics", "IoT", "Geospatial Data", "E-Commerce", "Cybersecurity", "Autonomous Systems",
  "Social Impact", "Decentralized Systems", "Supply Chain"
];

const pastProjectTemplates = [
  { title: "Smart Traffic Flow Optimization", category: "Smart Cities", skills: ["Computer Vision", "Python", "IoT"] },
  { title: "Campus Solid Waste Classification", category: "Sustainability", skills: ["Computer Vision", "Deep Learning", "Sustainability"] },
  { title: "Decentralized Micro-Lending Portal", category: "FinTech", skills: ["Full Stack", "React", "Blockchain"] },
  { title: "Automated Crop Disease Diagnosis", category: "AgriTech", skills: ["Computer Vision", "Python", "Mobile"] },
  { title: "Student Mental Health Companion", category: "Healthcare", skills: ["Natural Language Processing", "React", "UI/UX"] },
  { title: "Autonomous Drone Path Planner", category: "Robotics", skills: ["Robotics", "Python", "IoT"] },
  { title: "Solar Rooftop Yield Predictor", category: "Clean Energy", skills: ["Machine Learning", "Python", "Sustainability"] },
  { title: "Algorithmic Market Sentiment Tracker", category: "FinTech", skills: ["Natural Language Processing", "Python", "Data Science"] },
  { title: "Remote Patient Vitals Telemetry", category: "Healthcare", skills: ["IoT", "Backend", "React Native"] },
  { title: "Urban Heat Island Geospatial Map", category: "Smart Cities", skills: ["Geospatial Data", "GIS", "Python"] },
  { title: "Peer-to-Peer Notes & Resource Sharing", category: "EdTech", skills: ["Full Stack", "Next.js", "PostgreSQL"] },
  { title: "Real-time Defect Detection Pipeline", category: "Computer Vision", skills: ["Computer Vision", "PyTorch", "Edge AI"] },
  { title: "Carbon Footprint Tracker for Cafeterias", category: "Sustainability", skills: ["Full Stack", "Sustainability", "UI/UX"] },
  { title: "High-Frequency Crypto Arbitrage Bot", category: "FinTech", skills: ["Backend", "Python", "FastAPI"] },
  { title: "Voice-Assisted Form Filler for Seniors", category: "Healthcare", skills: ["Natural Language Processing", "React", "UI/UX"] }
];

const avatarImages = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250"
];

const collabStyles = [
  "Agile / Fast-Paced",
  "Structured & Methodical",
  "Creative / Exploratory",
  "Balanced"
];

function generateStudents() {
  const students = [];

  for (let i = 1; i <= 500; i++) {
    const id = `student-${String(i).padStart(3, "0")}`;
    const firstName = firstNames[(i * 7 + 13) % firstNames.length];
    const lastName = lastNames[(i * 11 + 17) % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const department = departments[i % departments.length];
    const year = (i % 4) + 1;
    const avatar = avatarImages[i % avatarImages.length];

    const role1 = rolesList[i % rolesList.length];
    const role2 = rolesList[(i * 3 + 2) % rolesList.length];
    const preferredRoles = [role1, role2];

    const expLevel = i % 5 === 0 ? "Expert" : i % 3 === 0 ? "Advanced" : i % 2 === 0 ? "Intermediate" : "Beginner";

    // Select 4-6 skills
    const primarySkill =
      role1.includes("ML") || role1.includes("Vision") || role1.includes("AI") ? "Machine Learning" :
      role1.includes("Front") || role1.includes("UI") ? "Frontend" :
      role1.includes("Back") || role1.includes("Cloud") ? "Backend" :
      role1.includes("Design") ? "UI/UX" :
      role1.includes("Sustainability") ? "Sustainability" :
      role1.includes("IoT") || role1.includes("Robotics") ? "IoT" :
      role1.includes("FinTech") ? "FinTech" : "Full Stack";

    const s2 = canonicalSkillsPool[(i * 5) % canonicalSkillsPool.length];
    const s3 = canonicalSkillsPool[(i * 7 + 3) % canonicalSkillsPool.length];
    const s4 = canonicalSkillsPool[(i * 11 + 7) % canonicalSkillsPool.length];
    const s5 = canonicalSkillsPool[(i * 13 + 9) % canonicalSkillsPool.length];

    const uniqueSkillNames = Array.from(new Set([primarySkill, s2, s3, s4, s5])).slice(0, 5);
    const skills = uniqueSkillNames.map((skName, idx) => ({
      name: skName,
      level: idx === 0 ? (expLevel === "Beginner" ? "Intermediate" : expLevel) :
             idx === 1 ? (expLevel === "Expert" ? "Advanced" : "Intermediate") :
             "Intermediate"
    }));

    // Availability
    const availOptions = [
      ["Weekdays", "Evenings"],
      ["Weekends", "Flexible"],
      ["Evenings", "Weekends"],
      ["Flexible"]
    ];
    const availability = availOptions[i % availOptions.length];

    // Interests
    const int1 = domainsPool[(i * 3) % domainsPool.length];
    const int2 = domainsPool[(i * 7 + 2) % domainsPool.length];
    const int3 = domainsPool[(i * 11 + 4) % domainsPool.length];
    const interests = Array.from(new Set([int1, int2, int3]));

    // Past Projects
    const projTemplate1 = pastProjectTemplates[i % pastProjectTemplates.length];
    const projTemplate2 = pastProjectTemplates[(i * 3 + 4) % pastProjectTemplates.length];
    const pastProjects = [
      {
        title: projTemplate1.title,
        description: `Developed scalable architecture for ${projTemplate1.title.toLowerCase()} utilizing ${skills[0].name} and ${skills[1]?.name || 'TypeScript'}.`,
        category: projTemplate1.category,
        skills: projTemplate1.skills
      },
      {
        title: projTemplate2.title,
        description: `Collaborated in a sprint team to deliver ${projTemplate2.title.toLowerCase()} with focus on end-to-end integration.`,
        category: projTemplate2.category,
        skills: projTemplate2.skills
      }
    ];

    const bio = `Year ${year} ${department} student specializing in ${role1}. Passionate about building impactful projects in ${interests.join(" and ")}.`;
    const collaborationStyle = collabStyles[i % collabStyles.length];
    const preferredTeamSize = (i % 3) + 3;

    students.push({
      id,
      name,
      avatar,
      department,
      year,
      bio,
      experienceLevel: expLevel,
      collaborationStyle,
      preferredTeamSize,
      skills,
      interests,
      availability,
      pastProjects,
      preferredRoles
    });
  }

  return students;
}

const students = generateStudents();

const fileContent = `import { StudentProfile } from "@/types/student";

export const SEEDED_STUDENTS: StudentProfile[] = ${JSON.stringify(students, null, 2)};
`;

const outputPath = path.join(process.cwd(), "data", "seed", "students.ts");
fs.writeFileSync(outputPath, fileContent, "utf-8");

const dbPath = path.join(process.cwd(), "data", "db", "students.json");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
fs.writeFileSync(dbPath, JSON.stringify(students, null, 2), "utf-8");

console.log(`Successfully generated and seeded ${students.length} student profiles with full TypeScript conformance!`);
