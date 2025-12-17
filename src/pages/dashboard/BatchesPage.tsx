import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Package,
    Plus,
    Search,
    Filter,
    ChevronDown,
    Eye,
    QrCode,
    MoreVertical,
    MapPin,
    Calendar,
    ArrowUpDown,
    Loader,
    GitBranch
} from 'lucide-react';
import { fetchBatches } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import type { Batch } from '../../api/types';
import './BatchesPage.css';

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'created', label: 'Created' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'processing', label: 'Processing' },
    { value: 'split', label: 'Split' },
    { value: 'completed', label: 'Completed' }
];

const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; label: string }> = {
        created: { class: 'badge-info', label: 'Created' },
        in_transit: { class: 'badge-warning', label: 'In Transit' },
        processing: { class: 'badge-primary', label: 'Processing' },
        split: { class: 'badge-blockchain', label: 'Split' },
        completed: { class: 'badge-success', label: 'Completed' }
    };
    return styles[status] || styles.created;
};

const BatchesPage = () => {
    const { user } = useAuth();
    const [batches, setBatches] = useState<Batch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Role-based permissions
    const userRole = user?.role?.toUpperCase() || 'USER';
    const canCreateBatch = ['FARMER', 'ADMIN'].includes(userRole);
    const canSplitBatch = ['FARMER', 'PROCESSOR', 'DISTRIBUTOR', 'RETAILER', 'ADMIN'].includes(userRole);

    useEffect(() => {
        const loadBatches = async () => {
            setIsLoading(true);
            try {
                const data = await fetchBatches();
                setBatches(data);
            } catch (error) {
                console.error('Failed to fetch batches:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadBatches();
    }, []);

    const filteredBatches = batches.filter(batch => {
        const matchesSearch =
            batch.batchId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            batch.product?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            batch.origin?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="batches-page">
                <div className="page-header">
                    <div className="page-header-row">
                        <div>
                            <h1 className="page-title">Batches</h1>
                            <p className="page-subtitle">Manage and track all your product batches</p>
                        </div>
                    </div>
                </div>
                <div className="loading-state">
                    <Loader className="spin" size={32} />
                    <p>Loading batches...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="batches-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">Batches</h1>
                        <p className="page-subtitle">Manage and track all your product batches</p>
                    </div>
                    {canCreateBatch ? (
                        <Link to="/dashboard/batches/create" className="btn btn-primary">
                            <Plus size={20} />
                            Create Batch
                        </Link>
                    ) : (
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            Split existing batches to create sub-batches
                        </p>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className="batches-toolbar">
                <div className="search-filter-row">
                    <div className="search-box large">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search by Batch ID, product, or origin..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <div className="select-wrapper">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="select-input"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="select-icon" />
                        </div>

                        <button
                            className={`btn btn-outline filter-btn ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={18} />
                            Filters
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="advanced-filters">
                        <div className="filter-item">
                            <label>Date Range</label>
                            <div className="date-range">
                                <input type="date" className="input" />
                                <span>to</span>
                                <input type="date" className="input" />
                            </div>
                        </div>
                        <div className="filter-item">
                            <label>Product Type</label>
                            <select className="input">
                                <option value="">All Types</option>
                                <option value="grain">Grain</option>
                                <option value="fruit">Fruit</option>
                                <option value="vegetable">Vegetable</option>
                                <option value="spice">Spice</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Summary */}
            <div className="results-summary">
                <span className="results-count">
                    Showing <strong>{filteredBatches.length}</strong> of <strong>{batches.length}</strong> batches
                </span>
                <button className="btn btn-ghost btn-sm">
                    <ArrowUpDown size={16} />
                    Sort by Date
                </button>
            </div>

            {/* Batches Grid */}
            <div className="batches-grid">
                {filteredBatches.map((batch) => (
                    <div key={batch.id} className="batch-card">
                        <div className="batch-card-header">
                            <div className="batch-card-icon">
                                <Package size={22} />
                            </div>
                            <span className={`badge ${getStatusBadge(batch.status).class}`}>
                                {getStatusBadge(batch.status).label}
                            </span>
                            <button className="batch-card-menu">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="batch-card-body">
                            <span className="batch-id font-mono">{batch.batchId}</span>
                            <h3 className="batch-product-name">{batch.product}</h3>

                            <div className="batch-detail">
                                <MapPin size={14} />
                                <span>{batch.origin || 'Unknown Origin'}</span>
                            </div>

                            <div className="batch-detail">
                                <Calendar size={14} />
                                <span>{new Date(batch.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}</span>
                            </div>

                            <div className="batch-meta-row">
                                <div className="batch-weight">
                                    <span className="weight-value">{batch.weight}</span>
                                    <span className="weight-unit">{batch.weightUnit || 'kg'}</span>
                                </div>
                                <div className="batch-badges">
                                    {batch.hasQR && (
                                        <span className="mini-badge qr">
                                            <QrCode size={12} />
                                        </span>
                                    )}
                                    {batch.blockchainVerified && (
                                        <span className="mini-badge blockchain">✓</span>
                                    )}
                                    {(batch as any).parentBatchId && (
                                        <span className="mini-badge child" title="Child Batch">
                                            <GitBranch size={12} />
                                        </span>
                                    )}
                                    {((batch as any).childBatchCount || 0) > 0 && (
                                        <span className="mini-badge parent" title={`${(batch as any).childBatchCount} children`}>
                                            +{(batch as any).childBatchCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="batch-card-footer">
                            <Link to={`/dashboard/batches/${batch.id}`} className="btn btn-outline btn-sm w-full">
                                <Eye size={16} />
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredBatches.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">
                        <Package size={48} />
                    </div>
                    <h3>No batches found</h3>
                    <p>{batches.length === 0 ? 'Create your first batch to get started' : 'Try adjusting your search or filter criteria'}</p>
                    {batches.length === 0 ? (
                        <Link to="/dashboard/batches/create" className="btn btn-primary">
                            <Plus size={20} />
                            Create First Batch
                        </Link>
                    ) : (
                        <button className="btn btn-primary" onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                        }}>
                            Clear Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BatchesPage;
