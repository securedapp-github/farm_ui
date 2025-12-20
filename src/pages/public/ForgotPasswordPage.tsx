import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, ArrowLeft, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import './AuthPages.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
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
                        <h1>Secure Password Recovery</h1>
                        <p>
                            Don't worry, it happens to the best of us. We'll help you
                            get back into your account securely.
                        </p>

                        <div className="auth-visual-features">
                            <div className="auth-feature">
                                <div className="auth-feature-icon">🔐</div>
                                <span>Secure Reset Link</span>
                            </div>
                            <div className="auth-feature">
                                <div className="auth-feature-icon">⏱️</div>
                                <span>1 Hour Expiry</span>
                            </div>
                            <div className="auth-feature">
                                <div className="auth-feature-icon">✉️</div>
                                <span>Email Verification</span>
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
                                    <h2>Check Your Email</h2>
                                    <p>We've sent a password reset link to <strong>{email}</strong></p>
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
                                        Click the link in the email to reset your password. The link will expire in 1 hour.
                                    </p>
                                </div>

                                <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>

                                <Link to="/login" className="btn btn-primary btn-lg w-full">
                                    <ArrowLeft size={18} />
                                    Back to Login
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="auth-form-header">
                                    <h2>Forgot Password?</h2>
                                    <p>Enter your email address and we'll send you a link to reset your password.</p>
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
                                        <label className="input-label" htmlFor="email">Email Address</label>
                                        <div className="input-with-icon">
                                            <Mail size={20} className="input-icon" />
                                            <input
                                                type="email"
                                                id="email"
                                                className="input input-icon-left"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
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
                                            'Send Reset Link'
                                        )}
                                    </button>
                                </form>

                                <p className="auth-footer-text">
                                    Remember your password?{' '}
                                    <Link to="/login" className="auth-link-bold">
                                        Sign in
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

export default ForgotPasswordPage;
