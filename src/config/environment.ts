import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  API_URL: z.string().url().default('http://localhost:3000/api'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),

  // Database
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z.string().default('5432'),
  POSTGRES_DB: z.string().default('video_platform'),
  POSTGRES_USER: z.string().default('admin'),
  POSTGRES_PASSWORD: z.string().min(1),

  MONGODB_URI: z.string().url(),

  TIMESCALE_HOST: z.string().default('localhost'),
  TIMESCALE_PORT: z.string().default('5433'),
  TIMESCALE_DB: z.string().default('video_metrics'),
  TIMESCALE_USER: z.string().default('admin'),
  TIMESCALE_PASSWORD: z.string().min(1),

  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().optional(),

  ELASTICSEARCH_NODE: z.string().url().default('http://localhost:9200'),

  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),

  // AWS (optional in development)
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_CLOUDFRONT_DOMAIN: z.string().optional(),

  // MinIO (for local development)
  MINIO_ENDPOINT: z.string().default('localhost:9000'),
  MINIO_ACCESS_KEY: z.string().default('minio_admin'),
  MINIO_SECRET_KEY: z.string().default('secure_password_123'),
  MINIO_BUCKET: z.string().default('videos'),
  MINIO_USE_SSL: z.string().transform(val => val === 'true').default('false'),

  // OpenAI
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4'),
  OPENAI_MAX_TOKENS: z.string().transform(Number).default('2000'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // Search
  ALGOLIA_APP_ID: z.string().optional(),
  ALGOLIA_API_KEY: z.string().optional(),
  ALGOLIA_INDEX_NAME: z.string().optional(),

  // Error tracking
  SENTRY_DSN: z.string().optional(),

  // Analytics
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  MIXPANEL_TOKEN: z.string().optional(),

  // Video Processing
  VIDEO_ENCODING_PRESET: z.string().default('hls_720p'),
  VIDEO_MAX_UPLOAD_SIZE: z.string().transform(Number).default('5368709120'),
  VIDEO_ALLOWED_FORMATS: z.string().default('mp4,mov,avi,mkv,webm'),

  // Security
  CORS_ORIGINS: z.string().default('http://localhost:5173,http://localhost:3000'),
  SESSION_SECRET: z.string().min(32).optional(),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'),

  // Feature Flags
  ENABLE_AI_FEATURES: z.string().transform(val => val === 'true').default('true'),
  ENABLE_SOCIAL_FEATURES: z.string().transform(val => val === 'true').default('true'),
  ENABLE_GAMIFICATION: z.string().transform(val => val === 'true').default('true'),
  ENABLE_LIVE_STREAMING: z.string().transform(val => val === 'true').default('false'),
  ENABLE_OFFLINE_MODE: z.string().transform(val => val === 'true').default('true'),

  // Cache
  CACHE_TTL_DEFAULT: z.string().transform(Number).default('3600'),
  CACHE_TTL_USER: z.string().transform(Number).default('1800'),
  CACHE_TTL_COURSE: z.string().transform(Number).default('7200'),

  // Pagination
  DEFAULT_PAGE_SIZE: z.string().transform(Number).default('20'),
  MAX_PAGE_SIZE: z.string().transform(Number).default('100'),

  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('104857600'),
  ALLOWED_IMAGE_FORMATS: z.string().default('jpg,jpeg,png,gif,webp'),
  ALLOWED_DOCUMENT_FORMATS: z.string().default('pdf,doc,docx,ppt,pptx,xls,xlsx'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('debug'),
  LOG_FILE_PATH: z.string().default('./logs'),
  LOG_MAX_FILES: z.string().transform(Number).default('14'),
  LOG_MAX_SIZE: z.string().default('20m'),
});

// Validate and parse environment variables
const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    throw new Error('Invalid environment configuration');
  }

  return result.data;
};

// Export configuration object
export const config = parseEnv();

// Helper functions for environment-specific logic
export const isDevelopment = () => config.NODE_ENV === 'development';
export const isProduction = () => config.NODE_ENV === 'production';
export const isTest = () => config.NODE_ENV === 'test';

// Database connection strings
export const getPostgresUrl = () => 
  `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`;

export const getTimescaleUrl = () =>
  `postgresql://${config.TIMESCALE_USER}:${config.TIMESCALE_PASSWORD}@${config.TIMESCALE_HOST}:${config.TIMESCALE_PORT}/${config.TIMESCALE_DB}`;

export const getRedisUrl = () => {
  if (config.REDIS_PASSWORD) {
    return `redis://:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`;
  }
  return `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`;
};

// Feature flags
export const features = {
  ai: config.ENABLE_AI_FEATURES,
  social: config.ENABLE_SOCIAL_FEATURES,
  gamification: config.ENABLE_GAMIFICATION,
  liveStreaming: config.ENABLE_LIVE_STREAMING,
  offlineMode: config.ENABLE_OFFLINE_MODE,
};

// Storage configuration
export const storage = {
  isLocal: !config.AWS_ACCESS_KEY_ID,
  endpoint: config.AWS_ACCESS_KEY_ID ? undefined : config.MINIO_ENDPOINT,
  accessKey: config.AWS_ACCESS_KEY_ID || config.MINIO_ACCESS_KEY,
  secretKey: config.AWS_SECRET_ACCESS_KEY || config.MINIO_SECRET_KEY,
  bucket: config.AWS_S3_BUCKET || config.MINIO_BUCKET,
  region: config.AWS_REGION || 'us-east-1',
  useSSL: config.AWS_ACCESS_KEY_ID ? true : config.MINIO_USE_SSL,
};

// CORS configuration
export const corsOptions = {
  origin: config.CORS_ORIGINS.split(',').map(origin => origin.trim()),
  credentials: true,
  optionsSuccessStatus: 200,
};

// Rate limiting configuration
export const rateLimitOptions = {
  windowMs: config.RATE_LIMIT_WINDOW,
  max: config.RATE_LIMIT_MAX,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};

// File upload configuration
export const uploadConfig = {
  maxFileSize: config.MAX_FILE_SIZE,
  videoFormats: config.VIDEO_ALLOWED_FORMATS.split(','),
  imageFormats: config.ALLOWED_IMAGE_FORMATS.split(','),
  documentFormats: config.ALLOWED_DOCUMENT_FORMATS.split(','),
  videoMaxSize: config.VIDEO_MAX_UPLOAD_SIZE,
};

// Cache configuration
export const cacheConfig = {
  ttl: {
    default: config.CACHE_TTL_DEFAULT,
    user: config.CACHE_TTL_USER,
    course: config.CACHE_TTL_COURSE,
  },
};

// Pagination configuration  
export const paginationConfig = {
  defaultPageSize: config.DEFAULT_PAGE_SIZE,
  maxPageSize: config.MAX_PAGE_SIZE,
};

export default config;