import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Video, Chapter, Transcript, Bookmark, Note } from '@/types';

interface VideoState {
  currentVideo: Video | null;
  playlist: Video[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isBuffering: boolean;
  volume: number;
  playbackRate: number;
  quality: string;
  captions: {
    enabled: boolean;
    language: string;
  };
  chapters: Chapter[];
  currentChapter: Chapter | null;
  transcript: Transcript | null;
  bookmarks: Bookmark[];
  notes: Note[];
  watchHistory: {
    videoId: string;
    timestamp: number;
    date: Date;
  }[];
  isLoading: boolean;
  error: string | null;
}

const initialState: VideoState = {
  currentVideo: null,
  playlist: [],
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isBuffering: false,
  volume: 1,
  playbackRate: 1,
  quality: 'auto',
  captions: {
    enabled: true,
    language: 'en',
  },
  chapters: [],
  currentChapter: null,
  transcript: null,
  bookmarks: [],
  notes: [],
  watchHistory: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchVideo = createAsyncThunk(
  'video/fetch',
  async (videoId: string) => {
    const response = await fetch(`/api/videos/${videoId}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const fetchTranscript = createAsyncThunk(
  'video/fetchTranscript',
  async (videoId: string) => {
    const response = await fetch(`/api/videos/${videoId}/transcript`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const addBookmark = createAsyncThunk(
  'video/addBookmark',
  async ({ videoId, timestamp, note }: {
    videoId: string;
    timestamp: number;
    note?: string;
  }) => {
    const response = await fetch(`/api/videos/${videoId}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp, note }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const removeBookmark = createAsyncThunk(
  'video/removeBookmark',
  async (bookmarkId: string) => {
    const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }
    return bookmarkId;
  },
);

export const addNote = createAsyncThunk(
  'video/addNote',
  async ({ videoId, content, timestamp }: {
    videoId: string;
    content: string;
    timestamp?: number;
  }) => {
    const response = await fetch(`/api/videos/${videoId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, timestamp }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const updateNote = createAsyncThunk(
  'video/updateNote',
  async ({ noteId, content }: { noteId: string; content: string }) => {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

export const deleteNote = createAsyncThunk(
  'video/deleteNote',
  async (noteId: string) => {
    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }
    return noteId;
  },
);

export const updateWatchProgress = createAsyncThunk(
  'video/updateProgress',
  async ({ videoId, timestamp }: { videoId: string; timestamp: number }) => {
    const response = await fetch(`/api/videos/${videoId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
);

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
      // Update current chapter based on timestamp
      const chapter = state.chapters.find(
        (ch) => ch.startTime <= action.payload && ch.endTime > action.payload,
      );
      if (chapter) {
        state.currentChapter = chapter;
      }
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setIsBuffering: (state, action: PayloadAction<boolean>) => {
      state.isBuffering = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = action.payload;
    },
    setQuality: (state, action: PayloadAction<string>) => {
      state.quality = action.payload;
    },
    setCaptions: (state, action: PayloadAction<Partial<VideoState['captions']>>) => {
      state.captions = { ...state.captions, ...action.payload };
    },
    setPlaylist: (state, action: PayloadAction<Video[]>) => {
      state.playlist = action.payload;
    },
    addToWatchHistory: (state, action: PayloadAction<{
      videoId: string;
      timestamp: number;
    }>) => {
      state.watchHistory.push({
        ...action.payload,
        date: new Date(),
      });
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch video
    builder
      .addCase(fetchVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVideo = action.payload.video;
        state.chapters = action.payload.chapters || [];
        state.bookmarks = action.payload.bookmarks || [];
        state.notes = action.payload.notes || [];
      })
      .addCase(fetchVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch video';
      });

    // Fetch transcript
    builder
      .addCase(fetchTranscript.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTranscript.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transcript = action.payload;
      })
      .addCase(fetchTranscript.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch transcript';
      });

    // Add bookmark
    builder
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks.push(action.payload);
      });

    // Remove bookmark
    builder
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter((b) => b.id !== action.payload);
      });

    // Add note
    builder
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      });

    // Update note
    builder
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      });

    // Delete note
    builder
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((n) => n.id !== action.payload);
      });
  },
});

export const {
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setIsBuffering,
  setVolume,
  setPlaybackRate,
  setQuality,
  setCaptions,
  setPlaylist,
  addToWatchHistory,
  clearError,
} = videoSlice.actions;

export default videoSlice.reducer;