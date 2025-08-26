-- TimescaleDB initialization for time-series engagement metrics

-- Create TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Video engagement metrics
CREATE TABLE video_engagement_metrics (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    video_id UUID NOT NULL,
    course_id UUID NOT NULL,
    user_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    position_seconds INTEGER,
    playback_rate DECIMAL(3, 2),
    quality VARCHAR(20),
    viewport_percentage DECIMAL(5, 2),
    interaction_type VARCHAR(50),
    interaction_value JSONB,
    session_id VARCHAR(100),
    device_type VARCHAR(50),
    location_country VARCHAR(2),
    location_city VARCHAR(100)
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('video_engagement_metrics', 'time');

-- Create indexes
CREATE INDEX idx_vem_video_time ON video_engagement_metrics (video_id, time DESC);
CREATE INDEX idx_vem_user_time ON video_engagement_metrics (user_id, time DESC);
CREATE INDEX idx_vem_course_time ON video_engagement_metrics (course_id, time DESC);
CREATE INDEX idx_vem_event_type ON video_engagement_metrics (event_type, time DESC);

-- Learning activity metrics
CREATE TABLE learning_activity_metrics (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id UUID NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    course_id UUID,
    video_id UUID,
    quiz_id UUID,
    xp_earned INTEGER,
    points_earned INTEGER,
    streak_maintained BOOLEAN,
    completion_percentage DECIMAL(5, 2),
    time_spent_seconds INTEGER,
    interaction_count INTEGER,
    quality_score DECIMAL(5, 2),
    metadata JSONB
);

SELECT create_hypertable('learning_activity_metrics', 'time');

CREATE INDEX idx_lam_user_time ON learning_activity_metrics (user_id, time DESC);
CREATE INDEX idx_lam_activity ON learning_activity_metrics (activity_type, time DESC);
CREATE INDEX idx_lam_course ON learning_activity_metrics (course_id, time DESC);

-- Platform performance metrics
CREATE TABLE platform_performance_metrics (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    endpoint VARCHAR(255),
    response_time_ms INTEGER,
    status_code INTEGER,
    error_count INTEGER,
    concurrent_users INTEGER,
    cpu_usage DECIMAL(5, 2),
    memory_usage DECIMAL(5, 2),
    database_connections INTEGER,
    cache_hit_rate DECIMAL(5, 2),
    cdn_bandwidth_gb DECIMAL(10, 2)
);

SELECT create_hypertable('platform_performance_metrics', 'time');

CREATE INDEX idx_ppm_metric_time ON platform_performance_metrics (metric_type, time DESC);
CREATE INDEX idx_ppm_endpoint ON platform_performance_metrics (endpoint, time DESC);

-- Revenue metrics
CREATE TABLE revenue_metrics (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    transaction_id UUID,
    user_id UUID NOT NULL,
    course_id UUID,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    transaction_type VARCHAR(50),
    payment_method VARCHAR(50),
    discount_applied DECIMAL(10, 2),
    affiliate_commission DECIMAL(10, 2),
    net_revenue DECIMAL(10, 2),
    country VARCHAR(2),
    platform VARCHAR(50)
);

SELECT create_hypertable('revenue_metrics', 'time');

CREATE INDEX idx_rm_user_time ON revenue_metrics (user_id, time DESC);
CREATE INDEX idx_rm_course_time ON revenue_metrics (course_id, time DESC);
CREATE INDEX idx_rm_type ON revenue_metrics (transaction_type, time DESC);

-- Social interaction metrics
CREATE TABLE social_interaction_metrics (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    user_id UUID NOT NULL,
    interaction_type VARCHAR(50) NOT NULL,
    target_user_id UUID,
    course_id UUID,
    group_id UUID,
    discussion_id UUID,
    sentiment_score DECIMAL(3, 2),
    engagement_score DECIMAL(5, 2),
    virality_score DECIMAL(5, 2),
    metadata JSONB
);

SELECT create_hypertable('social_interaction_metrics', 'time');

CREATE INDEX idx_sim_user_time ON social_interaction_metrics (user_id, time DESC);
CREATE INDEX idx_sim_type ON social_interaction_metrics (interaction_type, time DESC);
CREATE INDEX idx_sim_course ON social_interaction_metrics (course_id, time DESC);

-- Create continuous aggregates for real-time analytics

-- Hourly video engagement aggregate
CREATE MATERIALIZED VIEW video_engagement_hourly
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', time) AS hour,
    video_id,
    course_id,
    COUNT(DISTINCT user_id) as unique_viewers,
    COUNT(*) as total_events,
    AVG(position_seconds) as avg_position,
    MAX(position_seconds) as max_position,
    COUNT(DISTINCT session_id) as sessions
FROM video_engagement_metrics
GROUP BY hour, video_id, course_id
WITH NO DATA;

-- Daily learning activity aggregate
CREATE MATERIALIZED VIEW learning_activity_daily
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', time) AS day,
    user_id,
    COUNT(DISTINCT course_id) as courses_accessed,
    SUM(xp_earned) as total_xp,
    SUM(points_earned) as total_points,
    SUM(time_spent_seconds) as total_time_spent,
    AVG(quality_score) as avg_quality_score,
    COUNT(*) as activity_count
FROM learning_activity_metrics
GROUP BY day, user_id
WITH NO DATA;

-- Hourly platform performance aggregate
CREATE MATERIALIZED VIEW platform_performance_hourly
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', time) AS hour,
    metric_type,
    AVG(response_time_ms) as avg_response_time,
    MAX(response_time_ms) as max_response_time,
    SUM(error_count) as total_errors,
    AVG(concurrent_users) as avg_concurrent_users,
    AVG(cpu_usage) as avg_cpu_usage,
    AVG(memory_usage) as avg_memory_usage,
    AVG(cache_hit_rate) as avg_cache_hit_rate
FROM platform_performance_metrics
GROUP BY hour, metric_type
WITH NO DATA;

-- Daily revenue aggregate
CREATE MATERIALIZED VIEW revenue_daily
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', time) AS day,
    currency,
    COUNT(DISTINCT user_id) as paying_users,
    COUNT(DISTINCT course_id) as courses_sold,
    SUM(amount) as gross_revenue,
    SUM(net_revenue) as net_revenue,
    AVG(amount) as avg_transaction_value,
    COUNT(*) as transaction_count
FROM revenue_metrics
GROUP BY day, currency
WITH NO DATA;

-- Create policies for automatic data management

-- Compress data older than 7 days
SELECT add_compression_policy('video_engagement_metrics', INTERVAL '7 days');
SELECT add_compression_policy('learning_activity_metrics', INTERVAL '7 days');
SELECT add_compression_policy('platform_performance_metrics', INTERVAL '7 days');
SELECT add_compression_policy('social_interaction_metrics', INTERVAL '7 days');

-- Drop old data (optional, adjust based on requirements)
SELECT add_retention_policy('video_engagement_metrics', INTERVAL '1 year');
SELECT add_retention_policy('learning_activity_metrics', INTERVAL '1 year');
SELECT add_retention_policy('platform_performance_metrics', INTERVAL '6 months');
SELECT add_retention_policy('revenue_metrics', INTERVAL '7 years'); -- Keep revenue data longer

-- Refresh continuous aggregates
SELECT add_continuous_aggregate_policy('video_engagement_hourly',
    start_offset => INTERVAL '3 hours',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');

SELECT add_continuous_aggregate_policy('learning_activity_daily',
    start_offset => INTERVAL '3 days',
    end_offset => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 day');

SELECT add_continuous_aggregate_policy('platform_performance_hourly',
    start_offset => INTERVAL '3 hours',
    end_offset => INTERVAL '1 hour',
    schedule_interval => INTERVAL '1 hour');

SELECT add_continuous_aggregate_policy('revenue_daily',
    start_offset => INTERVAL '3 days',
    end_offset => INTERVAL '1 day',
    schedule_interval => INTERVAL '1 day');