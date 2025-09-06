import { User } from '@/types';
import { v4 as uuid } from 'uuid';

const STORAGE_KEYS = {
  token: 'token',
  user: 'auth:user',
};

export interface AuthResponse {
  token: string;
  user: User;
}

function nowISO(): string {
  return new Date().toISOString();
}

function buildUser(partial: Partial<User> & { email: string; name: string }): User {
  const ts = new Date();
  return {
    id: partial.id || uuid(),
    email: partial.email,
    name: partial.name,
    avatar: partial.avatar,
    role: partial.role || 'student',
    createdAt: ts,
    updatedAt: ts,
    profile: {
      bio: '',
      expertise: [],
      socialLinks: {},
      preferences: {
        theme: 'system',
        language: 'en',
        emailNotifications: true,
        pushNotifications: false,
        playbackSpeed: 1,
        captionsEnabled: true,
        autoplay: false,
        quality: 'auto',
      },
      stats: {
        coursesEnrolled: 0,
        coursesCompleted: 0,
        totalWatchTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        xp: 0,
        level: 1,
        badges: [],
        certificates: [],
      },
      achievements: [],
      learningPaths: [],
    },
  };
}

export const authService = {
  async login({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
    // Simple mock: accept any email/password; if existing user in storage, reuse; else create
    const existing = localStorage.getItem(STORAGE_KEYS.user);
    let user: User | null = existing ? JSON.parse(existing) : null;

    if (!user) {
      user = buildUser({ email, name: email.split('@')[0] });
    }

    const token = `mock.${btoa(email)}.${btoa(nowISO())}`;
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));

    return { token, user };
  },

  async register({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> {
    const user = buildUser({ email, name });
    const token = `mock.${btoa(email)}.${btoa(nowISO())}`;
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    return { token, user };
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.token);
    // keep user to simulate remember profile; optional: remove user as well
  },

  async me(token: string): Promise<{ user: User }> {
    const storedToken = localStorage.getItem(STORAGE_KEYS.token);
    if (!storedToken || storedToken !== token) {
      throw new Error('Invalid token');
    }
    const userStr = localStorage.getItem(STORAGE_KEYS.user);
    if (!userStr) throw new Error('User not found');
    const user: User = JSON.parse(userStr);
    return { user };
  },
};
