import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

config(); // load .env

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@corp.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@corp.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  // Create learner user
  const learnerPassword = await bcrypt.hash("learner123", 10);
  const learner = await prisma.user.upsert({
    where: { email: "learner@corp.com" },
    update: {},
    create: {
      name: "Jane Learner",
      email: "learner@corp.com",
      passwordHash: learnerPassword,
      role: "LEARNER",
    },
  });

  // Create sample roadmap
  const roadmap = await prisma.roadmap.upsert({
    where: { id: "seed-roadmap-1" },
    update: {},
    create: {
      id: "seed-roadmap-1",
      title: "Full-Stack Web Development",
      description:
        "A comprehensive roadmap to become a modern full-stack developer, covering front-end, back-end, databases, and DevOps essentials for enterprise applications.",
      category: "Engineering",
      level: "BEGINNER",
      tags: ["JavaScript", "React", "Node.js", "PostgreSQL", "Docker"],
      published: true,
      createdById: admin.id,
      steps: {
        create: [
          {
            title: "HTML & CSS Fundamentals",
            description:
              "Master the building blocks of the web: semantic HTML5 and modern CSS3 including Flexbox and Grid.",
            estimatedHours: 20,
            order: 1,
            resources: [
              "https://developer.mozilla.org/en-US/docs/Learn/HTML",
              "https://css-tricks.com",
            ],
            todos: {
              create: [
                { label: "Learn HTML5 semantic elements", order: 1 },
                { label: "Master CSS Flexbox layout", order: 2 },
                { label: "Master CSS Grid layout", order: 3 },
                { label: "Build a responsive landing page", order: 4 },
              ],
            },
          },
          {
            title: "JavaScript & TypeScript",
            description:
              "Deep dive into modern JavaScript (ES2024) and TypeScript for type-safe enterprise development.",
            estimatedHours: 40,
            order: 2,
            resources: [
              "https://javascript.info",
              "https://www.typescriptlang.org/docs",
            ],
            todos: {
              create: [
                { label: "JavaScript ES6+ fundamentals", order: 1 },
                { label: "Async/Await and Promises", order: 2 },
                { label: "TypeScript type system basics", order: 3 },
                { label: "TypeScript generics and utility types", order: 4 },
                { label: "Build a CLI tool in TypeScript", order: 5 },
              ],
            },
          },
          {
            title: "React & Next.js",
            description:
              "Build modern, performant web applications using React 19 and Next.js 15 App Router.",
            estimatedHours: 50,
            order: 3,
            resources: [
              "https://react.dev",
              "https://nextjs.org/docs",
            ],
            todos: {
              create: [
                { label: "React components and hooks", order: 1 },
                { label: "State management with Context API", order: 2 },
                { label: "Next.js App Router and Server Components", order: 3 },
                { label: "Data fetching patterns (SWR)", order: 4 },
                { label: "Build a full-stack Next.js app", order: 5 },
              ],
            },
          },
          {
            title: "Databases & Prisma ORM",
            description:
              "Learn relational database design with PostgreSQL and Prisma ORM for type-safe database access.",
            estimatedHours: 30,
            order: 4,
            resources: [
              "https://www.prisma.io/docs",
              "https://www.postgresql.org/docs",
            ],
            todos: {
              create: [
                { label: "SQL fundamentals and joins", order: 1 },
                { label: "PostgreSQL advanced features", order: 2 },
                { label: "Prisma schema design", order: 3 },
                { label: "Migrations and seeding", order: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  // Create second roadmap
  await prisma.roadmap.upsert({
    where: { id: "seed-roadmap-2" },
    update: {},
    create: {
      id: "seed-roadmap-2",
      title: "Cloud & DevOps Engineering",
      description:
        "Master cloud infrastructure, CI/CD pipelines, containerization, and DevOps practices for enterprise-scale deployments.",
      category: "DevOps",
      level: "INTERMEDIATE",
      tags: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
      published: true,
      createdById: admin.id,
      steps: {
        create: [
          {
            title: "Docker & Containerization",
            description: "Learn to build, ship, and run applications in containers.",
            estimatedHours: 20,
            order: 1,
            resources: ["https://docs.docker.com"],
            todos: {
              create: [
                { label: "Docker basics and CLI", order: 1 },
                { label: "Write Dockerfiles", order: 2 },
                { label: "Docker Compose for multi-service apps", order: 3 },
              ],
            },
          },
          {
            title: "Kubernetes Orchestration",
            description: "Deploy and manage containerized applications at scale with Kubernetes.",
            estimatedHours: 35,
            order: 2,
            resources: ["https://kubernetes.io/docs"],
            todos: {
              create: [
                { label: "Kubernetes architecture overview", order: 1 },
                { label: "Pods, Deployments, Services", order: 2 },
                { label: "Helm charts and package management", order: 3 },
                { label: "Deploy an app to a K8s cluster", order: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seed complete!");
  console.log(`  Admin: admin@corp.com / admin123`);
  console.log(`  Learner: learner@corp.com / learner123`);
  console.log(`  Roadmaps created: 2`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
