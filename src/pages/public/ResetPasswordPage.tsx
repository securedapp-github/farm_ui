import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Leaf, Lock, ArrowLeft, ArrowRight, Loader, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import './AuthPages.css';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token. Please request a new password reset.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
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
                        <h1>Create New Password</h1>
                        <p>
                            Choose a strong password to secure your account
                            and protect your supply chain data.
                        </p>

                        <div className="auth-visual-features">
                            <div className="auth-feature">
                                <div className="auth-feature-icon">🔒</div>
                                <span>Strong Encryption</span>
                            </div>
                            <div className="auth-feature">
                                <div className="auth-feature-icon">🛡️</div>
                                <span>Secure Storage</span>
                            </div>
                            <div className="auth-feature">
                                <div className="auth-feature-icon">✓</div>
                                <span>Instant Update</span>
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
                        {success ? (
                            <>
                                <div className="auth-form-header">
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px'
                                    }}>
                                        <CheckCircle size={32} color="white" />
                                    </div>
                                    <h2>Password Reset Complete!</h2>
                                    <p>Your password has been successfully updated.</p>
                                </div>

                                <div style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid #10b981',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '24px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: '#065f46', margin: 0, fontSize: '14px' }}>
                                        Redirecting you to login in a few seconds...
                                    </p>
                                </div>

                                <Link to="/login" className="btn btn-primary btn-lg w-full">
                                    Go to Login
                                    <ArrowRight size={18} />
                                </Link>
                            </>
                        ) : !token ? (
                            <>
                                <div className="auth-form-header">
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px'
                                    }}>
                                        <AlertCircle size={32} color="white" />
                                    </div>
                                    <h2>Invalid Reset Link</h2>
                                    <p>This password reset link is invalid or has expired.</p>
                                </div>

                                <Link to="/forgot-password" className="btn btn-primary btn-lg w-full">
                                    Request New Reset Link
                                </Link>

                                <p className="auth-footer-text">
                                    <Link to="/login" className="auth-link-bold">
                                        <ArrowLeft size={16} />
                                        Back to Login
                                    </Link>
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="auth-form-header">
                                    <h2>Reset Password</h2>
                                    <p>Enter your new password below.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="auth-form">
                                    {error && (
                                        <div style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid #ef4444',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            marginBottom: '16px',
                                            color: '#ef4444',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <AlertCircle size={18} />
                                            {error}
                                        </div>
                                    )}

                                    <div className="input-group">
                                        <label className="input-label" htmlFor="password">New Password</label>
                                        <div className="input-with-icon">
                                            <Lock size={20} className="input-icon" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                className="input input-icon-left input-icon-right"
                                                placeholder="Enter new password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
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
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                                        <div className="input-with-icon">
                                            <Lock size={20} className="input-icon" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="confirmPassword"
                                                className="input input-icon-left"
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-lg w-full ${isLoading ? 'btn-loading' : ''}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="btn-spinner"></span>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>
                                </form>

                                <p className="auth-footer-text">
                                    <Link to="/login" className="auth-link-bold">
                                        <ArrowLeft size={16} />
                                        Back to Login
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
