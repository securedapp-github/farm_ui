import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    Leaf,
    LayoutDashboard,
    Package,
    Plus,
    History,
    QrCode,
    ScanLine,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    ChevronDown,
    User as UserIcon,
    Truck,
    Factory,
    Store,
    Shield,
    Users,
    Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

// Role-based navigation configuration
interface NavItem {
    icon: ReactNode;
    label: string;
    path: string;
    roles?: string[]; // If empty/undefined, shown to all roles
}

const allNavItems: NavItem[] = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Package size={20} />, label: 'Batches', path: '/dashboard/batches' },
    { icon: <Plus size={20} />, label: 'Create Batch', path: '/dashboard/batches/create', roles: ['FARMER', 'ADMIN'] },
    { icon: <History size={20} />, label: 'Events', path: '/dashboard/events' },
    { icon: <QrCode size={20} />, label: 'QR Codes', path: '/dashboard/qr' },
    { icon: <ScanLine size={20} />, label: 'QR Scanner', path: '/dashboard/qr/scan' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/dashboard/analytics', roles: ['ADMIN'] },
];

const adminNavItems: NavItem[] = [
    { icon: <Shield size={20} />, label: 'Admin Dashboard', path: '/dashboard/admin' },
    { icon: <Users size={20} />, label: 'Users', path: '/dashboard/admin/users' },
    { icon: <Activity size={20} />, label: 'Activity', path: '/dashboard/admin/activity' },
];

// Role-specific labels, icons and colors for clear identification
const roleConfig: Record<string, { label: string; icon: ReactNode; color: string }> = {
    FARMER: { label: 'Farmer', icon: <Leaf size={16} />, color: '#22c55e' },          // Green leaf for farmers
    PROCESSOR: { label: 'Processor', icon: <Factory size={16} />, color: '#f59e0b' }, // Orange factory
    DISTRIBUTOR: { label: 'Distributor', icon: <Truck size={16} />, color: '#3b82f6' }, // Blue truck
    RETAILER: { label: 'Retailer', icon: <Store size={16} />, color: '#8b5cf6' },      // Purple store
    ADMIN: { label: 'Admin', icon: <Settings size={16} />, color: '#ef4444' },         // Red settings
    USER: { label: 'User', icon: <UserIcon size={16} />, color: '#6b7280' }            // Gray user
};

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Get user role (uppercase)
    const userRole = user?.role?.toUpperCase() || 'USER';

    // Filter nav items based on user role
    // Admin users don't see main menu items - they only use admin section
    const navItems = userRole === 'ADMIN'
        ? []
        : allNavItems.filter(item => {
            if (!item.roles || item.roles.length === 0) return true;
            return item.roles.includes(userRole);
        });

    // Role display info
    const displayName = user?.name || 'User';
    const roleInfo = roleConfig[userRole] || roleConfig.USER;
    const displayRole = roleInfo.label;
    const displayEmail = user?.email || '';
    const displayOrg = user?.organization || '';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="nav-logo">
                        <div className="logo-icon">
                            <Leaf size={22} />
                        </div>
                        <span>AgriTrace</span>
                    </Link>
                    <button
                        className="sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section">
                        <span className="sidebar-section-title">Main Menu</span>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Admin Section - Only for ADMIN role */}
                    {userRole === 'ADMIN' && (
                        <div className="sidebar-section mt-8">
                            <span className="sidebar-section-title" style={{ color: '#ef4444' }}>Admin</span>
                            {adminNavItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="sidebar-section mt-8">
                        <span className="sidebar-section-title">Settings</span>
                        <Link to="/dashboard/settings" className="sidebar-link">
                            <Settings size={20} />
                            <span>Settings</span>
                        </Link>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="user-avatar">
                            <span>{displayName.charAt(0)}</span>
                        </div>
                        <div className="user-info">
                            <span className="user-name">{displayName}</span>
                            <span className="user-role-badge" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: roleInfo.color,
                                fontWeight: 500
                            }}>
                                {roleInfo.icon}
                                {displayRole}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Top Navbar */}
                <header className="dashboard-topbar">
                    <div className="topbar-left">
                        <button
                            className="menu-toggle"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search batches, events..."
                            />
                        </div>
                    </div>

                    <div className="topbar-right">
                        <button className="topbar-icon-btn">
                            <Bell size={20} />
                            <span className="notification-dot"></span>
                        </button>

                        <div className="user-menu-container">
                            <button
                                className="user-menu-trigger"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <div className="user-avatar small">
                                    <span>{displayName.charAt(0)}</span>
                                </div>
                                <span className="user-name-short">{displayName.split(' ')[0]}</span>
                                <ChevronDown size={16} />
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div
                                        className="user-menu-overlay"
                                        onClick={() => setUserMenuOpen(false)}
                                    />
                                    <div className="user-menu">
                                        <div className="user-menu-header">
                                            <div className="user-avatar">
                                                <span>{displayName.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <span className="user-menu-name">{displayName}</span>
                                                <span className="user-menu-email">{displayEmail}</span>
                                                <span className="user-menu-org" style={{ fontSize: '11px', color: '#64748b' }}>{displayOrg}</span>
                                            </div>
                                        </div>
                                        <div className="user-menu-divider"></div>
                                        <Link to="/dashboard/profile" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                                            <UserIcon size={18} />
                                            <span>Profile</span>
                                        </Link>
                                        <div className="user-menu-divider"></div>
                                        <button className="user-menu-item logout" onClick={handleLogout}>
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
