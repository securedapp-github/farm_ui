import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setLoginError(null);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setLoginError(result.error || 'Login failed');
            setIsLoading(false);
        }
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
                            <span>AgriTrace Platform</span>
                        </div>
                        <h1>Transparency You Can Trust</h1>
                        <p>
                            Join hundreds of agri-businesses building consumer trust
                            through blockchain-verified supply chain transparency.
                        </p>

                        <div className="auth-visual-features">
                            <div className="auth-feature">
                                <div className="auth-feature-icon">🌱</div>
                                <span>Farm to Fork Traceability</span>
                            </div>
                            <div className="auth-feature">
                                <div className="auth-feature-icon">🔗</div>
                                <span>Blockchain Verified</span>
                            </div>
                            <div className="auth-feature">
                                <div className="auth-feature-icon">📱</div>
                                <span>QR Code Integration</span>
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
                        <div className="auth-form-header">
                            <h2>Welcome back</h2>
                            <p>Enter your credentials to access your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {loginError && (
                                <div style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid #ef4444',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    marginBottom: '16px',
                                    color: '#ef4444',
                                    fontSize: '14px'
                                }}>
                                    {loginError}
                                </div>
                            )}
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
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && <span className="input-error-text">{errors.email}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="password">Password</label>
                                <div className="input-with-icon">
                                    <Lock size={20} className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        className={`input input-icon-left input-icon-right ${errors.password ? 'input-error' : ''}`}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
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

                            <div className="auth-form-options">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span>Remember me</span>
                                </label>

                                <Link to="/forgot-password" className="auth-link">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary btn-lg w-full ${isLoading ? 'btn-loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="btn-spinner"></span>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="auth-footer-text">
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-link-bold">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
