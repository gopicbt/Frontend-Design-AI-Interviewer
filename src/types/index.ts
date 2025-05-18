// User Types
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  HIRING_MANAGER = 'hiring_manager',
  CANDIDATE = 'candidate'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

// Department Types
export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Interview Types
export enum InterviewType {
  LLM_BASED = 'llm_based',
  MANUAL = 'manual'
}

export interface Interview {
  id: string;
  name: string;
  departmentId: string;
  jobDescription: string;
  imageUrl?: string;
  type: InterviewType;
  questions?: Question[];
  verifyId: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Question {
  id: string;
  content: string;
  format: 'text' | 'multiple_choice' | 'yes_no';
  options?: string[];
  correctAnswer?: string;
}

// Candidate Types
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  interviewId: string;
  overallScore: number;
  fraudScore: number;
  recommended: boolean;
  responses: Response[];
  behaviourReport?: string;
  completedAt: string;
}

export interface Response {
  questionId: string;
  answer: string;
  score: number;
  feedback?: string;
}

// Analytics Types
export interface TimeMetric {
  period: string;
  hoursSaved: number;
}

export interface CandidatePerformance {
  interviewId: string;
  interviewName: string;
  averageScore: number;
  candidateCount: number;
  topPerformer: {
    candidateId: string;
    candidateName: string;
    score: number;
  };
}

// Settings Types
export interface Integration {
  id: string;
  name: string;
  type: 'llm' | 'ats' | 'job_portal';
  isConnected: boolean;
  lastSynced?: string;
}