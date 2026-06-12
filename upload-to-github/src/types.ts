export interface BilingualText {
  en: string;
  am: string;
}

export interface Experience {
  id: string;
  company: BilingualText;
  role: BilingualText;
  period: string;
  location: string;
  ref: string;
  description: BilingualText;
  docPages: number[];
  certificateImage?: string; // Optional path to embedded certificate image
}

export interface EducationItem {
  id: string;
  title: BilingualText;
  institution: BilingualText;
  period: BilingualText;
  subDetails: BilingualText;
  badge?: string;
  accreditation?: BilingualText;
}

export interface SkillItem {
  name: BilingualText;
  writing: number;
  speaking: number;
  reading: number;
}
