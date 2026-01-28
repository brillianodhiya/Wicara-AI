import React from 'react';
import { NavLink } from 'react-router-dom';
import { AudioOutlined, HistoryOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useMeetings } from '../hooks/useMeetings';

export const Dashboard: React.FC = () => {
    const { meetings } = useMeetings();

    // Calculate stats
    const totalMeetings = meetings.length;
    const totalDuration = meetings.reduce((acc, m) => acc + (m.duration || 0), 0);
    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    const recentMeetings = meetings.slice(0, 5);

    return (
        <div>
            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-value">{totalMeetings}</div>
                    <div className="stat-label">Total Meetings</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{formatDuration(totalDuration)}</div>
                    <div className="stat-label">Total Duration</div>
                </div>
            </div>

            {/* Quick Record Card */}
            <div className="dashboard-card" style={{ textAlign: 'center', marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="dashboard-card-title" style={{ marginBottom: 20 }}>Quick Record</div>
                <NavLink to="/record">
                    <button className="record-button-large">
                        <AudioOutlined />
                    </button>
                </NavLink>
                <p style={{ marginTop: 16, color: '#666', fontSize: 14 }}>
                    Tap to start recording
                </p>
            </div>

            {/* Recent Meetings */}
            <div className="dashboard-card">
                <div className="dashboard-card-header">
                    <div className="dashboard-card-title">Recent Meetings</div>
                    <NavLink to="/history" style={{ fontSize: 14, color: '#1677ff' }}>
                        View All →
                    </NavLink>
                </div>

                {recentMeetings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                        <HistoryOutlined style={{ fontSize: 40, marginBottom: 12 }} />
                        <p>No meetings yet</p>
                    </div>
                ) : (
                    <div className="meeting-list">
                        {recentMeetings.map(meeting => (
                            <div key={meeting.id} className="meeting-item">
                                <div className="meeting-item-icon">
                                    <FileTextOutlined />
                                </div>
                                <div className="meeting-item-content">
                                    <div className="meeting-item-title">{meeting.title}</div>
                                    <div className="meeting-item-meta">
                                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                                        {new Date(meeting.createdAt).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                        {' • '}
                                        {formatDuration(meeting.duration)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
