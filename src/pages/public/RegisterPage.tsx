import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff, ChevronDown, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const roles = [
    { value: 'admin', label: 'Admin', icon: '🛡️', desc: 'System administrator' },
    { value: 'farmer', label: 'Farmer', icon: '🌾', desc: 'I grow and harvest crops' },
    { value: 'processor', label: 'Processor', icon: '🏭', desc: 'I process raw materials' },
    { value: 'distributor', label: 'Distributor', icon: '🚚', desc: 'I transport and distribute' },
    { value: 'retailer', label: 'Retailer', icon: '🏪', desc: 'I sell to consumers' },
];

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: role, 2: details
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        role: '',
        name: '',
        email: '',
        organization: '',
        location: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const selectRole = (role: string) => {
        setFormData(prev => ({ ...prev, role }));
        setErrors(prev => ({ ...prev, role: '' }));
    };

    const validateStep1 = () => {
        if (!formData.role) {
            setErrors({ role: 'Please select a role' });
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Organization and location are optional for admin
        if (formData.role !== 'admin') {
            if (!formData.organization.trim()) {
                newErrors.organization = 'Organization name is required';
            }

            if (!formData.location.trim()) {
                newErrors.location = 'Location is required';
            }
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep2()) return;

        setIsLoading(true);
        setRegisterError(null);

        const result = await register({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            organization: formData.organization,
            role: formData.role,
            location: formData.location
        });

        if (result.success) {
            navigate('/dashboard');
        } else {
            setRegisterError(result.error || 'Registration failed');
            setIsLoading(false);
        }
    };

    const getRoleLabel = () => {
        const role = roles.find(r => r.value === formData.role);
        return role ? role.label : '';
    };

    return (
        <div className="auth-page">
            <div className="auth-visual">
                <div className="auth-visual-content">
                    <div className="auth-visual-bg"></div>
                    <div className="auth-visual-pattern"></div>

                    <div className="auth-visual-text">
                        <div className="auth-visual-badge">
                            <Leaf size={20} />
                            <span>Join AgriTrace</span>
                        </div>
                        <h1>Start Your Transparency Journey</h1>
                        <p>
                            Create your account and begin documenting your supply chain
                            with blockchain-backed traceability.
                        </p>

                        <div className="auth-steps-indicator">
                            <div className={`auth-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'complete' : ''}`}>
                                <span className="step-num">1</span>
                                <span className="step-label">Select Role</span>
                            </div>
                            <div className="step-line"></div>
                            <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>
                                <span className="step-num">2</span>
                                <span className="step-label">Account Details</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-form-container">
                <div className="auth-form-wrapper">
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">
                            <div className="logo-icon">
                                <Leaf size={24} />
                            </div>
                            <span>AgriTrace</span>
                        </Link>
                    </div>

                    <div className="auth-form-content">
                        {step === 1 ? (
                            <>
                                <div className="auth-form-header">
                                    <h2>What's your role?</h2>
                                    <p>Select your role in the supply chain</p>
                                </div>

                                <div className="role-selector">
                                    {roles.map((role) => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            className={`role-card ${formData.role === role.value ? 'selected' : ''}`}
                                            onClick={() => selectRole(role.value)}
                                        >
                                            <span className="role-icon">{role.icon}</span>
                                            <span className="role-label">{role.label}</span>
                                            <span className="role-desc">{role.desc}</span>
                                            <div className="role-check">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {errors.role && <span className="input-error-text text-center">{errors.role}</span>}

                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg w-full mt-6"
                                    onClick={handleNext}
                                >
                                    Continue as {formData.role ? getRoleLabel() : '...'}
                                    <ArrowRight size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="auth-form-header">
                                    <button type="button" className="back-btn" onClick={handleBack}>
                                        <ChevronDown size={20} style={{ transform: 'rotate(90deg)' }} />
                                        Back
                                    </button>
                                    <h2>Create your account</h2>
                                    <p>Fill in your details to get started</p>
                                </div>

                                {registerError && (
                                    <div className="auth-error-message" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                        {registerError}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="name">Full Name</label>
                                        <div className="input-with-icon">
                                            <User size={20} className="input-icon" />
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                className={`input input-icon-left ${errors.name ? 'input-error' : ''}`}
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.name && <span className="input-error-text">{errors.name}</span>}
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label" htmlFor="email">Email Address</label>
                                        <div className="input-with-icon">
                                            <Mail size={20} className="input-icon" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                className={`input input-icon-left ${errors.email ? 'input-error' : ''}`}
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.email && <span className="input-error-text">{errors.email}</span>}
                                    </div>

                                    {formData.role !== 'admin' && (
                                        <>
                                            <div className="input-group">
                                                <label className="input-label" htmlFor="organization">Organization Name</label>
                                                <div className="input-with-icon">
                                                    <Building2 size={20} className="input-icon" />
                                                    <input
                                                        type="text"
                                                        id="organization"
                                                        name="organization"
                                                        className={`input input-icon-left ${errors.organization ? 'input-error' : ''}`}
                                                        placeholder="Your Farm / Company Name"
                                                        value={formData.organization}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                {errors.organization && <span className="input-error-text">{errors.organization}</span>}
                                            </div>

                                            <div className="input-group">
                                                <label className="input-label" htmlFor="location">Location</label>
                                                <div className="input-with-icon">
                                                    <MapPin size={20} className="input-icon" />
                                                    <input
                                                        type="text"
                                                        id="location"
                                                        name="location"
                                                        className={`input input-icon-left ${errors.location ? 'input-error' : ''}`}
                                                        placeholder="City, State/Province"
                                                        value={formData.location}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                {errors.location && <span className="input-error-text">{errors.location}</span>}
                                            </div>
                                        </>
                                    )}

                                    <div className="form-row">
                                        <div className="input-group">
                                            <label className="input-label" htmlFor="password">Password</label>
                                            <div className="input-with-icon">
                                                <Lock size={20} className="input-icon" />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    name="password"
                                                    className={`input input-icon-left input-icon-right ${errors.password ? 'input-error' : ''}`}
                                                    placeholder="Min 8 characters"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                                <button
                                                    type="button"
                                                    className="input-icon-btn"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                            {errors.password && <span className="input-error-text">{errors.password}</span>}
                                        </div>

                                        <div className="input-group">
                                            <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                                            <div className="input-with-icon">
                                                <Lock size={20} className="input-icon" />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    className={`input input-icon-left ${errors.confirmPassword ? 'input-error' : ''}`}
                                                    placeholder="Confirm password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors.confirmPassword && <span className="input-error-text">{errors.confirmPassword}</span>}
                                        </div>
                                    </div>

                                    <label className={`checkbox-label ${errors.agreeTerms ? 'checkbox-error' : ''}`}>
                                        <input
                                            type="checkbox"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleChange}
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span>
                                            I agree to the{' '}
                                            <a href="#terms" className="auth-link">Terms of Service</a>
                                            {' '}and{' '}
                                            <a href="#privacy" className="auth-link">Privacy Policy</a>
                                        </span>
                                    </label>

                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-lg w-full mt-4 ${isLoading ? 'btn-loading' : ''}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="btn-spinner"></span>
                                        ) : (
                                            <>
                                                Create Account
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}

                        <p className="auth-footer-text">
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link-bold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
