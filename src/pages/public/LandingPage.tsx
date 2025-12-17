import { Link } from 'react-router-dom';
import {
    Leaf,
    Shield,
    QrCode,
    TrendingUp,
    Users,
    ChevronRight,
    Cpu,
    Globe,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Truck,
    Factory,
    Store,
    Wheat
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    const features = [
        {
            icon: <QrCode size={28} />,
            title: 'Instant QR Verification',
            description: 'Every product gets a unique QR code. Consumers scan and instantly see the complete journey from farm to fork.',
            color: 'primary'
        },
        {
            icon: <Shield size={28} />,
            title: 'Blockchain Security',
            description: 'Immutable records on blockchain ensure data integrity. No tampering, no counterfeits, complete trust.',
            color: 'blockchain'
        },
        {
            icon: <TrendingUp size={28} />,
            title: 'Real-time Tracking',
            description: 'Monitor your products across the entire supply chain. Get alerts, insights, and full visibility.',
            color: 'accent'
        },
        {
            icon: <Users size={28} />,
            title: 'Multi-Stakeholder',
            description: 'From farmers to retailers, everyone contributes to a unified, transparent product story.',
            color: 'info'
        }
    ];

    const stats = [
        { value: '50K+', label: 'Products Tracked' },
        { value: '2.5M', label: 'QR Scans' },
        { value: '500+', label: 'Businesses' },
        { value: '99.9%', label: 'Accuracy' }
    ];

    const stakeholders = [
        { icon: <Wheat size={32} />, label: 'Farmers', desc: 'Origin & harvest data' },
        { icon: <Factory size={32} />, label: 'Processors', desc: 'Processing & quality' },
        { icon: <Truck size={32} />, label: 'Distributors', desc: 'Logistics & storage' },
        { icon: <Store size={32} />, label: 'Retailers', desc: 'Final sale & access' }
    ];

    const benefits = [
        'Eliminate counterfeits with verified authenticity',
        'Reduce supply chain inefficiencies by 40%',
        'Build consumer trust with transparent journeys',
        'Meet regulatory compliance requirements',
        'Instant recall management capabilities',
        'Data-driven insights for better decisions'
    ];

    return (
        <div className="landing-page">
            {/* Navigation */}
            <nav className="landing-nav">
                <div className="container">
                    <div className="navbar-content">
                        <Link to="/" className="nav-logo">
                            <div className="logo-icon">
                                <Leaf size={28} />
                            </div>
                            <span>AgriTrace</span>
                        </Link>

                        <div className="nav-links">
                            <a href="#features" className="nav-link">Features</a>
                            <a href="#how-it-works" className="nav-link">How It Works</a>
                            <a href="#benefits" className="nav-link">Benefits</a>
                            <Link to="/login" className="btn btn-ghost">Log In</Link>
                            <Link to="/register" className="btn btn-primary">
                                Get Started
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg">
                    <div className="hero-gradient"></div>
                    <div className="hero-pattern"></div>
                    <div className="hero-glow hero-glow-1"></div>
                    <div className="hero-glow hero-glow-2"></div>
                </div>

                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge animate-fadeInUp">
                            <Sparkles size={16} />
                            <span>Blockchain-Powered Traceability</span>
                        </div>

                        <h1 className="hero-title animate-fadeInUp stagger-1">
                            From Farm to Fork,
                            <br />
                            <span className="text-gradient-hero">Every Step Verified</span>
                        </h1>

                        <p className="hero-description animate-fadeInUp stagger-2">
                            The most comprehensive agriculture supply chain platform.
                            Document every event, verify every product, and build unshakeable
                            consumer trust with blockchain-backed traceability.
                        </p>

                        <div className="hero-cta animate-fadeInUp stagger-3">
                            <Link to="/register" className="btn btn-accent btn-lg">
                                Start Free Trial
                                <ChevronRight size={20} />
                            </Link>
                            <Link to="/verify" className="btn btn-outline-light btn-lg">
                                <QrCode size={20} />
                                Verify Product
                            </Link>
                        </div>

                        <div className="hero-stats animate-fadeInUp stagger-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="hero-stat">
                                    <span className="hero-stat-value">{stat.value}</span>
                                    <span className="hero-stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hero-visual animate-fadeInUp stagger-3">
                        <div className="hero-card hero-card-main">
                            <div className="hero-card-header">
                                <div className="hero-card-dot"></div>
                                <div className="hero-card-dot"></div>
                                <div className="hero-card-dot"></div>
                            </div>
                            <div className="hero-card-body">
                                <div className="hero-batch-info">
                                    <div className="hero-batch-id">
                                        <span className="label">Batch ID</span>
                                        <span className="value font-mono">ORG-2024-0847</span>
                                    </div>
                                    <div className="badge badge-success">✓ Verified</div>
                                </div>
                                <div className="hero-product">
                                    <div className="hero-product-img">🌾</div>
                                    <div className="hero-product-info">
                                        <h4>Organic Wheat</h4>
                                        <p>Golden Valley Farm, Punjab</p>
                                    </div>
                                </div>
                                <div className="hero-timeline-preview">
                                    <div className="hero-timeline-item">
                                        <div className="hero-timeline-dot success"></div>
                                        <span>Harvested</span>
                                        <span className="time">Dec 5, 2024</span>
                                    </div>
                                    <div className="hero-timeline-item">
                                        <div className="hero-timeline-dot warning"></div>
                                        <span>Processing</span>
                                        <span className="time">Dec 7, 2024</span>
                                    </div>
                                    <div className="hero-timeline-item active">
                                        <div className="hero-timeline-dot info"></div>
                                        <span>In Transit</span>
                                        <span className="time">Dec 9, 2024</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hero-card-floating hero-card-qr animate-float">
                            <QrCode size={64} strokeWidth={1.5} />
                            <span>Scan to verify</span>
                        </div>

                        <div className="hero-card-floating hero-card-blockchain animate-float" style={{ animationDelay: '1s' }}>
                            <Cpu size={24} />
                            <span>Blockchain Verified</span>
                            <div className="hash font-mono">0x8f4a...2e9d</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stakeholders Flow */}
            <section className="stakeholders-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Complete Supply Chain Coverage</h2>
                        <p>Every stakeholder, every step, one unified platform</p>
                    </div>

                    <div className="stakeholders-flow">
                        {stakeholders.map((item, index) => (
                            <div key={index} className="stakeholder-item">
                                <div className="stakeholder-icon">{item.icon}</div>
                                <h4>{item.label}</h4>
                                <p>{item.desc}</p>
                                {index < stakeholders.length - 1 && (
                                    <div className="stakeholder-arrow">
                                        <ArrowRight size={24} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">
                            <Globe size={16} />
                            <span>Platform Features</span>
                        </div>
                        <h2>Everything You Need for<br /><span className="text-gradient">Supply Chain Transparency</span></h2>
                        <p>Powerful tools to document, track, and verify your entire product lifecycle</p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`feature-card feature-card-${feature.color}`}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                                <div className="feature-link">
                                    Learn more <ArrowRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="how-it-works-section">
                <div className="container">
                    <div className="section-header text-center">
                        <div className="section-badge">
                            <Cpu size={16} />
                            <span>Simple Process</span>
                        </div>
                        <h2>How AgriTrace Works</h2>
                        <p>Get started in minutes, not months</p>
                    </div>

                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">01</div>
                            <div className="step-content">
                                <h3>Create Batch</h3>
                                <p>Register your product batch with origin details, weight, and specifications. Get an instant unique batch ID.</p>
                            </div>
                            <div className="step-visual">
                                <div className="step-icon-wrap">
                                    <Wheat size={32} />
                                </div>
                            </div>
                        </div>

                        <div className="step-connector"></div>

                        <div className="step-card">
                            <div className="step-number">02</div>
                            <div className="step-content">
                                <h3>Track Events</h3>
                                <p>Document every step - processing, quality checks, packaging, shipping. Each event is recorded on blockchain.</p>
                            </div>
                            <div className="step-visual">
                                <div className="step-icon-wrap">
                                    <TrendingUp size={32} />
                                </div>
                            </div>
                        </div>

                        <div className="step-connector"></div>

                        <div className="step-card">
                            <div className="step-number">03</div>
                            <div className="step-content">
                                <h3>Generate QR</h3>
                                <p>Automatically generate secure QR codes for end products. Prevent counterfeits with verified authenticity.</p>
                            </div>
                            <div className="step-visual">
                                <div className="step-icon-wrap">
                                    <QrCode size={32} />
                                </div>
                            </div>
                        </div>

                        <div className="step-connector"></div>

                        <div className="step-card">
                            <div className="step-number">04</div>
                            <div className="step-content">
                                <h3>Consumer Verifies</h3>
                                <p>Customers scan QR codes to see the complete product journey - building trust and brand loyalty.</p>
                            </div>
                            <div className="step-visual">
                                <div className="step-icon-wrap">
                                    <Shield size={32} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="benefits-section">
                <div className="container">
                    <div className="benefits-wrapper">
                        <div className="benefits-content">
                            <div className="section-badge">
                                <CheckCircle2 size={16} />
                                <span>Why Choose Us</span>
                            </div>
                            <h2>Build Trust Through<br /><span className="text-gradient">Transparency</span></h2>
                            <p className="benefits-intro">
                                In a world of counterfeit products and trust deficits,
                                AgriTrace gives you the tools to prove your authenticity.
                            </p>

                            <ul className="benefits-list">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="benefit-item">
                                        <CheckCircle2 size={20} />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/register" className="btn btn-primary btn-lg">
                                Start Building Trust
                                <ArrowRight size={18} />
                            </Link>
                        </div>

                        <div className="benefits-visual">
                            <div className="benefits-card">
                                <div className="benefits-card-glow"></div>
                                <div className="benefits-metric">
                                    <span className="metric-value">40%</span>
                                    <span className="metric-label">Reduction in counterfeits</span>
                                </div>
                                <div className="benefits-metric">
                                    <span className="metric-value">3x</span>
                                    <span className="metric-label">Faster recall response</span>
                                </div>
                                <div className="benefits-metric">
                                    <span className="metric-value">92%</span>
                                    <span className="metric-label">Consumer trust increase</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-bg"></div>
                        <div className="cta-content">
                            <h2>Ready to Transform Your Supply Chain?</h2>
                            <p>Join hundreds of agri-businesses already using AgriTrace to build consumer trust.</p>
                            <div className="cta-buttons">
                                <Link to="/register" className="btn btn-accent btn-lg">
                                    Get Started Free
                                    <ArrowRight size={18} />
                                </Link>
                                <a href="#contact" className="btn btn-outline-light btn-lg">
                                    Schedule Demo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <Link to="/" className="nav-logo">
                                <div className="logo-icon">
                                    <Leaf size={24} />
                                </div>
                                <span>AgriTrace</span>
                            </Link>
                            <p>Building trust in agriculture, one verified product at a time.</p>
                        </div>

                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Platform</h4>
                                <a href="#features">Features</a>
                                <a href="#how-it-works">How It Works</a>
                                <a href="#pricing">Pricing</a>
                            </div>
                            <div className="footer-column">
                                <h4>Resources</h4>
                                <a href="#docs">Documentation</a>
                                <a href="#api">API Reference</a>
                                <a href="#support">Support</a>
                            </div>
                            <div className="footer-column">
                                <h4>Company</h4>
                                <a href="#about">About</a>
                                <a href="#contact">Contact</a>
                                <a href="#careers">Careers</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2024 AgriTrace. All rights reserved.</p>
                        <div className="footer-legal">
                            <a href="#privacy">Privacy Policy</a>
                            <a href="#terms">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
