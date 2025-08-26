import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Course, Progress } from '@/types';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  enrolledCourses: Course[];
  progress: Record<string, Progress>;
  searchResults: Course[];
  isLoading: boolean;
  error: string | null;
  filters: {
    difficulty: string[];
    categories: string[];
    priceRange: [number, number];
    rating: number;
    duration: [number, number];
  };
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  enrolledCourses: [],
  progress: {},
  searchResults: [],
  isLoading: false,
  error: null,
  filters: {
    difficulty: [],
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
    duration: [0, 100],
  },
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  'course/fetchAll',
  async (params?: { page?: number; limit?: number; filters?: any }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await fetch(`/api/courses?${queryParams}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const fetchCourseById = createAsyncThunk(
  'course/fetchById',
  async (courseId: string) => {
    const response = await fetch(`/api/courses/${courseId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const enrollInCourse = createAsyncThunk(
  'course/enroll',
  async (courseId: string) => {
    const response = await fetch(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const fetchEnrolledCourses = createAsyncThunk(
  'course/fetchEnrolled',
  async () => {
    const response = await fetch('/api/courses/enrolled');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const searchCourses = createAsyncThunk(
  'course/search',
  async (query: string) => {
    const response = await fetch(`/api/courses/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const updateProgress = createAsyncThunk(
  'course/updateProgress',
  async ({ courseId, sectionId, videoId }: {
    courseId: string;
    sectionId: string;
    videoId: string;
  }) => {
    const response = await fetch(`/api/courses/${courseId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionId, videoId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const fetchCourseProgress = createAsyncThunk(
  'course/fetchProgress',
  async (courseId: string) => {
    const response = await fetch(`/api/courses/${courseId}/progress`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CourseState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.courses;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch courses';
      });

    // Fetch course by ID
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch course';
      });

    // Enroll in course
    builder
      .addCase(enrollInCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrolledCourses.push(action.payload.course);
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to enroll in course';
      });

    // Fetch enrolled courses
    builder
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrolledCourses = action.payload.courses;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch enrolled courses';
      });

    // Search courses
    builder
      .addCase(searchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.courses;
      })
      .addCase(searchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Search failed';
      });

    // Update progress
    builder
      .addCase(updateProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        const { courseId, progress } = action.payload;
        state.progress[courseId] = progress;
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update progress';
      });

    // Fetch course progress
    builder
      .addCase(fetchCourseProgress.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        const { courseId, progress } = action.payload;
        state.progress[courseId] = progress;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch progress';
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearSearchResults,
  clearError,
} = courseSlice.actions;

export default courseSlice.reducer;