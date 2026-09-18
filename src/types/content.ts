// ============================================================
// NK Portfolio — Content Type Definitions
// ============================================================

export interface Profile {
  name: string;
  degree: string;
  introText: string;
  profileImageUrl: string | null;
  /** Processed cutout image (background removed) — null until processed */
  profileCutoutUrl: string | null;
}

export interface EducationEntry {
  id: string;
  level: 'schooling' | 'graduation';
  institutionName: string;
  location: string;
  fieldOrBoard: string;
  yearRange: string;
  description?: string;
}

export interface Skills {
  languages: string[];
  tools: string[];
  platforms: string[];
  softSkills: string[];
}

export interface Interest {
  id: string;
  title: string;
  description?: string;
}

export interface Certification {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  documentUrl: string | null;
  documentName?: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  mediaType: 'image' | 'video' | 'ppt' | 'doc' | null;
  mediaUrl: string | null;
  mediaName?: string | null;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  email: string;
}

export interface ResumeInfo {
  fileUrl: string | null;
  fileName: string | null;
  uploadedAt: string | null;
}

export interface LogoConfig {
  imageUrl: string | null;
}

export interface ElementLayout {
  id: string;
  position: { x: number; y: number };
  fontSize?: number;
}

export interface PortfolioContent {
  profile: Profile;
  education: EducationEntry[];
  skills: Skills;
  interests: Interest[];
  certifications: Certification[];
  projects: Project[];
  contact: ContactInfo;
  resume: ResumeInfo;
  logo: LogoConfig;
  backgroundImageUrl: string | null;
}

export type FontSizeMap = Record<string, number>;
export type PositionMap = Record<string, { x: number; y: number }>;
