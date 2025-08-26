// MongoDB initialization script for video analytics

// Switch to the video_analytics database
db = db.getSiblingDB('video_analytics');

// Create collections with validation schemas
db.createCollection('watch_sessions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'videoId', 'courseId', 'startTime'],
      properties: {
        userId: {
          bsonType: 'string',
          description: 'User UUID'
        },
        videoId: {
          bsonType: 'string',
          description: 'Video UUID'
        },
        courseId: {
          bsonType: 'string',
          description: 'Course UUID'
        },
        sessionId: {
          bsonType: 'string',
          description: 'Unique session identifier'
        },
        startTime: {
          bsonType: 'date',
          description: 'Session start time'
        },
        endTime: {
          bsonType: 'date',
          description: 'Session end time'
        },
        duration: {
          bsonType: 'int',
          description: 'Total watch duration in seconds'
        },
        events: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              type: { bsonType: 'string' },
              timestamp: { bsonType: 'date' },
              position: { bsonType: 'int' },
              data: { bsonType: 'object' }
            }
          }
        },
        interactions: {
          bsonType: 'object',
          properties: {
            pauses: { bsonType: 'int' },
            seeks: { bsonType: 'int' },
            speedChanges: { bsonType: 'int' },
            fullscreenToggles: { bsonType: 'int' }
          }
        },
        heatmap: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              position: { bsonType: 'int' },
              views: { bsonType: 'int' }
            }
          }
        },
        device: {
          bsonType: 'object',
          properties: {
            type: { bsonType: 'string' },
            browser: { bsonType: 'string' },
            os: { bsonType: 'string' },
            screenResolution: { bsonType: 'string' }
          }
        },
        network: {
          bsonType: 'object',
          properties: {
            connectionType: { bsonType: 'string' },
            bandwidth: { bsonType: 'double' },
            bufferingEvents: { bsonType: 'int' }
          }
        },
        quality: {
          bsonType: 'object',
          properties: {
            resolution: { bsonType: 'string' },
            bitrate: { bsonType: 'int' },
            qualityChanges: { bsonType: 'int' }
          }
        }
      }
    }
  }
});

db.createCollection('learning_analytics', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'date'],
      properties: {
        userId: {
          bsonType: 'string',
          description: 'User UUID'
        },
        date: {
          bsonType: 'date',
          description: 'Analytics date'
        },
        dailyStats: {
          bsonType: 'object',
          properties: {
            watchTime: { bsonType: 'int' },
            videosWatched: { bsonType: 'int' },
            coursesAccessed: { bsonType: 'array' },
            xpEarned: { bsonType: 'int' },
            achievementsUnlocked: { bsonType: 'array' },
            quizzesCompleted: { bsonType: 'int' },
            averageQuizScore: { bsonType: 'double' },
            notesCreated: { bsonType: 'int' },
            discussionPosts: { bsonType: 'int' }
          }
        },
        learningPatterns: {
          bsonType: 'object',
          properties: {
            preferredTimeSlots: { bsonType: 'array' },
            averageSessionLength: { bsonType: 'int' },
            mostWatchedCategories: { bsonType: 'array' },
            learningVelocity: { bsonType: 'double' },
            completionRate: { bsonType: 'double' }
          }
        },
        engagement: {
          bsonType: 'object',
          properties: {
            focusScore: { bsonType: 'double' },
            interactionRate: { bsonType: 'double' },
            retentionScore: { bsonType: 'double' },
            socialEngagement: { bsonType: 'double' }
          }
        }
      }
    }
  }
});

db.createCollection('course_analytics', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['courseId', 'date'],
      properties: {
        courseId: {
          bsonType: 'string',
          description: 'Course UUID'
        },
        date: {
          bsonType: 'date',
          description: 'Analytics date'
        },
        metrics: {
          bsonType: 'object',
          properties: {
            enrollments: { bsonType: 'int' },
            activeStudents: { bsonType: 'int' },
            completions: { bsonType: 'int' },
            averageProgress: { bsonType: 'double' },
            averageRating: { bsonType: 'double' },
            totalWatchTime: { bsonType: 'int' },
            revenue: { bsonType: 'double' }
          }
        },
        studentEngagement: {
          bsonType: 'object',
          properties: {
            averageSessionLength: { bsonType: 'int' },
            dropOffPoints: { bsonType: 'array' },
            mostReplayedSections: { bsonType: 'array' },
            discussionActivity: { bsonType: 'int' },
            quizPerformance: { bsonType: 'object' }
          }
        },
        contentPerformance: {
          bsonType: 'object',
          properties: {
            videoCompletionRates: { bsonType: 'object' },
            chapterEngagement: { bsonType: 'object' },
            resourceDownloads: { bsonType: 'int' },
            interactiveElementUsage: { bsonType: 'object' }
          }
        }
      }
    }
  }
});

db.createCollection('quiz_analytics', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['quizId', 'attemptId', 'userId'],
      properties: {
        quizId: {
          bsonType: 'string',
          description: 'Quiz UUID'
        },
        attemptId: {
          bsonType: 'string',
          description: 'Attempt UUID'
        },
        userId: {
          bsonType: 'string',
          description: 'User UUID'
        },
        timestamp: {
          bsonType: 'date'
        },
        score: {
          bsonType: 'double'
        },
        timeSpent: {
          bsonType: 'int',
          description: 'Time in seconds'
        },
        questions: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              questionId: { bsonType: 'string' },
              answer: { bsonType: ['string', 'array'] },
              correct: { bsonType: 'bool' },
              timeSpent: { bsonType: 'int' },
              confidence: { bsonType: 'double' }
            }
          }
        },
        aiInsights: {
          bsonType: 'object',
          properties: {
            strengths: { bsonType: 'array' },
            weaknesses: { bsonType: 'array' },
            recommendations: { bsonType: 'array' },
            predictedScore: { bsonType: 'double' }
          }
        }
      }
    }
  }
});

db.createCollection('ai_interactions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'type', 'timestamp'],
      properties: {
        userId: {
          bsonType: 'string',
          description: 'User UUID'
        },
        courseId: {
          bsonType: 'string',
          description: 'Course UUID'
        },
        type: {
          enum: ['tutor', 'assessment', 'recommendation', 'search', 'summary'],
          description: 'Type of AI interaction'
        },
        timestamp: {
          bsonType: 'date'
        },
        conversation: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              role: { enum: ['user', 'assistant'] },
              content: { bsonType: 'string' },
              timestamp: { bsonType: 'date' }
            }
          }
        },
        context: {
          bsonType: 'object'
        },
        feedback: {
          bsonType: 'object',
          properties: {
            rating: { bsonType: 'int' },
            helpful: { bsonType: 'bool' },
            comments: { bsonType: 'string' }
          }
        }
      }
    }
  }
});

// Create indexes for better query performance
db.watch_sessions.createIndex({ userId: 1, startTime: -1 });
db.watch_sessions.createIndex({ videoId: 1, startTime: -1 });
db.watch_sessions.createIndex({ courseId: 1, startTime: -1 });
db.watch_sessions.createIndex({ sessionId: 1 }, { unique: true });

db.learning_analytics.createIndex({ userId: 1, date: -1 });
db.learning_analytics.createIndex({ 'dailyStats.xpEarned': -1 });

db.course_analytics.createIndex({ courseId: 1, date: -1 });
db.course_analytics.createIndex({ 'metrics.enrollments': -1 });

db.quiz_analytics.createIndex({ quizId: 1, userId: 1 });
db.quiz_analytics.createIndex({ userId: 1, timestamp: -1 });

db.ai_interactions.createIndex({ userId: 1, timestamp: -1 });
db.ai_interactions.createIndex({ type: 1, timestamp: -1 });

// Create a capped collection for real-time events
db.createCollection('realtime_events', {
  capped: true,
  size: 10485760, // 10MB
  max: 10000
});

print('MongoDB initialization completed successfully');