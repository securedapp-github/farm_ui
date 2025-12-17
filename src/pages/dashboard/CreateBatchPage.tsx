import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    ArrowLeft,
    Save,
    MapPin,
    Info,
    CheckCircle,
    AlertCircle,
    ShieldAlert,
    Truck
} from 'lucide-react';
import { createBatch, fetchAvailableRecipients, initiateHandoff } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import './CreateBatchPage.css';

const productTypes = [
    'Grain', 'Fruit', 'Vegetable', 'Spice', 'Fiber', 'Dairy', 'Beverage', 'Other'
];

const weightUnits = ['kg', 'g', 'lb', 'ton', 'quintal'];

// Roles allowed to create batches
const ALLOWED_ROLES = ['FARMER', 'ADMIN'];

const CreateBatchPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        productName: '',
        productType: '',
        quantity: '',
        unit: 'units',
        weight: '',
        weightUnit: 'kg',
        farmName: '',
        location: '',
        giTag: '',
        harvestDate: '',
        description: '',
        certifications: [] as string[],
        certificationId: '',
        generateQR: true
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Role-based access control - redirect non-farmers/non-admins
    const userRole = user?.role?.toUpperCase() || '';
    const canCreateBatch = ALLOWED_ROLES.includes(userRole);
    const isFarmer = userRole === 'FARMER';

    // State for processor transfer option (only for farmers)
    const [transferToProcessor, setTransferToProcessor] = useState(false);
    const [selectedProcessor, setSelectedProcessor] = useState<number | null>(null);
    const [availableProcessors, setAvailableProcessors] = useState<Array<{ id: number; name: string; organization: string | null }>>([]);

    // Fetch available processors when farmer enters review step
    useEffect(() => {
        if (isFarmer && step === 3) {
            fetchAvailableRecipients().then(recipients => {
                const processors = recipients.filter(r => r.role === 'PROCESSOR');
                setAvailableProcessors(processors);
            });
        }
    }, [step, isFarmer]);

    useEffect(() => {
        if (user && !canCreateBatch) {
            // Redirect after a short delay to show the access denied message
            const timer = setTimeout(() => {
                navigate('/dashboard/batches');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [user, canCreateBatch, navigate]);

    // Show access denied message for unauthorized users
    if (user && !canCreateBatch) {
        return (
            <div className="create-batch-page">
                <div className="access-denied">
                    <div className="access-denied-icon">
                        <ShieldAlert size={64} />
                    </div>
                    <h2>Access Denied</h2>
                    <p>Only <strong>Farmers</strong> and <strong>Administrators</strong> can create new batches.</p>
                    <p className="role-info">Your role: <strong>{user.role}</strong></p>
                    <p className="redirect-info">Redirecting to batches page...</p>
                    <button className="btn btn-primary" onClick={() => navigate('/dashboard/batches')}>
                        Go to Batches
                    </button>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleCertification = (cert: string) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.includes(cert)
                ? prev.certifications.filter(c => c !== cert)
                : [...prev.certifications, cert]
        }));
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.productName.trim()) {
            newErrors.productName = 'Product name is required';
        }
        if (!formData.productType) {
            newErrors.productType = 'Select a product type';
        }
        if (!formData.weight || parseFloat(formData.weight) <= 0) {
            newErrors.weight = 'Enter a valid weight';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.farmName.trim()) {
            newErrors.farmName = 'Farm name is required';
        }
        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const result = await createBatch({
                productName: formData.productName,
                productType: formData.productType,
                weight: formData.weight,
                weightUnit: formData.weightUnit,
                farmName: formData.farmName,
                location: formData.location,
                harvestDate: formData.harvestDate,
                description: formData.description,
                certifications: formData.certifications,
                certificationId: formData.certificationId
            });

            if (result.success && result.batch) {
                // If farmer selected to transfer to processor, initiate handoff
                if (transferToProcessor && selectedProcessor) {
                    try {
                        await initiateHandoff(
                            result.batch.id,
                            selectedProcessor,
                            'pickup',
                            `Batch transferred from farmer to processor after creation`
                        );
                    } catch (handoffError) {
                        console.error('Handoff failed:', handoffError);
                        // Continue to navigate even if handoff fails - batch was created
                    }
                }
                // Navigate to batch detail page
                navigate(`/dashboard/batches/${result.batch.id}`);
            } else {
                setSubmitError('Failed to create batch. Please try again.');
            }
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const certificationOptions = [
        'Organic Certified',
        'Fair Trade',
        'Non-GMO',
        'FSSAI Approved',
        'ISO 22000',
        'HACCP'
    ];

    return (
        <div className="create-batch-page">
            {/* Page Header */}
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                    Back
                </button>
                <div>
                    <h1 className="page-title">Create New Batch</h1>
                    <p className="page-subtitle">Register a new product batch in the system</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="create-steps">
                <div className={`create-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'complete' : ''}`}>
                    <div className="step-circle">
                        {step > 1 ? <CheckCircle size={20} /> : '1'}
                    </div>
                    <span className="step-label">Product Details</span>
                </div>
                <div className="step-connector"></div>
                <div className={`create-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'complete' : ''}`}>
                    <div className="step-circle">
                        {step > 2 ? <CheckCircle size={20} /> : '2'}
                    </div>
                    <span className="step-label">Origin Info</span>
                </div>
                <div className="step-connector"></div>
                <div className={`create-step ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-circle">3</div>
                    <span className="step-label">Review & Submit</span>
                </div>
            </div>

            {/* Form Content */}
            <div className="create-form-container">
                {step === 1 && (
                    <div className="form-section animate-fadeIn">
                        <div className="section-header">
                            <Package size={24} />
                            <div>
                                <h2>Product Details</h2>
                                <p>Enter information about the product</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label className="input-label">Product Name *</label>
                                <input
                                    type="text"
                                    name="productName"
                                    className={`input ${errors.productName ? 'input-error' : ''}`}
                                    placeholder="e.g., Organic Wheat"
                                    value={formData.productName}
                                    onChange={handleChange}
                                />
                                {errors.productName && <span className="input-error-text">{errors.productName}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Product Type *</label>
                                <select
                                    name="productType"
                                    className={`input select ${errors.productType ? 'input-error' : ''}`}
                                    value={formData.productType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select type</option>
                                    {productTypes.map(type => (
                                        <option key={type} value={type.toLowerCase()}>{type}</option>
                                    ))}
                                </select>
                                {errors.productType && <span className="input-error-text">{errors.productType}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Quantity</label>
                                <div className="input-addon-group">
                                    <input
                                        type="number"
                                        name="quantity"
                                        className="input"
                                        placeholder="Enter quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                    />
                                    <select
                                        name="unit"
                                        className="input-addon"
                                        value={formData.unit}
                                        onChange={handleChange}
                                    >
                                        <option value="units">Units</option>
                                        <option value="boxes">Boxes</option>
                                        <option value="bags">Bags</option>
                                        <option value="crates">Crates</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Weight (Total Weight)*</label>
                                <div className="input-addon-group">
                                    <input
                                        type="number"
                                        name="weight"
                                        className={`input ${errors.weight ? 'input-error' : ''}`}
                                        placeholder="Enter weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                    />
                                    <select
                                        name="weightUnit"
                                        className="input-addon"
                                        value={formData.weightUnit}
                                        onChange={handleChange}
                                    >
                                        {weightUnits.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.weight && <span className="input-error-text">{errors.weight}</span>}
                            </div>

                            <div className="input-group full-width">
                                <label className="input-label">Description</label>
                                <textarea
                                    name="description"
                                    className="input textarea"
                                    placeholder="Add any additional details about the product..."
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-primary btn-lg" onClick={handleNext}>
                                Continue to Origin Info
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-section animate-fadeIn">
                        <div className="section-header">
                            <MapPin size={24} />
                            <div>
                                <h2>Origin Information</h2>
                                <p>Where was this product sourced from?</p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label className="input-label">Farm / Source Name *</label>
                                <input
                                    type="text"
                                    name="farmName"
                                    className={`input ${errors.farmName ? 'input-error' : ''}`}
                                    placeholder="e.g., Golden Valley Farms"
                                    value={formData.farmName}
                                    onChange={handleChange}
                                />
                                {errors.farmName && <span className="input-error-text">{errors.farmName}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    className={`input ${errors.location ? 'input-error' : ''}`}
                                    placeholder="e.g., Punjab, India"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                                {errors.location && <span className="input-error-text">{errors.location}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label">GI Tag (Geographical Indication)</label>
                                <input
                                    type="text"
                                    name="giTag"
                                    className="input"
                                    placeholder="e.g., Darjeeling Tea, Basmati Rice"
                                    value={formData.giTag}
                                    onChange={handleChange}
                                />
                                <span className="input-hint">Official geographic product tag (if applicable)</span>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Harvest Date</label>
                                <input
                                    type="date"
                                    name="harvestDate"
                                    className="input"
                                    value={formData.harvestDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-group full-width">
                                <label className="input-label">Certifications</label>
                                <div className="certification-grid">
                                    {certificationOptions.map(cert => (
                                        <button
                                            key={cert}
                                            type="button"
                                            className={`cert-tag ${formData.certifications.includes(cert) ? 'selected' : ''}`}
                                            onClick={() => toggleCertification(cert)}
                                        >
                                            {formData.certifications.includes(cert) && <CheckCircle size={14} />}
                                            {cert}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group full-width">
                                <label className="input-label">Certification ID / Number</label>
                                <input
                                    type="text"
                                    name="certificationId"
                                    className="input"
                                    placeholder="e.g., FSSAI-12345678, ORGANIC-IN-001"
                                    value={formData.certificationId || ''}
                                    onChange={handleChange}
                                />
                                <span className="input-hint">Enter your official certification ID or registration number</span>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-outline btn-lg" onClick={handleBack}>
                                Back
                            </button>
                            <button type="button" className="btn btn-primary btn-lg" onClick={handleNext}>
                                Review Batch
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-section animate-fadeIn">
                        <div className="section-header">
                            <Info size={24} />
                            <div>
                                <h2>Review & Submit</h2>
                                <p>Verify the batch information before submitting</p>
                            </div>
                        </div>

                        <div className="review-card">
                            <div className="review-section">
                                <h4>Product Details</h4>
                                <div className="review-grid">
                                    <div className="review-item">
                                        <span className="review-label">Product Name</span>
                                        <span className="review-value">{formData.productName}</span>
                                    </div>
                                    <div className="review-item">
                                        <span className="review-label">Product Type</span>
                                        <span className="review-value">{formData.productType}</span>
                                    </div>
                                    <div className="review-item">
                                        <span className="review-label">Weight</span>
                                        <span className="review-value">{formData.weight} {formData.weightUnit}</span>
                                    </div>
                                    {formData.quantity && (
                                        <div className="review-item">
                                            <span className="review-label">Quantity</span>
                                            <span className="review-value">{formData.quantity} {formData.unit}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="review-section">
                                <h4>Origin Information</h4>
                                <div className="review-grid">
                                    <div className="review-item">
                                        <span className="review-label">Farm Name</span>
                                        <span className="review-value">{formData.farmName}</span>
                                    </div>
                                    <div className="review-item">
                                        <span className="review-label">Location</span>
                                        <span className="review-value">{formData.location}</span>
                                    </div>
                                    {formData.harvestDate && (
                                        <div className="review-item">
                                            <span className="review-label">Harvest Date</span>
                                            <span className="review-value">{new Date(formData.harvestDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                                {formData.certifications.length > 0 && (
                                    <div className="review-certs">
                                        <span className="review-label">Certifications</span>
                                        <div className="cert-badges">
                                            {formData.certifications.map(cert => (
                                                <span key={cert} className="badge badge-success">{cert}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="review-options">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="generateQR"
                                        checked={formData.generateQR}
                                        onChange={handleChange}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span>Generate QR code for this batch</span>
                                </label>

                                {/* Transfer to Processor option - Only for Farmers */}
                                {isFarmer && (
                                    <div className="transfer-option">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={transferToProcessor}
                                                onChange={(e) => {
                                                    setTransferToProcessor(e.target.checked);
                                                    if (!e.target.checked) setSelectedProcessor(null);
                                                }}
                                            />
                                            <span className="checkbox-custom"></span>
                                            <span><Truck size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />Transfer batch to a Processor after creation</span>
                                        </label>

                                        {transferToProcessor && (
                                            <div className="processor-select" style={{ marginTop: 12, marginLeft: 28 }}>
                                                <select
                                                    className="input"
                                                    value={selectedProcessor || ''}
                                                    onChange={(e) => setSelectedProcessor(Number(e.target.value) || null)}
                                                >
                                                    <option value="">-- Select a Processor --</option>
                                                    {availableProcessors.map(p => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.name} {p.organization ? `(${p.organization})` : ''}
                                                        </option>
                                                    ))}
                                                </select>
                                                {availableProcessors.length === 0 && (
                                                    <span className="input-hint" style={{ color: 'var(--warning)' }}>
                                                        No processors available. Register a processor first.
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {submitError && (
                            <div className="info-banner" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                <AlertCircle size={20} style={{ color: '#ef4444' }} />
                                <p style={{ color: '#ef4444' }}>{submitError}</p>
                            </div>
                        )}

                        <div className="info-banner">
                            <Info size={20} />
                            <p>
                                Once submitted, this batch will be registered on the blockchain and cannot be modified.
                                A unique Batch ID will be generated automatically.
                            </p>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-outline btn-lg" onClick={handleBack}>
                                Back
                            </button>
                            <button
                                type="button"
                                className={`btn btn-primary btn-lg ${isSubmitting ? 'btn-loading' : ''}`}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="btn-spinner"></span>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Create Batch
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateBatchPage;
