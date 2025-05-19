import { 
  User, UserRole, Department, Interview, InterviewType, 
  Candidate, TimeMetric, CandidatePerformance, Integration,
  Permission 
} from '../types';

// Mock Permissions
export const mockPermissions: Permission[] = [
  { id: 'p1', name: 'create_department', description: 'Create departments' },
  { id: 'p2', name: 'edit_department', description: 'Edit departments' },
  { id: 'p3', name: 'delete_department', description: 'Delete departments' },
  { id: 'p4', name: 'view_department', description: 'View departments' },
  { id: 'p5', name: 'create_interview', description: 'Create interviews' },
  { id: 'p6', name: 'edit_interview', description: 'Edit interviews' },
  { id: 'p7', name: 'delete_interview', description: 'Delete interviews' },
  { id: 'p8', name: 'view_interview', description: 'View interviews' },
  { id: 'p9', name: 'view_candidate', description: 'View candidates' },
  { id: 'p10', name: 'create_user', description: 'Create users' },
  { id: 'p11', name: 'edit_user', description: 'Edit users' },
  { id: 'p12', name: 'delete_user', description: 'Delete users' },
  { id: 'p13', name: 'view_user', description: 'View users' },
  { id: 'p14', name: 'view_analytics', description: 'View analytics' },
  { id: 'p15', name: 'manage_settings', description: 'Manage settings' },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'admin@example.com',
    password: 'Password@123',
    role: UserRole.SUPER_ADMIN,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    permissions: mockPermissions,
  },
  {
    id: 'u2',
    name: 'Sarah Williams',
    email: 'hradmin@example.com',
    password: 'Password@123',
    role: UserRole.ADMIN,
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    department: 'd1',
    permissions: mockPermissions.filter(p => p.id !== 'p15'),
  },
  {
    id: 'u3',
    name: 'Michael Davis',
    email: 'manager@example.com',
    password: 'Password@123',
    role: UserRole.HIRING_MANAGER,
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    department: 'd2',
    permissions: mockPermissions.filter(p => ['p4', 'p8', 'p9', 'p14'].includes(p.id)),
  },
  {
    id: 'u4',
    name: 'Emily Chen',
    email: 'candidate@example.com',
    password: 'Password@123',
    role: UserRole.CANDIDATE,
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    permissions: [],
  },
];

// Mock Departments
export const mockDepartments: Department[] = [
  {
    id: 'd1',
    name: 'Engineering',
    description: 'Software engineering and development team',
    managerId: 'u3',
    createdAt: '2023-01-10T08:30:00Z',
    updatedAt: '2023-01-10T08:30:00Z',
  },
  {
    id: 'd2',
    name: 'Marketing',
    description: 'Marketing and brand management',
    managerId: 'u3',
    createdAt: '2023-01-12T10:15:00Z',
    updatedAt: '2023-01-12T10:15:00Z',
  },
  {
    id: 'd3',
    name: 'Human Resources',
    description: 'HR operations and talent management',
    createdAt: '2023-01-15T14:45:00Z',
    updatedAt: '2023-01-15T14:45:00Z',
  },
  {
    id: 'd4',
    name: 'Finance',
    description: 'Financial operations and accounting',
    createdAt: '2023-01-20T09:00:00Z',
    updatedAt: '2023-01-20T09:00:00Z',
  },
  {
    id: 'd5',
    name: 'Product Management',
    description: 'Product strategy and roadmap',
    createdAt: '2023-02-05T11:30:00Z',
    updatedAt: '2023-02-05T11:30:00Z',
  },
];

// Mock Interviews
export const mockInterviews: Interview[] = [
  {
    id: 'i1',
    name: 'Senior Frontend Developer',
    departmentId: 'd1',
    jobDescription: 'We are looking for a senior frontend developer with 5+ years of experience in React, TypeScript, and modern CSS.',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: InterviewType.LLM_BASED,
    verifyId: true,
    createdAt: '2023-03-10T13:00:00Z',
    updatedAt: '2023-03-10T13:00:00Z',
    createdBy: 'u1',
  },
  {
    id: 'i2',
    name: 'Marketing Specialist',
    departmentId: 'd2',
    jobDescription: 'We are seeking a marketing specialist with experience in digital campaigns and social media management.',
    imageUrl: 'https://images.pexels.com/photos/1056553/pexels-photo-1056553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: InterviewType.MANUAL,
    questions: [
      {
        id: 'q1',
        content: 'Describe your experience with social media campaigns.',
        format: 'text',
      },
      {
        id: 'q2',
        content: 'What metrics do you use to measure campaign success?',
        format: 'text',
      },
    ],
    verifyId: false,
    createdAt: '2023-03-15T09:30:00Z',
    updatedAt: '2023-03-15T09:30:00Z',
    createdBy: 'u2',
  },
  {
    id: 'i3',
    name: 'Data Scientist',
    departmentId: 'd1',
    jobDescription: 'We are looking for a data scientist with expertise in machine learning, Python, and data visualization.',
    imageUrl: 'https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: InterviewType.LLM_BASED,
    verifyId: true,
    createdAt: '2023-04-05T14:15:00Z',
    updatedAt: '2023-04-05T14:15:00Z',
    createdBy: 'u1',
  },
  {
    id: 'i4',
    name: 'HR Coordinator',
    departmentId: 'd3',
    jobDescription: 'We need an HR coordinator to assist with recruitment, onboarding, and employee relations.',
    imageUrl: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    type: InterviewType.MANUAL,
    questions: [
      {
        id: 'q3',
        content: 'Describe your experience with employee onboarding processes.',
        format: 'text',
      },
      {
        id: 'q4',
        content: 'How do you handle confidential employee information?',
        format: 'text',
      },
    ],
    verifyId: false,
    createdAt: '2023-04-10T10:45:00Z',
    updatedAt: '2023-04-10T10:45:00Z',
    createdBy: 'u2',
  },
];

// Mock Candidates
export const mockCandidates: Candidate[] = [
  {
    id: 'c1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1-555-123-4567',
    resumeUrl: '/resumes/john-smith.pdf',
    interviewId: 'i1',
    overallScore: 85,
    fraudScore: 5,
    recommended: true,
    responses: [
      {
        questionId: 'q1',
        answer: 'I have 6 years of experience working with React and modern frontend technologies.',
        score: 90,
        feedback: 'Strong technical knowledge demonstrated.',
      },
    ],
    behaviourReport: 'Candidate displayed confidence and strong communication skills throughout the interview.',
    completedAt: '2023-05-15T11:30:00Z',
    interviewedDate: '2023-05-15',
  },
  {
    id: 'c2',
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com',
    phone: '+1-555-234-5678',
    resumeUrl: '/resumes/emma-johnson.pdf',
    interviewId: 'i2',
    overallScore: 78,
    fraudScore: 12,
    recommended: true,
    responses: [
      {
        questionId: 'q1',
        answer: 'I have managed social media campaigns for several brands, focusing on Instagram and TikTok.',
        score: 80,
        feedback: 'Good practical experience with social media platforms.',
      },
      {
        questionId: 'q2',
        answer: 'I focus on engagement rates, click-through rates, and conversion metrics to measure success.',
        score: 75,
        feedback: 'Solid understanding of relevant metrics but could be more comprehensive.',
      },
    ],
    behaviourReport: 'Candidate was enthusiastic and provided concrete examples from past work.',
    completedAt: '2023-05-18T14:45:00Z',
    interviewedDate: '2023-05-18',
  },
  {
    id: 'c3',
    name: 'David Lee',
    email: 'david.lee@example.com',
    phone: '+1-555-345-6789',
    resumeUrl: '/resumes/david-lee.pdf',
    interviewId: 'i1',
    overallScore: 62,
    fraudScore: 35,
    recommended: false,
    responses: [
      {
        questionId: 'q1',
        answer: 'I worked with React for about 3 years in my previous job.',
        score: 60,
        feedback: 'Basic understanding of required technologies but lacks depth.',
      },
    ],
    behaviourReport: 'Candidate struggled to answer technical questions and seemed nervous.',
    completedAt: '2023-05-20T09:00:00Z',
    interviewedDate: '2023-05-20',
  },
  {
    id: 'c4',
    name: 'Sophia Garcia',
    email: 'sophia.garcia@example.com',
    phone: '+1-555-456-7890',
    resumeUrl: '/resumes/sophia-garcia.pdf',
    interviewId: 'i3',
    overallScore: 92,
    fraudScore: 3,
    recommended: true,
    responses: [
      {
        questionId: 'q1',
        answer: 'I have extensive experience in machine learning model development and deployment using Python and TensorFlow.',
        score: 95,
        feedback: 'Exceptional technical skills and relevant experience.',
      },
      {
        questionId: 'q2',
        answer: 'I worked on a project to predict customer churn, which involved handling large datasets and implementing various machine learning algorithms.',
        score: 90,
        feedback: 'Provided a detailed and insightful explanation of a complex project.',
      },
    ],
    behaviourReport: 'Candidate was articulate and demonstrated strong problem-solving skills.',
    completedAt: '2023-06-01T10:00:00Z',
    interviewedDate: '2023-06-01',
  },
];

// Mock Time Metrics for Analytics
export const mockTimeMetrics: TimeMetric[] = [
  {
    period: 'Week 1',
    hoursSaved: 50
  },
  {
    period: 'Week 2',
    hoursSaved: 60
  },
  {
    period: 'Week 3',
    hoursSaved: 55
  },
  {
    period: 'Week 4',
    hoursSaved: 70
  },
];

// Mock Candidate Performance for Analytics
export const mockCandidatePerformance: CandidatePerformance[] = [
  {
    interviewId: 'i1',
    interviewName: 'Senior Frontend Developer',
    averageScore: 73.5,
    candidateCount: 2,
    topPerformer: {
      candidateId: 'c1',
      candidateName: 'John Smith',
      score: 85,
    },
  },
  {
    interviewId: 'i2',
    interviewName: 'Marketing Specialist',
    averageScore: 76.5,
    candidateCount: 1,
    topPerformer: {
      candidateId: 'c2',
      candidateName: 'Emma Johnson',
      score: 78,
    },
  },
  {
    interviewId: 'i3',
    interviewName: 'Data Scientist',
    averageScore: 92,
    candidateCount: 1,
    topPerformer: {
      candidateId: 'c4',
      candidateName: 'Sophia Garcia',
      score: 92,
    },
  },
];

// Mock Integrations for Settings
export const mockIntegrations: Integration[] = [
  {
    id: 'int1',
    name: 'OpenAI GPT-4',
    type: 'llm',
    isConnected: true,
    lastSynced: '2023-10-26T10:00:00Z'
  },
  {
    id: 'int2',
    name: 'Google Talent',
    type: 'ats',
    isConnected: false,
    lastSynced: undefined
  },
  {
    id: 'int3',
    name: 'LinkedIn Jobs',
    type: 'job_portal',
    isConnected: true,
    lastSynced: '2023-05-28T09:45:00Z',
  },
  {
    id: 'int4',
    name: 'Anthropic Claude',
    type: 'llm',
    isConnected: false,
  },
  {
    id: 'int5',
    name: 'Indeed',
    type: 'job_portal',
    isConnected: false,
  },
];