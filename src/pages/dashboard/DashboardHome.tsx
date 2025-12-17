import { useState, useEffect, type JSX } from 'react';
import { Link } from 'react-router-dom';
import {
    Package,
    TrendingUp,
    QrCode,
    CheckCircle,
    Plus,
    Eye,
    Clock,
    MapPin,
    ChevronRight,
    Cpu,
    Loader
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { fetchDashboardStats } from '../../api/apiClient';
import './DashboardHome.css';

// Role-specific welcome messages
const roleMessages: Record<string, { title: string; subtitle: string }> = {
    farmer: {
        title: 'Welcome back, Farmer',
        subtitle: "Track your harvests and monitor your produce's journey to market."
    },
    processor: {
        title: 'Welcome back, Processor',
        subtitle: 'Manage incoming raw materials and processing operations.'
    },
    distributor: {
        title: 'Welcome back, Distributor',
        subtitle: 'Track shipments and delivery status across your network.'
    },
    retailer: {
        title: 'Welcome back, Retailer',
        subtitle: 'Monitor inventory and consumer engagement with your products.'
    }
};

const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; label: string }> = {
        created: { class: 'badge-info', label: 'Created' },
        in_transit: { class: 'badge-warning', label: 'In Transit' },
        processing: { class: 'badge-primary', label: 'Processing' },
        completed: { class: 'badge-success', label: 'Completed' }
    };
    return styles[status] || styles.created;
};

const getActivityIcon = (type: string): JSX.Element => {
    const icons: Record<string, JSX.Element> = {
        batch_created: <Package size={16} />,
        qr_scanned: <QrCode size={16} />,
        event_added: <Clock size={16} />,
        batch_split: <TrendingUp size={16} />,
        blockchain_verified: <Cpu size={16} />
    };
    return icons[type] || <Package size={16} />;
};

interface DashboardStats {
    totalBatches: number;
    qrScans: number;
    verificationRate: number;
}

interface RecentBatch {
    id: string;
    batchId: string;
    product: string;
    origin?: string;
    status: string;
    date?: string;
}

interface PieDataItem {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number;  // Index signature for Recharts compatibility
}

interface ChartDataItem {
    name: string;
    batches: number;
    scans: number;
}

interface ActivityItem {
    id: string;
    type: string;
    message: string;
    time: string;
}

const DashboardHome = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({ totalBatches: 0, qrScans: 0, verificationRate: 0 });
    const [recentBatches, setRecentBatches] = useState<RecentBatch[]>([]);
    const [pieData, setPieData] = useState<PieDataItem[]>([
        { name: 'Created', value: 25, color: '#3b82f6' },
        { name: 'In Transit', value: 25, color: '#f59e0b' },
        { name: 'Processing', value: 25, color: '#8b5cf6' },
        { name: 'Completed', value: 25, color: '#10b981' }
    ]);
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchDashboardStats();
                setStats(data.stats);
                setRecentBatches(data.recentBatches);

                // Load dynamic chart and activity data if available
                if (data.pieData) {
                    setPieData(data.pieData as PieDataItem[]);
                }
                if (data.chartData) {
                    setChartData(data.chartData as ChartDataItem[]);
                }
                if (data.recentActivity) {
                    setRecentActivity(data.recentActivity as ActivityItem[]);
                }
            } catch (error) {
                console.error('Failed to load dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    // Get role-specific message (use lowercase for lookup and provide fallback)
    const userRole = user?.role?.toLowerCase() || '';
    const roleMessage = roleMessages[userRole] || {
        title: 'Welcome back',
        subtitle: "Here's what's happening with your supply chain."
    };

    // Dynamic stats cards based on API data
    const statsCards = [
        {
            label: 'Total Batches',
            value: stats.totalBatches.toLocaleString(),
            icon: <Package size={24} />,
            color: 'primary'
        },
        {
            label: 'Active Batches',
            value: Math.floor(stats.totalBatches * 0.3).toLocaleString(),
            icon: <TrendingUp size={24} />,
            color: 'accent'
        },
        {
            label: 'QR Scans',
            value: stats.qrScans.toLocaleString(),
            icon: <QrCode size={24} />,
            color: 'info'
        }

    ];

    if (isLoading) {
        return (
            <div className="dashboard-home" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader size={40} className="spinner" />
            </div>
        );
    }

    return (
        <div className="dashboard-home">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">{roleMessage.title}, {user?.name?.split(' ')[0] || 'User'}!</h1>
                        <p className="page-subtitle">{roleMessage.subtitle}</p>
                    </div>
                    <Link to="/dashboard/batches/create" className="btn btn-primary">
                        <Plus size={20} />
                        Create Batch
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statsCards.map((stat, index) => (
                    <div key={index} className={`stats-card stat-${stat.color}`}>
                        <div className={`stats-icon stats-icon-${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div className="stats-content">
                            <span className="stats-value">{stat.value}</span>
                            <span className="stats-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                <div className="chart-card chart-card-main">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Batch Activity</h3>
                            <p className="chart-subtitle">Monthly overview of batches and scans</p>
                        </div>
                        <div className="chart-legend">
                            <span className="legend-item">
                                <span className="legend-dot primary"></span>
                                Batches
                            </span>
                            <span className="legend-item">
                                <span className="legend-dot accent"></span>
                                QR Scans
                            </span>
                        </div>
                    </div>
                    <div className="chart-body">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBatches" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="batches"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorBatches)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="scans"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorScans)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280, color: '#64748b' }}>
                                No batch data available yet
                            </div>
                        )}
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Batch Status</h3>
                            <p className="chart-subtitle">Current distribution</p>
                        </div>
                    </div>
                    <div className="chart-body pie-chart-body">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pie-legend">
                            {pieData.map((item, index) => (
                                <div key={index} className="pie-legend-item">
                                    <span className="pie-legend-dot" style={{ background: item.color }}></span>
                                    <span className="pie-legend-label">{item.name}</span>
                                    <span className="pie-legend-value">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="bottom-row">
                {/* Recent Batches */}
                <div className="card recent-batches-card">
                    <div className="card-header">
                        <h3>Recent Batches</h3>
                        <Link to="/dashboard/batches" className="view-all-link">
                            View All
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="recent-batches-list">
                        {recentBatches.length > 0 ? (
                            recentBatches.map((batch) => (
                                <Link
                                    key={batch.id}
                                    to={`/dashboard/batches/${batch.id}`}
                                    className="recent-batch-item"
                                >
                                    <div className="batch-icon">
                                        <Package size={20} />
                                    </div>
                                    <div className="batch-info">
                                        <div className="batch-header">
                                            <span className="batch-id font-mono">{batch.batchId}</span>
                                            <span className={`badge ${getStatusBadge(batch.status).class}`}>
                                                {getStatusBadge(batch.status).label}
                                            </span>
                                        </div>
                                        <span className="batch-product">{batch.product}</span>
                                        <div className="batch-meta">
                                            <span className="batch-origin">
                                                <MapPin size={12} />
                                                {batch.origin || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="batch-action">
                                        <Eye size={18} />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                                No batches yet. Create your first batch!
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card activity-card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                    </div>
                    <div className="activity-list">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="activity-item">
                                    <div className="activity-icon">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="activity-content">
                                        <span className="activity-message">{activity.message}</span>
                                        <span className="activity-time">{activity.time}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
