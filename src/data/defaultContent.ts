import type { PortfolioContent } from '../types/content';

// ============================================================
// NK Portfolio — Default / Seed Content
// ============================================================
// Replace these placeholders with real data.
// This file is also the fallback when localStorage has no content.
// ============================================================

const SEASHORE_BG =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&auto=format&fit=crop';

export const defaultContent: PortfolioContent = {
  profile: {
    name: 'Nadin K',
    degree: 'Bachelor of Computer Applications (BCA)',
    introText:
      "Hi, I'm Nadin — a passionate developer and lifelong learner who loves turning ideas into clean, thoughtful digital experiences. I bring curiosity, creativity, and a commitment to quality to every project I work on. When I'm not coding, you'll find me exploring new technologies, sketching UI concepts, or enjoying a good walk by the sea.",
    profileImageUrl: null,
    profileCutoutUrl: null,
  },

  education: [
    {
      id: 'edu-1',
      level: 'schooling',
      institutionName: 'St. Mary\'s Higher Secondary School',
      location: 'Kochi, Kerala',
      fieldOrBoard: 'CBSE — Science (PCM + CS)',
      yearRange: '2015 – 2021',
      description: 'Graduated with distinction. Active member of the Computer Club and Science Society.',
    },
    {
      id: 'edu-2',
      level: 'graduation',
      institutionName: 'Christ College (Autonomous)',
      location: 'Irinjalakuda, Kerala',
      fieldOrBoard: 'Bachelor of Computer Applications (BCA)',
      yearRange: '2021 – 2024',
      description:
        'Specialisation in Full-Stack Development and Data Structures. Final-year project on real-time collaborative web apps.',
    },
  ],

  skills: {
    languages: ['JavaScript', 'TypeScript', 'Python', 'HTML5', 'CSS3', 'SQL'],
    tools: ['React', 'Node.js', 'Vite', 'Git', 'Figma', 'VS Code', 'Postman'],
    platforms: ['GitHub', 'Vercel', 'Firebase', 'Linux', 'Windows'],
    softSkills: [
      'Problem Solving',
      'Team Collaboration',
      'Communication',
      'Adaptability',
      'Time Management',
      'Creative Thinking',
      'Attention to Detail',
    ],
  },

  interests: [
    {
      id: 'int-1',
      title: 'Web Development',
      description: 'Building responsive, accessible, and performant web interfaces is my core passion.',
    },
    {
      id: 'int-2',
      title: 'UI/UX Design',
      description: 'I enjoy blending aesthetics and usability — crafting experiences that feel effortless.',
    },
    {
      id: 'int-3',
      title: 'Open Source',
      description: 'Contributing to and learning from open-source projects keeps me sharp and connected to the community.',
    },
    {
      id: 'int-4',
      title: 'Photography',
      description: 'Capturing moments in nature — especially coastal landscapes — is how I recharge.',
    },
  ],

  certifications: [
    {
      id: 'cert-1',
      title: 'Responsive Web Design',
      description:
        'freeCodeCamp — 300 hours of project-based training covering HTML5, CSS3, Flexbox, Grid, and accessibility best practices.',
      imageUrl: null,
      documentUrl: null,
      documentName: null,
    },
    {
      id: 'cert-2',
      title: 'JavaScript Algorithms & Data Structures',
      description:
        'freeCodeCamp — Deep dive into ES6+, OOP, functional programming, algorithm design, and data structure fundamentals.',
      imageUrl: null,
      documentUrl: null,
      documentName: null,
    },
    {
      id: 'cert-3',
      title: 'React — The Complete Guide',
      description:
        'Udemy (Maximilian Schwarzmüller) — Hooks, Context API, Redux, Next.js basics, and building production-grade React apps.',
      imageUrl: null,
      documentUrl: null,
      documentName: null,
    },
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'CollabDocs — Real-Time Collaborative Editor',
      description:
        'A Google Docs-inspired web app enabling multiple users to edit the same document simultaneously. Built with React, Node.js, Socket.io, and MongoDB. Features live cursors, presence indicators, and offline-first sync.',
      githubUrl: 'https://github.com/nadin-k',
      mediaType: null,
      mediaUrl: null,
      mediaName: null,
    },
    {
      id: 'proj-2',
      title: 'TideTrack — Beach Condition Dashboard',
      description:
        'A real-time dashboard pulling tidal, wave-height, and weather data from public APIs, displaying interactive charts and alerts for a curated list of Kerala beaches. Built with TypeScript, React, and Recharts.',
      githubUrl: 'https://github.com/nadin-k',
      mediaType: null,
      mediaUrl: null,
      mediaName: null,
    },
    {
      id: 'proj-3',
      title: 'DevLinkup — Developer Networking App',
      description:
        'A LinkedIn-inspired micro-networking app for developers to share projects, find collaborators, and exchange mentorship. Features JWT auth, Firebase Firestore, and a React Native mobile companion.',
      githubUrl: 'https://github.com/nadin-k',
      mediaType: null,
      mediaUrl: null,
      mediaName: null,
    },
  ],

  contact: {
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    linkedin: 'https://linkedin.com/in/nadin-k',
    github: 'https://github.com/nadin-k',
    email: 'nadin.k@example.com',
  },

  resume: {
    fileUrl: null,
    fileName: null,
    uploadedAt: null,
  },

  logo: {
    imageUrl: null,
  },

  backgroundImageUrl: SEASHORE_BG,
};
