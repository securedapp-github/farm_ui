import { useState, useEffect } from 'react';
import {
    Activity,
    Package,
    ArrowLeftRight,
    Calendar,
    MapPin,
    User,
    Filter,
    Loader,
    RefreshCw
} from 'lucide-react';
import '../dashboard/DashboardHome.css';

interface ActivityItem {
    id: string;
    type: 'event' | 'handoff' | 'batch_created';
    subType: string;
    description: string;
    actor: string;
    batch: string;
    batchId: string;
    location: string | null;
    timestamp: string;
}

const activityIcons: Record<string, React.ReactNode> = {
    event: <Calendar size={16} />,
    handoff: <ArrowLeftRight size={16} />,
    batch_created: <Package size={16} />
};

const activityColors: Record<string, string> = {
    event: '#3b82f6',
    handoff: '#9333ea',
    batch_created: '#10b981'
};

const ActivityPage = () => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('ALL');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        loadActivity();
    }, []);

    const loadActivity = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('agritrace_token');
            const response = await fetch(`${API_URL}/admin/activity?limit=100`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setActivities(data.activities);
            }
        } catch (error) {
            console.error('Failed to load activity:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredActivities = typeFilter === 'ALL'
        ? activities
        : activities.filter(a => a.type === typeFilter);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader size={40} className="spinner" />
            </div>
        );
    }

    return (
        <div className="dashboard-home">
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">
                            <Activity size={28} style={{ marginRight: '12px', color: '#f59e0b' }} />
                            System Activity
                        </h1>
                        <p className="page-subtitle">All events, handoffs, and batch creations</p>
                    </div>
                    <button
                        onClick={loadActivity}
                        className="btn btn-ghost"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setTypeFilter('ALL')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: typeFilter === 'ALL' ? '2px solid #10b981' : '1px solid #e5e7eb',
                        background: typeFilter === 'ALL' ? '#dcfce7' : 'white',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <Filter size={14} />
                    All ({activities.length})
                </button>
                <button
                    onClick={() => setTypeFilter('batch_created')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: typeFilter === 'batch_created' ? '2px solid #10b981' : '1px solid #e5e7eb',
                        background: typeFilter === 'batch_created' ? '#dcfce7' : 'white',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <Package size={14} />
                    Batches ({activities.filter(a => a.type === 'batch_created').length})
                </button>
                <button
                    onClick={() => setTypeFilter('event')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: typeFilter === 'event' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                        background: typeFilter === 'event' ? '#dbeafe' : 'white',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <Calendar size={14} />
                    Events ({activities.filter(a => a.type === 'event').length})
                </button>
                <button
                    onClick={() => setTypeFilter('handoff')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: typeFilter === 'handoff' ? '2px solid #9333ea' : '1px solid #e5e7eb',
                        background: typeFilter === 'handoff' ? '#f3e8ff' : 'white',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <ArrowLeftRight size={14} />
                    Handoffs ({activities.filter(a => a.type === 'handoff').length})
                </button>
            </div>

            {/* Activity Timeline */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                {filteredActivities.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
                        <Activity size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>No activity found</p>
                    </div>
                ) : (
                    <div style={{ padding: '8px 0' }}>
                        {filteredActivities.map((activity, index) => (
                            <div
                                key={activity.id}
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    padding: '16px 20px',
                                    borderBottom: index < filteredActivities.length - 1 ? '1px solid #f3f4f6' : 'none'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: `${activityColors[activity.type]}20`,
                                    color: activityColors[activity.type],
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {activityIcons[activity.type]}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                                        <div>
                                            <span style={{
                                                fontWeight: 600,
                                                color: '#1f2937',
                                                display: 'block',
                                                marginBottom: '4px'
                                            }}>
                                                {activity.description}
                                            </span>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#6b7280' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <User size={12} />
                                                    {activity.actor}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Package size={12} />
                                                    {activity.batchId}
                                                </span>
                                                {activity.location && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <MapPin size={12} />
                                                        {activity.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#9ca3af',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {formatTime(activity.timestamp)}
                                        </span>
                                    </div>

                                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                        <span style={{
                                            padding: '2px 10px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            background: `${activityColors[activity.type]}15`,
                                            color: activityColors[activity.type],
                                            textTransform: 'capitalize'
                                        }}>
                                            {activity.type.replace('_', ' ')}
                                        </span>
                                        <span style={{
                                            padding: '2px 10px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: 500,
                                            background: '#f3f4f6',
                                            color: '#6b7280',
                                            textTransform: 'capitalize'
                                        }}>
                                            {activity.subType.replace('_', ' ')}
                                        </span>
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

export default ActivityPage;
