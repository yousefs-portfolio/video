// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  profile: UserProfile;
}

export interface UserProfile {
  bio?: string;
  expertise?: string[];
  socialLinks?: SocialLinks;
  preferences: UserPreferences;
  stats: UserStats;
  achievements: Achievement[];
  learningPaths: LearningPath[];
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  playbackSpeed: number;
  captionsEnabled: boolean;
  autoplay: boolean;
  quality: 'auto' | '360p' | '480p' | '720p' | '1080p';
}

export interface UserStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  totalWatchTime: number;
  currentStreak: number;
  longestStreak: number;
  xp: number;
  level: number;
  badges: Badge[];
  certificates: Certificate[];
}

// Gamification Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'course' | 'streak' | 'social' | 'milestone';
  points: number;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  issueDate: Date;
  certificateUrl: string;
  verificationCode: string;
}

export interface LearningStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakHistory: Date[];
  freezesAvailable: number;
  freezesUsed: number;
}

// Course and Video Types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: Instructor;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  ratingsCount: number;
  enrolledCount: number;
  price: number;
  discountedPrice?: number;
  currency: string;
  tags: string[];
  categories: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  sections: CourseSection[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  language: string;
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  videos: Video[];
  quiz?: Quiz;
  assignment?: Assignment;
  resources: Resource[];
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  duration: number;
  url: string;
  thumbnailUrl: string;
  order: number;
  transcript?: Transcript;
  captions?: Caption[];
  chapters?: Chapter[];
  interactions?: VideoInteraction[];
  watchedPercentage?: number;
  lastWatchedAt?: Date;
  bookmarks?: Bookmark[];
  notes?: Note[];
}

export interface Transcript {
  id: string;
  language: string;
  segments: TranscriptSegment[];
}

export interface TranscriptSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  speaker?: string;
  confidence?: number;
}

export interface Caption {
  id: string;
  language: string;
  url: string;
  isDefault: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  thumbnailUrl?: string;
}

export interface VideoInteraction {
  id: string;
  type: 'quiz' | 'poll' | 'hotspot' | 'branching';
  timestamp: number;
  data: any;
}

export interface Bookmark {
  id: string;
  videoId: string;
  timestamp: number;
  note?: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  videoId: string;
  timestamp?: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Learning Path Types
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  courses: Course[];
  progress: number;
  currentCourseId?: string;
  completedCourseIds: string[];
  startedAt?: Date;
  targetCompletionDate?: Date;
}

// Quiz and Assessment Types
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
  attempts?: QuizAttempt[];
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'code';
  text: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
  hint?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Answer[];
  score: number;
  passed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface Answer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  points?: number;
}

// Assignment Types
export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate?: Date;
  maxPoints: number;
  rubric?: Rubric;
  submissions?: Submission[];
}

export interface Rubric {
  criteria: RubricCriterion[];
}

export interface RubricCriterion {
  name: string;
  description: string;
  maxPoints: number;
}

export interface Submission {
  id: string;
  userId: string;
  assignmentId: string;
  content: string;
  attachments?: string[];
  submittedAt: Date;
  grade?: Grade;
}

export interface Grade {
  score: number;
  feedback: string;
  gradedBy: string;
  gradedAt: Date;
}

// Resource Types
export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'document' | 'link' | 'download';
  url: string;
  size?: number;
  description?: string;
}

// Instructor Types
export interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  expertise: string[];
  rating: number;
  studentsCount: number;
  coursesCount: number;
  socialLinks?: SocialLinks;
}

// Discussion and Social Types
export interface Discussion {
  id: string;
  courseId: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies: Reply[];
  tags: string[];
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies?: Reply[];
}

// Study Group Types
export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  courseId: string;
  members: User[];
  maxMembers: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  meetingSchedule?: MeetingSchedule;
  sharedNotes: Note[];
  groupGoals: Goal[];
}

export interface MeetingSchedule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number;
  time: string;
  duration: number;
  meetingUrl?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  progress: number;
  completed: boolean;
  completedAt?: Date;
}

// Analytics Types
export interface CourseAnalytics {
  courseId: string;
  views: number;
  uniqueViewers: number;
  completionRate: number;
  averageWatchTime: number;
  engagementScore: number;
  dropOffPoints: DropOffPoint[];
  heatmap: HeatmapData[];
  studentFeedback: Feedback[];
}

export interface DropOffPoint {
  timestamp: number;
  percentage: number;
  count: number;
}

export interface HeatmapData {
  timestamp: number;
  engagement: number;
  replays: number;
}

export interface Feedback {
  userId: string;
  rating: number;
  comment?: string;
  helpful: number;
  createdAt: Date;
}

// Progress Tracking Types
export interface Progress {
  courseId: string;
  userId: string;
  overallProgress: number;
  sectionsProgress: SectionProgress[];
  lastAccessedAt: Date;
  estimatedCompletionDate?: Date;
  certificateEarned: boolean;
}

export interface SectionProgress {
  sectionId: string;
  progress: number;
  videosWatched: string[];
  quizzesTaken: string[];
  assignmentsSubmitted: string[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'course' | 'achievement' | 'social' | 'reminder' | 'system';
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: Date;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  plan: 'monthly' | 'yearly' | 'lifetime';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentHistory: Payment[];
}