import { useState, useEffect, useCallback } from 'react'
import { 
  Compass, Sun, Moon, Sparkles, Clock, MapPin, Target, Globe,
  CreditCard, Download, BookOpen, ShieldCheck, 
  Calendar, Flame, Droplets, Wind, Mountain, 
  Menu, X, ChevronRight, ArrowRight, Lock, Unlock,
  CheckCircle, AlertCircle, Coffee, Eye, Heart, Share2,
  Plus, Trash2, Save, Package, Users, ShoppingCart, BarChart3
} from 'lucide-react'
import './App.css'
import CosmicBackground from './CosmicBackground.jsx'

// Brand assets (imported for bundler awareness; referenced by URL in img tags)
import catabolicMorning from './assets/catabolic-morning.png'
import hybridMidday from './assets/hybrid-midday.png'
import anabolicEvening from './assets/anabolic-evening.png'
import sealingNight from './assets/sealing-night.png'
import signalDust from './assets/signal-dust.png'
import furnacePaste from './assets/furnace-paste.png'
import brothCubes from './assets/broth-cubes.png'
import esoImage from './assets/eso.png'

// Import real astrological calculation engine
import { 
  calculateChart, 
  geocodeLocation,
  TIMEZONE_OPTIONS
} from './astrology.js'

function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareTooltip, setShareTooltip] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [tabTransitioning, setTabTransitioning] = useState(false);

  // Page load entrance animation
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  // IntersectionObserver for scroll-triggered reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll(
      '.fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale'
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTab]);

  // Parallax effect on hero scroll
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('.hero-section');
      if (!hero) return;
      const scrollY = window.scrollY;
      const parallaxElements = hero.querySelectorAll('.parallax-container');
      parallaxElements.forEach((el) => {
        const speed = el.dataset.speed || 0.15;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const SITE_URL = 'https://00f5400b642158d415ced27cbc4727f9.ctonew.app';
  const SHARE_TEXT = 'Esonutra — The Esoteric Diet: Align your natal chart with the Fourfold Day eating rhythm.';

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SITE_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const shareOnFacebook = () => {
    const url = `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(SHARE_TEXT)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(SITE_URL).then(() => {
      setShareTooltip('Link copied!');
      setTimeout(() => setShareTooltip(''), 2000);
    }).catch(() => {
      setShareTooltip('Failed to copy');
      setTimeout(() => setShareTooltip(''), 2000);
    });
  };

  const INSTAGRAM_USERNAME = 'tobiasianism';

  const shareOnInstagram = () => {
    window.open(`https://instagram.com/${INSTAGRAM_USERNAME}`, '_blank', 'noopener,noreferrer');
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthTimezone: 'Pacific/Auckland',
    birthLocation: '',
    latitude: '',
    longitude: ''
  });
  const [geocodingStatus, setGeocodingStatus] = useState(''); // '', 'loading', 'found', 'error'
  const [errors, setErrors] = useState({});
  const [analyzingState, setAnalyzingState] = useState(0); // 0=idle, 1=analyzing, 2=complete
  const [analyzingText, setAnalyzingText] = useState('');
  
  // Personalized Results State
  const [chartResult, setChartResult] = useState(null);

  // Admin Dashboard State
  const ADMIN_PASSWORD = 'esonutra2024';
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPasswordError, setAdminPasswordError] = useState('');
  const [adminTab, setAdminTab] = useState('overview');
  
  // Dashboard data
  const [chartIntakes, setChartIntakes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('esonutra_intakes') || '[]'); } catch { return []; }
  });
  const [products, setProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('esonutra_products') || '[]'); } catch { return []; }
  });
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('esonutra_orders') || '[]'); } catch { return []; }
  });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Auto-scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Loading animation simulation
  useEffect(() => {
    if (analyzingState === 1) {
      const steps = [
        "Mapping Solar Placement & Declination...",
        "Identifying Natal Ascendant Body Gate...",
        "Evaluating Thermal Imbalances in House Placements...",
        "Structuring the Fourfold Day Eating Canon...",
        "Grafting Safety Layer & NZ MPI Compliance Codes...",
        "Formulating Personal Ingestion Compendium..."
      ];
      
      let stepIndex = 0;
      setAnalyzingText(steps[0]);
      
      const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length) {
          setAnalyzingText(steps[stepIndex]);
        } else {
          clearInterval(interval);
          setAnalyzingState(2);
          setActiveTab('blueprint');
        }
      }, 700);
      
      return () => clearInterval(interval);
    }
  }, [analyzingState]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Your name or birth identifier is required.";
    if (!formData.birthDate) newErrors.birthDate = "Birth date is required for sun alignment.";
    if (!formData.birthTime) newErrors.birthTime = "Birth time is crucial for Ascendant Body Gate calculations.";
    if (!formData.birthLocation.trim()) newErrors.birthLocation = "Birth city/location is required for coordinates.";
    
    // Validate lat/lng if provided
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (formData.latitude && (isNaN(lat) || lat < -90 || lat > 90)) {
      newErrors.latitude = "Latitude must be between -90 and 90.";
    }
    if (formData.longitude && (isNaN(lng) || lng < -180 || lng > 180)) {
      newErrors.longitude = "Longitude must be between -180 and 180.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGeocode = async () => {
    if (!formData.birthLocation.trim()) {
      setErrors(prev => ({ ...prev, birthLocation: "Enter a location first." }));
      return;
    }
    setGeocodingStatus('loading');
    const result = await geocodeLocation(formData.birthLocation);
    if (result) {
      setFormData(prev => ({
        ...prev,
        latitude: result.lat.toString(),
        longitude: result.lng.toString()
      }));
      setGeocodingStatus('found');
    } else {
      setGeocodingStatus('error');
    }
  };

  const handleSubmitIntake = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Calculate chart using real ephemeris-based engine
    const result = calculateChart(formData);
    
    setChartResult(result);
    setAnalyzingState(1);
    
    // Save to localStorage for admin dashboard
    const intake = {
      id: Date.now().toString(),
      name: formData.name,
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      location: formData.birthLocation,
      timezone: formData.birthTimezone,
      latitude: formData.latitude,
      longitude: formData.longitude,
      timestamp: new Date().toISOString(),
      sunSign: result?.sunSign?.name || '',
      ascendant: result?.ascendantSign?.name || '',
      bodyGate: result?.bodyGate || ''
    };
    const existing = JSON.parse(localStorage.getItem('esonutra_intakes') || '[]');
    existing.unshift(intake);
    localStorage.setItem('esonutra_intakes', JSON.stringify(existing));
    setChartIntakes(existing);
  };

  // Admin Dashboard Handlers
  const handleAdminLogin = (e) => {
    if (e) e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminAuthenticated(true);
      setAdminPasswordError('');
      setAdminPassword('');
      setActiveTab('admin');
      document.getElementById('admin-password-modal')?.classList.remove('visible');
    } else {
      setAdminPasswordError('Incorrect password. Try again.');
    }
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setAdminPassword('');
    setAdminPasswordError('');
    setActiveTab('landing');
  };

  const handleAdminNavClick = () => {
    if (adminAuthenticated) {
      setActiveTab('admin');
    } else {
      setAdminPassword('');
      setAdminPasswordError('');
      document.getElementById('admin-password-modal')?.classList.add('visible');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Product management
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', status: 'active' });
  const [showProductForm, setShowProductForm] = useState(false);

  const defaultProducts = [
    { id: 'p1', name: 'Broth Cubes', description: 'Concentrated mineral bone broth cubes for Anabolic phase', price: '24.00', status: 'active' },
    { id: 'p2', name: 'Furnace Paste', description: 'Nighttime sealing botanical paste', price: '32.00', status: 'active' },
    { id: 'p3', name: 'Signal Dust', description: 'Morning catalyst powder for Catabolic phase', price: '28.00', status: 'active' },
    { id: 'p4', name: 'Seed Memory Paste', description: 'Hybrid midday grounding paste with sprouted seeds', price: '26.00', status: 'draft' },
    { id: 'p5', name: "Worker's Salt", description: 'Mineral electrolyte salt blend for active days', price: '18.00', status: 'active' }
  ];

  const initProducts = () => {
    const stored = localStorage.getItem('esonutra_products');
    if (!stored || JSON.parse(stored).length === 0) {
      localStorage.setItem('esonutra_products', JSON.stringify(defaultProducts));
      setProducts(defaultProducts);
    }
  };

  useEffect(() => { initProducts(); }, []);

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price.trim()) return;
    const product = {
      id: 'p' + Date.now(),
      ...newProduct
    };
    const updated = [...products, product];
    setProducts(updated);
    localStorage.setItem('esonutra_products', JSON.stringify(updated));
    setNewProduct({ name: '', description: '', price: '', status: 'active' });
    setShowProductForm(false);
    showToast('Product added successfully');
  };

  const handleUpdateProduct = (id, field, value) => {
    const updated = products.map(p => p.id === id ? { ...p, [field]: value } : p);
    setProducts(updated);
    localStorage.setItem('esonutra_products', JSON.stringify(updated));
    showToast('Product updated');
  };

  const handleDeleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('esonutra_products', JSON.stringify(updated));
    showToast('Product deleted');
  };

  // Order management
  const [newOrder, setNewOrder] = useState({ customer: '', product: '', quantity: '1', total: '', status: 'Pending' });
  const [showOrderForm, setShowOrderForm] = useState(false);

  const handleAddOrder = () => {
    if (!newOrder.customer.trim() || !newOrder.product.trim() || !newOrder.total.trim()) return;
    const order = {
      id: 'o' + Date.now(),
      ...newOrder,
      quantity: parseInt(newOrder.quantity) || 1,
      total: parseFloat(newOrder.total).toFixed(2),
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [...orders, order];
    setOrders(updated);
    localStorage.setItem('esonutra_orders', JSON.stringify(updated));
    setNewOrder({ customer: '', product: '', quantity: '1', total: '', status: 'Pending' });
    setShowOrderForm(false);
    showToast('Order added');
  };

  const handleUpdateOrderStatus = (id, status) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('esonutra_orders', JSON.stringify(updated));
  };

  const handleDeleteOrder = (id) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    localStorage.setItem('esonutra_orders', JSON.stringify(updated));
    showToast('Order deleted');
  };

  const handleResetIntake = () => {
    setAnalyzingState(0);
    setFormData({
      name: '',
      birthDate: '',
      birthTime: '',
      birthTimezone: 'Pacific/Auckland',
      birthLocation: '',
      latitude: '',
      longitude: ''
    });
    setGeocodingStatus('');
    setChartResult(null);
    setActiveTab('intake');
  };

  // Ripple effect on buttons
  const createRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  // Tab transition with smooth fade
  const transitionToTab = (tab) => {
    if (tab === activeTab) return;
    setTabTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setTimeout(() => {
        setTabTransitioning(false);
      }, 50);
    }, 200);
  };

  // 3D Tilt effect for cards
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -8;
    const rotateY = (x - centerX) / centerX * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <>
      {/* Cosmic Background */}
      <div className="cosmic-bg">
        <CosmicBackground />
      </div>
      <div className="cosmic-orb cosmic-orb-1"></div>
      <div className="cosmic-orb cosmic-orb-2"></div>
      <div className="cosmic-orb cosmic-orb-3"></div>

      {/* Navigation */}
      <nav className={`nav-bar page-entrance entrance-nav ${pageLoaded ? 'loaded' : ''}`}>
        <div className="brand" onClick={() => setActiveTab('landing')} style={{ cursor: 'pointer' }}>
          <img src="/Pneuma/logo.svg" alt="Esonutra" width="32" height="32" style={{ filter: 'drop-shadow(0 0 6px #e2b857)' }} />
          <span className="brand-font">ESONUTRA</span>
        </div>
        
        {/* Desktop Links */}
        <div className="nav-links">
          <span className={`nav-link ${activeTab === 'landing' ? 'active' : ''}`} onClick={() => transitionToTab('landing')}>The Doctrine</span>
          <span className={`nav-link ${activeTab === 'rotation' ? 'active' : ''}`} onClick={() => transitionToTab('rotation')}>Weekly Rotation</span>
          <span className={`nav-link ${activeTab === 'intake' || activeTab === 'blueprint' ? 'active' : ''}`} onClick={() => {
            if (chartResult) transitionToTab('blueprint');
            else transitionToTab('intake');
          }}>Natal Intake</span>
          <span className={`nav-link ${activeTab === 'post-purchase' ? 'active' : ''}`} onClick={() => transitionToTab('post-purchase')}>Report Retrieval</span>
          <span className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`} onClick={handleAdminNavClick}>
            {adminAuthenticated ? <Unlock size={14} /> : <Lock size={14} />} Admin
          </span>
          <button className="cta-nav-button btn-pulse" onClick={(e) => {
            createRipple(e);
            if (chartResult) transitionToTab('blueprint');
            else transitionToTab('intake');
          }}>GET YOUR CHART</button>
        </div>
      </nav>

      <div className={`page-container ${tabTransitioning ? 'tab-transition' : 'tab-transition active'}`}>
        {/* LANDING PAGE VIEW */}
        {activeTab === 'landing' && (
          <div>
            {/* Hero Section */}
            <header className={`hero-section page-entrance entrance-hero ${pageLoaded ? 'loaded' : ''}`}>
              {/* Rotating Zodiac Wheel background */}
              <svg className="hero-zodiac-wheel" viewBox="0 0 800 800" fill="none">
                <circle cx="400" cy="400" r="380" stroke="#e2b857" strokeWidth="1" opacity="0.5" strokeDasharray="8 16"/>
                <circle cx="400" cy="400" r="350" stroke="#e2b857" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 20"/>
                <circle cx="400" cy="400" r="320" stroke="#e2b857" strokeWidth="0.3" opacity="0.15"/>
                <g opacity="0.6">
                  <text x="400" y="60" textAnchor="middle" fill="#e2b857" fontSize="20" fontFamily="Cinzel">♈</text>
                  <text x="660" y="410" textAnchor="middle" fill="#e2b857" fontSize="20" fontFamily="Cinzel">♌</text>
                  <text x="400" y="760" textAnchor="middle" fill="#e2b857" fontSize="20" fontFamily="Cinzel">♎</text>
                  <text x="140" y="410" textAnchor="middle" fill="#e2b857" fontSize="20" fontFamily="Cinzel">♑</text>
                  <text x="560" y="140" textAnchor="middle" fill="#e2b857" fontSize="16" fontFamily="Cinzel">♊</text>
                  <text x="580" y="680" textAnchor="middle" fill="#e2b857" fontSize="16" fontFamily="Cinzel">♐</text>
                  <text x="220" y="140" textAnchor="middle" fill="#e2b857" fontSize="16" fontFamily="Cinzel">♉</text>
                  <text x="240" y="680" textAnchor="middle" fill="#e2b857" fontSize="16" fontFamily="Cinzel">♏</text>
                </g>
              </svg>
              
              {/* Hero decorative particles */}
              <div className="hero-particle"></div>
              <div className="hero-particle"></div>
              <div className="hero-particle"></div>
              <div className="hero-particle"></div>
              <div className="hero-particle"></div>
              <div className="hero-particle"></div>
              <div className="hero-particle"></div>
              <div className="hero-particle"></div>
              <div className="hero-particle"></div>
              <div className="hero-particle"></div>

              <span className="hero-tag">A The Esoteric Diet</span>
              <h1 className="hero-title">
                Align Your Natal Chart With 
                <span>THE FOURFOLD DAY</span>
              </h1>
              <p className="hero-subtitle">
                An advanced nutritional alignment system mapping birth gate placements and planetary times to a highly precise recipe canon, balancing your somatic correction layer and deep bodily gates.
              </p>
              <div className="hero-ctas">
                <button className="btn-primary btn-pulse" onClick={(e) => {
                  createRipple(e);
                  transitionToTab('intake');
                }}>
                  Begin Natal Chart Intake <ArrowRight size={18} />
                </button>
                <button className="btn-secondary" onClick={(e) => {
                  createRipple(e);
                  const element = document.getElementById('doctrine');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Explore Doctrine
                </button>
              </div>
            </header>

            {/* ESO — Mystical Guide Character */}
            <section className="eso-section fade-in-up">
              <div className="eso-container">
                <div className="eso-avatar-wrapper">
                  <img src={esoImage} alt="ESO — Your Spiritual Guide" className="eso-avatar" />
                  <div className="eso-glow"></div>
                </div>
                <div className="eso-speech">
                  <p className="eso-greeting">I am <strong>ESO</strong>, your guide through the esoteric diet.</p>
                  <p className="eso-message">Let me show you the <span className="highlight-gold">Fourfold Day</span>.</p>
                </div>
                <div className="eso-actions">
                  <button className="btn-primary btn-pulse" onClick={(e) => {
                    createRipple(e);
                    transitionToTab('intake');
                  }}>
                    Begin Chart Intake
                  </button>
                  <button className="btn-secondary" onClick={(e) => {
                    createRipple(e);
                    const el = document.getElementById('doctrine');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    Explore Doctrine
                  </button>
                  <button className="btn-secondary" onClick={(e) => {
                    createRipple(e);
                    transitionToTab('rotation');
                  }}>
                    View Weekly Rotation
                  </button>
                </div>
              </div>
            </section>

            {/* Core Value Props Grid */}
            <section className="page-entrance entrance-content" style={{ margin: '4rem 0' }}>
              <div className="grid-cards">
                <div className="card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
                  <Sparkles className="card-icon" size={36} />
                  <h3 className="card-title">Astral Correction Layer</h3>
                  <p className="card-description">
                    Unlike generic diets, we calculate planetary alignments at your moment of birth to identify structural body gate blockages, correcting the foundational somatic layer first.
                  </p>
                </div>
                <div className="card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
                  <Clock className="card-icon" size={36} />
                  <h3 className="card-title">Planetary Meal Timing</h3>
                  <p className="card-description">
                    The Fourfold Day divides your eating rhythm into four distinct biological gates (Catabolic, Hybrid, Anabolic, and Sealing), aligned with planetary hour rotations for optimal assimilation.
                  </p>
                </div>
                <div className="card" onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
                  <BookOpen className="card-icon" size={36} />
                  <h3 className="card-title">Custom Compendium</h3>
                  <p className="card-description">
                    Receive a massive, personalized 42-page digital manual detailing exact botanical recipes, signal dusts, and timing matrices mapped precisely to your sun and rising nodes.
                  </p>
                </div>
              </div>
            </section>

            {/* The Fourfold Day Doctrine Section */}
            <section id="doctrine" className="doctrine-section fade-in-up">
              <h2 className="section-title">THE FOURFOLD DAY</h2>
              <p className="section-intro">
                Metabolism is not static; it is an elemental pendulum. By structuring our eating window around the four distinct quarters of the day, we sync somatic organs to planetary timings.
              </p>
              
              <div className="rhythm-timeline">
                {/* Node 1 - Catabolic Morning */}
                <div className="rhythm-node">
                  <div className="rhythm-header" style={{ backgroundImage: `url(${catabolicMorning})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="rhythm-time"><Sun size={20} /> 06:00 - 11:00</div>
                      <h3 className="rhythm-name">Catabolic Morning</h3>
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,12,21,0.6)', zIndex: 0 }}></div>
                  </div>
                  <div className="rhythm-body">
                    <div className="rhythm-focus">Focus: Cellular Release & Autophagy Cleansing</div>
                    <p className="rhythm-desc">
                      Morning is the furnace ignition phase. We focus on clearing accumulated wastes through cellular digestion. High heat proteins and dense carbs are strictly avoided to prevent early lymphatic clogging.
                    </p>
                    <div className="rhythm-details">
                      <div>
                        <div className="detail-label">Recipe Canon</div>
                        <div className="detail-value">Warm bitter herbal infusions, raw citrus catalysts, light astringent raw materials.</div>
                      </div>
                      <div>
                        <div className="detail-label">Planetary Ruler</div>
                        <div className="detail-value">Mars & Sun (The Burning Gate)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 2 - Hybrid Midday */}
                <div className="rhythm-node">
                  <div className="rhythm-header" style={{ backgroundImage: `url(${hybridMidday})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="rhythm-time"><Flame size={20} /> 11:00 - 16:00</div>
                      <h3 className="rhythm-name">Hybrid Midday</h3>
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,12,21,0.6)', zIndex: 0 }}></div>
                  </div>
                  <div className="rhythm-body">
                    <div className="rhythm-focus">Focus: Balanced Grounding & Isoglycemic Adaptation</div>
                    <p className="rhythm-desc">
                      The transition gate. Physical energy requires stabilization through thermally grounding elements that prevent rapid insulin surges. We balance thermal energy through root density.
                    </p>
                    <div className="rhythm-details">
                      <div>
                        <div className="detail-label">Recipe Canon</div>
                        <div className="detail-value">Thermal grounding grains (quinoa, wild rice), stewed roots, active bitter greens, clean amino profiles.</div>
                      </div>
                      <div>
                        <div className="detail-label">Planetary Ruler</div>
                        <div className="detail-value">Mercury (The Adapting Node)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 3 - Anabolic Evening */}
                <div className="rhythm-node">
                  <div className="rhythm-header" style={{ backgroundImage: `url(${anabolicEvening})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="rhythm-time"><Moon size={20} /> 16:00 - 21:00</div>
                      <h3 className="rhythm-name">Anabolic Evening</h3>
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,12,21,0.6)', zIndex: 0 }}></div>
                  </div>
                  <div className="rhythm-body">
                    <div className="rhythm-focus">Focus: Restorative Rebuilding & Mineral Loading</div>
                    <p className="rhythm-desc">
                      As solar energy wanes, the physical body enters the anabolic rebuilding phase. It is now ready for tissue reconstruction, requiring high-density minerals and slow-release nourishing lipids.
                    </p>
                    <div className="rhythm-details">
                      <div>
                        <div className="detail-label">Recipe Canon</div>
                        <div className="detail-value">Premium bone and mineral broths, regenerative proteins, healthy dense lipids (ghee, avocado, olive).</div>
                      </div>
                      <div>
                        <div className="detail-label">Planetary Ruler</div>
                        <div className="detail-value">Moon & Venus (The Nurturing Depths)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 4 - Sealing Night */}
                <div className="rhythm-node">
                  <div className="rhythm-header" style={{ backgroundImage: `url(${sealingNight})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="rhythm-time"><Lock size={20} /> 21:00 - 06:00</div>
                      <h3 className="rhythm-name">Sealing Night</h3>
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,12,21,0.6)', zIndex: 0 }}></div>
                  </div>
                  <div className="rhythm-body">
                    <div className="rhythm-focus">Focus: Gut Sealing & Autonomic Nervous Transition</div>
                    <p className="rhythm-desc">
                      A total cessation of interactive digestion. The stomach gate is hermetically locked. We use concentrated non-interactive botanicals to seal the gut boundary and induce deep neural repair.
                    </p>
                    <div className="rhythm-details">
                      <div>
                        <div className="detail-label">Recipe Canon</div>
                        <div className="detail-value">Preservative herbal extractions, concentrated Furnace Pastes, no solid intake.</div>
                      </div>
                      <div>
                        <div className="detail-label">Planetary Ruler</div>
                        <div className="detail-value">Saturn (The Boundary Wall)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Science, Standards & Safety Layer Section */}
            <section className="safety-section fade-in-up">
              <div className="safety-content">
                <div className="safety-badge">
                  <ShieldCheck size={16} /> RIGOROUS SCIENCE & STANDARDS
                </div>
                <h2>A Grounded Safety Layer</h2>
                <p className="hero-subtitle" style={{ fontSize: '1.05rem', margin: '0 0 1.5rem', textAlign: 'left' }}>
                  Esonutra is a synthesis of cosmic timing and strict modern physical safety. Our systems are fully grounded in New Zealand Ministry for Primary Industries (NZ MPI) and Health New Zealand standards to ensure somatic protection.
                </p>
                <ul className="safety-list">
                  <li className="safety-item">
                    <CheckCircle className="safety-icon" size={24} />
                    <div>
                      <h4 className="safety-item-title">Verified Pathogen-Free Botanicals</h4>
                      <p className="safety-item-desc">We enforce strict NZ food standards. Every botanical catalyst, Signal Dust, or Furnace Paste ingredient is sourced strictly from certified-organic, MPI-registered commercial operators. No raw wildcrafting pathogens.</p>
                    </div>
                  </li>
                  <li className="safety-item">
                    <CheckCircle className="safety-icon" size={24} />
                    <div>
                      <h4 className="safety-item-title">Thermal Precision Protocol</h4>
                      <p className="safety-item-desc">All recipes in the Anabolic and Hybrid phases define strict cooking temperature mandates in compliance with Health New Zealand pathogen inactivation guidelines. Real physical safety protecting your digestive gates.</p>
                    </div>
                  </li>
                  <li className="safety-item">
                    <CheckCircle className="safety-icon" size={24} />
                    <div>
                      <h4 className="safety-item-title">Somatic Allergen Auditing</h4>
                      <p className="safety-item-desc">Your personalized compendium automatically runs an MPI-standard allergen audit, screening out food triggers. Astrology serves as the energetic correction layer; physical science provides the safe container.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="safety-seal-box">
                  <img src="/Pneuma/logo.svg" alt="" width="60" height="60" style={{ filter: 'drop-shadow(0 0 8px rgba(226, 184, 87, 0.5))' }} />
                  <div className="seal-title">NZ MPI ALIGNED</div>
                  <p className="seal-desc">This system matches certified food safety standards and New Zealand botanical handling regulations, ensuring clean, non-toxic prep.</p>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 'bold', marginTop: '1rem', border: '1px solid #34d399', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>SAFETY CERTIFIED</div>
                </div>
              </div>
            </section>

            {/* CTA block */}
            <section className="fade-in-up" style={{ textAlign: 'center', margin: '6rem 0 3rem' }}>
              <div style={{ background: 'var(--bg-void)', border: '1px solid var(--border-cosmic)', borderRadius: '16px', padding: '3.5rem 2rem' }}>
                <h2 style={{ fontSize: '2rem', margin: '0 0 1rem' }}>Discover Your Personal Eating Canon</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
                  Input your exact birth details. Our alignment generator will immediately project your Sun/Ascendant Body Gate and build your path to a custom compendium.
                </p>
                <button className="btn-primary btn-pulse" style={{ marginInline: 'auto' }} onClick={(e) => {
                  createRipple(e);
                  transitionToTab('intake');
                }}>
                  Calculate My Natal Intake <Sparkles size={18} />
                </button>
              </div>
            </section>
          </div>
        )}

        {/* NATAL CHART INTAKE FORM VIEW */}
        {activeTab === 'intake' && (
          <div>
            {analyzingState === 0 ? (
              <div className="intake-card fade-in-up">
                <div className="intake-header">
                  <Compass size={40} className="brand-symbol" style={{ marginBottom: '1rem' }} />
                  <h2 className="intake-title">Natal Alignment Intake</h2>
                  <p className="intake-desc">
                    To compute your celestial body gate and map your Fourfold Day eating canon, we require your exact birth timeline. All data processed securely.
                  </p>
                </div>
                
                <form className="intake-body" onSubmit={handleSubmitIntake}>
                  <div className="form-group">
                    <label className="form-label">
                      <Eye size={16} /> Name / Identifer <span>*</span>
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input" 
                      placeholder="e.g. Leo Vance" 
                    />
                    {errors.name && <div className="validation-error"><AlertCircle size={14} /> {errors.name}</div>}
                    <div className="form-note">Used to personalize your 42-page Compendium Report.</div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <Calendar size={16} /> Birth Date <span>*</span>
                      </label>
                      <input 
                        type="text" 
                        name="birthDate" 
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="form-input" 
                        placeholder="YYYY-MM-DD"
                      />
                      {errors.birthDate && <div className="validation-error"><AlertCircle size={14} /> {errors.birthDate}</div>}
                      <div className="form-note">Sun sign, elemental excess calculator.</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Clock size={16} /> Birth Time <span>*</span>
                      </label>
                      <input 
                        type="text" 
                        name="birthTime" 
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        className="form-input" 
                        placeholder="HH:MM (e.g. 14:30 or 08:30)"
                      />
                      {errors.birthTime && <div className="validation-error"><AlertCircle size={14} /> {errors.birthTime}</div>}
                      <div className="form-note">Crucial for Rising Node & Body Gate mapping.</div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <Compass size={16} /> Timezone at Birth
                      </label>
                      <select 
                        name="birthTimezone" 
                        value={formData.birthTimezone}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="Pacific/Auckland">Auckland (NZST/NZDT - UTC+12/13)</option>
                        <option value="America/New_York">Eastern Time (EST/EDT - UTC-5/4)</option>
                        <option value="America/Chicago">Central Time (CST/CDT - UTC-6/5)</option>
                        <option value="America/Denver">Mountain Time (MST/MDT - UTC-7/6)</option>
                        <option value="America/Los_Angeles">Pacific Time (PST/PDT - UTC-8/7)</option>
                        <option value="Europe/London">London (GMT/BST - UTC+0/1)</option>
                        <option value="Europe/Paris">Paris (CET/CEST - UTC+1/2)</option>
                        <option value="Asia/Tokyo">Tokyo (JST - UTC+9)</option>
                        <option value="UTC">UTC / Greenwich Mean</option>
                      </select>
                      <div className="form-note">Aligns birth hour with planetary angles.</div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <MapPin size={16} /> Birth Location <span>*</span>
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <input 
                            type="text" 
                            name="birthLocation" 
                            value={formData.birthLocation}
                            onChange={handleInputChange}
                            className="form-input" 
                            placeholder="e.g. Wellington, NZ" 
                          />
                          {errors.birthLocation && <div className="validation-error"><AlertCircle size={14} /> {errors.birthLocation}</div>}
                        </div>
                        <button 
                          type="button" 
                          onClick={handleGeocode}
                          className="btn-geocode"
                          disabled={geocodingStatus === 'loading'}
                          style={{
                            padding: '0.6rem 1rem',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-cosmic)',
                            borderRadius: '8px',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.85rem'
                          }}
                        >
                          <Target size={14} />
                          {geocodingStatus === 'loading' ? 'Finding...' : 'Find Coords'}
                        </button>
                      </div>
                      <div className="form-note">
                        Determines coordinates for accurate Ascendant calculation.
                        {geocodingStatus === 'found' && (
                          <span style={{ color: '#34d399', marginLeft: '0.5rem' }}>
                            ✓ Coordinates found
                          </span>
                        )}
                        {geocodingStatus === 'error' && (
                          <span style={{ color: '#f87171', marginLeft: '0.5rem' }}>
                            Could not find coordinates. Enter manually below.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">
                          <Globe size={16} /> Latitude
                        </label>
                        <input 
                          type="text" 
                          name="latitude" 
                          value={formData.latitude}
                          onChange={handleInputChange}
                          className="form-input" 
                          placeholder="e.g. -41.2865" 
                        />
                        {errors.latitude && <div className="validation-error"><AlertCircle size={14} /> {errors.latitude}</div>}
                        <div className="form-note">Decimal degrees. Negative for South.</div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <Globe size={16} /> Longitude
                        </label>
                        <input 
                          type="text" 
                          name="longitude" 
                          value={formData.longitude}
                          onChange={handleInputChange}
                          className="form-input" 
                          placeholder="e.g. 174.7762" 
                        />
                        {errors.longitude && <div className="validation-error"><AlertCircle size={14} /> {errors.longitude}</div>}
                        <div className="form-note">Decimal degrees. Negative for West.</div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="submit-button" onClick={createRipple}>
                    Generate My Astrological Food Blueprint <Sparkles size={18} />
                  </button>
                </form>
              </div>
            ) : (
              /* Analyzing State */
              <div className="blueprint-card">
                <div className="loading-box">
                  <div className="loading-visual">
                    <div className="loading-ring"></div>
                    <div className="loading-ring"></div>
                    <div className="loading-ring"></div>
                    <div className="loading-orb"></div>
                    <div className="loading-orb"></div>
                    <div className="loading-orb"></div>
                  </div>
                  <h3 className="loading-title">CALCULATING ALIGNMENTS</h3>
                  <p className="loading-status">{analyzingText}</p>
                  <div className="loading-progress-bar">
                    <div className="loading-progress-fill"></div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', marginTop: '1.5rem' }}>
                    Securing safe botanical calibrations according to NZ food rules...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BLUEPRINT REVEAL VIEW */}
        {activeTab === 'blueprint' && chartResult && (
          <div className="blueprint-card">
            <div className="blueprint-header">
              <div className="blueprint-seal" style={{ color: chartResult.sunSign.color }}>✹</div>
              <h2 className="blueprint-title">YOUR SOMATIC BLUEPRINT</h2>
              <p className="blueprint-meta">
                Calibrated for <strong>{formData.name}</strong> • Birth: {formData.birthDate} ({formData.birthLocation})
              </p>
            </div>

            <div className="blueprint-body">
              {/* Astrological Metrics Grid */}
              <div className="chart-grid">
                <div className="chart-metric">
                  <div className="metric-label">Sun Sign Alignment</div>
                  <div className="metric-value" style={{ color: chartResult.sunSign.color }}>{chartResult.sunSign.name}</div>
                  <div className="metric-desc">Element: {chartResult.sunSign.element}</div>
                </div>
                <div className="chart-metric">
                  <div className="metric-label">Rising Sign Node</div>
                  <div className="metric-value" style={{ color: chartResult.ascendantSign.color }}>{chartResult.ascendantSign.name}</div>
                  <div className="metric-desc">Somatic Horizon Sign</div>
                </div>
                <div className="chart-metric">
                  <div className="metric-label">Active Body Gate</div>
                  <div className="metric-value" style={{ color: 'var(--text-gold)' }}>{chartResult.bodyGate}</div>
                  <div className="metric-desc">Correction Node</div>
                </div>
              </div>

              {/* Specific Imbalance banner */}
              <div className="imbalance-banner">
                <div className="imbalance-header">
                  <AlertCircle size={20} />
                  Astrological Imbalance Assessment: {chartResult.bodyGate}
                </div>
                <p className="imbalance-desc">
                  Our calculations reveal an excess of <strong>{chartResult.elementalExcess}</strong> energy blockages in your somatic gate. {chartResult.correctiveAction}
                </p>
              </div>

              {/* Revenue Block / Stripe checkout button */}
              <div className="offer-box">
                <div className="offer-tag">Exclusive Report Offer</div>
                <h3 className="offer-title">Personalized 42-Page Compendium</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 1.5rem', lineHeight: '1.5' }}>
                  Your somatic signature indicates structural blockages. Get your complete personalized nutritional canon, detailed recipe guidelines, Signal Dusts ratios, and NZ MPI safe botanical protocols.
                </p>
                <div className="offer-price">
                  <span>$79.00</span> $29.00 <span style={{ textDecoration: 'none', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Save 63%</span>
                </div>
                
                <ul className="offer-bullets">
                  <li className="offer-bullet">
                    <CheckCircle className="offer-bullet-icon" size={18} />
                    <span><strong>Tailored Recipe Canon:</strong> Cooking procedures optimized for {chartResult.sunSign.name} and {chartResult.bodyGate}.</span>
                  </li>
                  <li className="offer-bullet">
                    <CheckCircle className="offer-bullet-icon" size={18} />
                    <span><strong>Planetary Hours Alignment:</strong> Hour-by-hour calendar mapping the Fourfold Day specifically to your natal coordinate.</span>
                  </li>
                  <li className="offer-bullet">
                    <CheckCircle className="offer-bullet-icon" size={18} />
                    <span><strong>Somatic Botanical Ratios:</strong> Complete recipes for Signal Dust extractions and safe, MPI-standard non-toxic prep.</span>
                  </li>
                  <li className="offer-bullet">
                    <CheckCircle className="offer-bullet-icon" size={18} />
                    <span><strong>100% Safe Sourcing Registry:</strong> Curated list of verified commercial organic botanical vendors in New Zealand.</span>
                  </li>
                </ul>

                {/* Secure Stripe link */}
                <a
                  href="https://buy.stripe.com/bJefZhemgc3i2Zb3tGfnO00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stripe-btn btn-pulse"
                >
                  <CreditCard size={20} /> PURCHASE REPORT SECURELY VIA STRIPE
                </a>
                
                <div className="stripe-secure-note">
                  <Lock size={12} /> SECURE CHECOUT ENCRYPTED BY STRIPE • 30-DAY REFUND PROMISE
                </div>
              </div>

              {/* Share-to-Save Discount CTA */}
              <div className="share-save-box">
                <div className="share-save-header">
                  <Share2 size={20} />
                  <span>Share your blueprint and save $5</span>
                </div>
                <p className="share-save-desc">
                  Share your personalized blueprint with friends and use code <strong>FOURFOLD10</strong> at checkout to save 10%.
                </p>
                <div className="share-save-buttons">
                  <button className="share-btn" onClick={shareOnTwitter} aria-label="Share on Twitter/X">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>Share on X</span>
                  </button>
                  <button className="share-btn" onClick={shareOnFacebook} aria-label="Share on Facebook">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Share on Facebook</span>
                  </button>
                  <button className="share-btn share-btn-copy" onClick={copyLink} aria-label="Copy link">
                    <Share2 size={16} />
                    <span>{shareTooltip || 'Copy Link'}</span>
                  </button>
                </div>
                <div className="share-save-code">
                  <span className="discount-code-label">Discount Code:</span>
                  <span className="discount-code">FOURFOLD10</span>
                </div>
              </div>

              <span className="retrieve-report-link" onClick={() => transitionToTab('post-purchase')}>
                Already purchased? Click here to access your report download instantly.
              </span>

              <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={(e) => {
                createRipple(e);
                handleResetIntake();
              }}>
                ← Return to intake form
              </button>
            </div>
          </div>
        )}

        {/* POST-PURCHASE REPORT DELIVERY VIEW */}
        {activeTab === 'post-purchase' && (
          <div className="post-purchase-card">
            <div className="post-purchase-header">
              <div className="success-badge">
                <CheckCircle size={16} /> ORDER CONFIRMED
              </div>
              <h2 style={{ fontSize: '2.25rem', margin: '0 0 0.5rem' }}>Your Custom Compendium</h2>
              <p style={{ color: 'var(--text-muted)', margin: '0' }}>
                Secure transaction finalized. Your tailored 42-page manual has been calibrated according to NZ botanical standards.
              </p>
            </div>

            <div className="post-purchase-body">
              <h3 style={{ fontFamily: 'var(--sans)', fontSize: '1.35rem', borderBottom: '1px solid var(--border-cosmic)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>Transaction Receipt</h3>
              <div className="receipt-row">
                <span className="receipt-label">Product Name</span>
                <span>Personalized Astrological Eating Compendium (42 Pages)</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Reference ID</span>
                <span style={{ fontFamily: 'monospace' }}>SLF-94182-NZST</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Somatic Gate Calibration</span>
                <span>{chartResult ? chartResult.bodyGate : 'Virgo Spleen & Digestive Gate (Estimated)'}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Status</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>Paid</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Total Charged</span>
                <span>$29.00 NZD</span>
              </div>

              <div className="compendium-modules">
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: '1.35rem', marginBottom: '1.5rem' }}>Your Compendium Outlines & Previews</h3>
                
                <div className="module-row">
                  <div className="module-num">I</div>
                  <div className="module-info">
                    <h4 className="module-title">Somatic Correction Assessment</h4>
                    <p className="module-desc">Full diagnostics mapping natal heat, fluid stagnation, or bone density dry indicators based on your sunrise ascendant node.</p>
                  </div>
                  <div className="module-pages">Pages 1-8</div>
                </div>

                <div className="module-row">
                  <div className="module-num">II</div>
                  <div className="module-info">
                    <h4 className="module-title">The Fourfold Day Timing Calendars</h4>
                    <p className="module-desc">Exact coordinates adjusting Catabolic, Hybrid, Anabolic, and Sealing gate windows, adjusted for local Auckland daylight variations.</p>
                  </div>
                  <div className="module-pages">Pages 9-16</div>
                </div>

                <div className="module-row">
                  <div className="module-num">III</div>
                  <div className="module-info">
                    <h4 className="module-title">The Astrological Recipe Canon</h4>
                    <p className="module-desc">Step-by-step culinary formulations, including heat activation thresholds for bone broths and bitter catalyst extraction methods.</p>
                  </div>
                  <div className="module-pages">Pages 17-28</div>
                </div>

                <div className="module-row">
                  <div className="module-num">IV</div>
                  <div className="module-info">
                    <h4 className="module-title">Signal Dusts & Furnace Pastes Guide</h4>
                    <p className="module-desc">Ratios and preparation techniques for concentrated non-interactive botanical formulas, calibrated for maximum gate locking.</p>
                  </div>
                  <div className="module-pages">Pages 29-36</div>
                </div>

                <div className="apothecary-preview">
                  <div className="apothecary-item">
                    <img src={signalDust} alt="Signal Dust" />
                    <span>Signal Dust</span>
                  </div>
                  <div className="apothecary-item">
                    <img src={furnacePaste} alt="Furnace Paste" />
                    <span>Furnace Paste</span>
                  </div>
                  <div className="apothecary-item">
                    <img src={brothCubes} alt="Broth Cubes" />
                    <span>Broth Cubes</span>
                  </div>
                </div>

                <div className="module-row">
                  <div className="module-num">V</div>
                  <div className="module-info">
                    <h4 className="module-title">MPI Sourcing & Safety Registry</h4>
                    <p className="module-desc">Allergen audit sheets, registered commercial botanical supplier list, and New Zealand clean handling practices directory.</p>
                  </div>
                  <div className="module-pages">Pages 37-42</div>
                </div>
              </div>

              <div className="download-box">
                <Download className="brand-symbol" size={40} style={{ marginBottom: '1rem' }} />
                <h4 className="download-title">Download Your Digital PDF</h4>
                <p className="download-desc">
                  Your customized compendium is compiled and digitally cryptographically signed. Click below to download your complete 42-page PDF file instantly.
                </p>
                <a 
                  href="/sample-compendium.pdf" 
                  download="Esonutra_Personal_Compendium.pdf"
                  className="btn-download"
                  onClick={(e) => {
                    e.preventDefault();
                    createRipple(e);
                    alert("✨ Your 42-page astrological ingestion manual is compiling! Your download (Esonutra_Personal_Compendium.pdf) will begin shortly. A copy has also been dispatched to your checkout email. ✨");
                  }}
                >
                  DOWNLOAD COMPLETE COMPENDIUM (8.4 MB)
                </a>
              </div>
            </div>
          </div>
        )}

        {/* WEEKLY CELESTIAL ROTATION VIEW */}
        {activeTab === 'rotation' && (
          <div>
            <div className="rotation-intro-box fade-in-up">
              <Calendar className="brand-symbol" size={40} style={{ marginBottom: '1rem' }} />
              <h2 className="rotation-intro-title">Weekly Celestial Rotation</h2>
              <p className="rotation-intro-desc">
                Current Season: <strong>Sol-Transit Gemini (Solar Air Balance)</strong>. Food is a rotating planetary dialogue. See how the weekly planetary alignment adjusts our daily Fourfold Day recipe canon. This rotation represents our weekly digital subscription model.
              </p>
            </div>

            <div className="rotation-grid">
              {/* Day 1 */}
              <div className="day-card highlight">
                <div className="day-header">
                  <span className="day-name">Sol-Day (Sun)</span>
                  <span className="day-zodiac-badge"><Sun size={12} /> Leo Transit</span>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Catabolic Morning</div>
                  <div className="meal-name">Sour citrus hot catalyst with warm dandelion root extraction.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Hybrid Midday</div>
                  <div className="meal-name">Steamed pumpkin & quinoa matrix with fresh bitter watercress.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Anabolic Evening</div>
                  <div className="meal-name">Rich venison bone broth, slow-cooked in clean mountain minerals with rosemary.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Sealing Night</div>
                  <div className="meal-name">Concentrated orange-pith Furnace Paste to seal hepatic digestive gates.</div>
                </div>
              </div>

              {/* Day 2 */}
              <div className="day-card">
                <div className="day-header">
                  <span className="day-name">Luna-Day (Moon)</span>
                  <span className="day-zodiac-badge"><Moon size={12} /> Cancer Transit</span>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Catabolic Morning</div>
                  <div className="meal-name">Hydrating mineral clay water with a squeeze of wild key lime.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Hybrid Midday</div>
                  <div className="meal-name">Raw enzyme kelp noodle salad with crushed clean sesame and ginger.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Anabolic Evening</div>
                  <div className="meal-name">Cod bone reduction, organic parsnip mash, rich grass-fed ghee infusion.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Sealing Night</div>
                  <div className="meal-name">Mallow root and skullcap seal infusion to settle gastric nervous currents.</div>
                </div>
              </div>

              {/* Day 3 */}
              <div className="day-card">
                <div className="day-header">
                  <span className="day-name">Ares-Day (Mars)</span>
                  <span className="day-zodiac-badge"><Flame size={12} /> Scorpio Transit</span>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Catabolic Morning</div>
                  <div className="meal-name">Bitter gentian tea catalyst with a micro-dose of organic cayenne extract.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Hybrid Midday</div>
                  <div className="meal-name">Spicy mustard greens with black wild rice and thermal red lentil paste.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Anabolic Evening</div>
                  <div className="meal-name">Grass-fed lamb broth with restorative nettles, slow-melted marrow fat.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Sealing Night</div>
                  <div className="meal-name">Black walnut hull sealing extract to bind intestinal damp residues.</div>
                </div>
              </div>

              {/* Day 4 */}
              <div className="day-card">
                <div className="day-header">
                  <span className="day-name">Hermes-Day (Mercury)</span>
                  <span className="day-zodiac-badge"><Sparkles size={12} /> Virgo Transit</span>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Catabolic Morning</div>
                  <div className="meal-name">Ginger juice catalyst with cold-pressed organic celery extraction.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Hybrid Midday</div>
                  <div className="meal-name">Earthy root vegetable hash with clean steam-pressed turnip greens.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Anabolic Evening</div>
                  <div className="meal-name">Slow-stewed poultry bone matrix, thyme leaf, collagen-rich wing broth.</div>
                </div>
                <div className="meal-block">
                  <div className="meal-time">Sealing Night</div>
                  <div className="meal-name">Licorice root furnace paste to seal digestive mucosal boundaries.</div>
                </div>
              </div>
            </div>

            {/* Subscription Upsell block */}
            <section style={{ textAlign: 'center', margin: '4rem 0 2rem' }}>
              <div style={{ background: 'var(--bg-void)', border: '1px solid var(--border-cosmic)', borderRadius: '16px', padding: '3.5rem 2rem' }}>
                <h3 style={{ fontSize: '1.75rem', margin: '0 0 1rem', fontFamily: 'var(--sans)' }}>Subscribe to the Weekly Ingestion Rotation</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  Get weekly astrological adaptations of the recipe canon, specific New Zealand seasonal food safety warnings, grocery lists, and special apothecary Signal Dusts mixtures.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', fontFamily: 'var(--sans)' }}>
                    $9.00 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ week</span>
                  </div>
                  <button className="btn-primary btn-pulse" onClick={(e) => {
                    createRipple(e);
                    window.open('https://buy.stripe.com/bJefZhemgc3i2Zb3tGfnO00', '_blank');
                  }}>
                    Subscribe Weekly <CreditCard size={18} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ADMIN DASHBOARD VIEW */}
        {activeTab === 'admin' && adminAuthenticated && (
          <div className="admin-dashboard">
            {/* Toast Notification */}
            {toast.show && (
              <div className={`admin-toast admin-toast-${toast.type}`}>
                {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {toast.message}
              </div>
            )}

            {/* Dashboard Header */}
            <div className="admin-header">
              <div className="admin-header-left">
                <BarChart3 size={28} className="admin-icon" />
                <h2 className="admin-title">Management Dashboard</h2>
              </div>
              <div className="admin-header-right">
                <span className="admin-badge" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>Authenticated</span>
                <button className="admin-logout-btn" onClick={handleAdminLogout}>
                  Logout <Lock size={14} />
                </button>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="admin-tabs">
              <button className={`admin-tab ${adminTab === 'overview' ? 'active' : ''}`} onClick={() => setAdminTab('overview')}>
                <BarChart3 size={16} /> Overview
              </button>
              <button className={`admin-tab ${adminTab === 'intakes' ? 'active' : ''}`} onClick={() => setAdminTab('intakes')}>
                <Users size={16} /> Chart Intakes
              </button>
              <button className={`admin-tab ${adminTab === 'products' ? 'active' : ''}`} onClick={() => setAdminTab('products')}>
                <Package size={16} /> Products
              </button>
              <button className={`admin-tab ${adminTab === 'orders' ? 'active' : ''}`} onClick={() => setAdminTab('orders')}>
                <ShoppingCart size={16} /> Orders
              </button>
            </div>

            {/* Overview Panel */}
            {adminTab === 'overview' && (
              <div className="admin-overview">
                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <div className="stat-icon"><Users size={24} /></div>
                    <div className="stat-info">
                      <div className="stat-value">{chartIntakes.length}</div>
                      <div className="stat-label">Chart Intakes</div>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="stat-icon"><Package size={24} /></div>
                    <div className="stat-info">
                      <div className="stat-value">{products.length}</div>
                      <div className="stat-label">Products</div>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="stat-icon"><ShoppingCart size={24} /></div>
                    <div className="stat-info">
                      <div className="stat-value">{orders.length}</div>
                      <div className="stat-label">Orders</div>
                    </div>
                  </div>
                  <div className="admin-stat-card">
                    <div className="stat-icon"><CreditCard size={24} /></div>
                    <div className="stat-info">
                      <div className="stat-value">$0.00</div>
                      <div className="stat-label">Revenue (placeholder)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chart Intakes Panel */}
            {adminTab === 'intakes' && (
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h3>Chart Intake Log</h3>
                  <span className="admin-count">{chartIntakes.length} total</span>
                </div>
                {chartIntakes.length === 0 ? (
                  <div className="admin-empty">No chart intakes yet. Complete a chart intake to see data here.</div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Birth Date</th>
                          <th>Birth Time</th>
                          <th>Location</th>
                          <th>Submitted</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chartIntakes.slice(0, 50).map(intake => (
                          <tr key={intake.id}>
                            <td>{intake.name}</td>
                            <td>{intake.birthDate}</td>
                            <td>{intake.birthTime}</td>
                            <td>{intake.location}</td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {new Date(intake.timestamp).toLocaleDateString()}
                            </td>
                            <td>
                              <details className="admin-details">
                                <summary style={{ cursor: 'pointer', color: 'var(--text-gold)', fontSize: '0.85rem' }}>View</summary>
                                <div className="admin-details-content">
                                  <div>Sun Sign: {intake.sunSign || 'N/A'}</div>
                                  <div>Ascendant: {intake.ascendant || 'N/A'}</div>
                                  <div>Body Gate: {intake.bodyGate || 'N/A'}</div>
                                  <div>Timezone: {intake.timezone}</div>
                                  <div>Lat: {intake.latitude || 'N/A'}, Lng: {intake.longitude || 'N/A'}</div>
                                </div>
                              </details>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Products Panel */}
            {adminTab === 'products' && (
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h3>Product Management</h3>
                  <button className="admin-add-btn" onClick={() => setShowProductForm(!showProductForm)}>
                    <Plus size={16} /> Add Product
                  </button>
                </div>

                {showProductForm && (
                  <div className="admin-form">
                    <input className="admin-input" placeholder="Product name" value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                    <input className="admin-input" placeholder="Description" value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                    <input className="admin-input" placeholder="Price ($)" type="number" step="0.01" value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                    <select className="admin-select" value={newProduct.status}
                      onChange={e => setNewProduct({...newProduct, status: e.target.value})}>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                    </select>
                    <div className="admin-form-actions">
                      <button className="btn-primary" onClick={handleAddProduct}><Save size={16} /> Save Product</button>
                      <button className="btn-secondary" onClick={() => setShowProductForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td style={{ fontWeight: 600 }}>{product.name}</td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{product.description}</td>
                          <td>${product.price}</td>
                          <td>
                            <select className="admin-status-select" value={product.status}
                              onChange={e => handleUpdateProduct(product.id, 'status', e.target.value)}>
                              <option value="active">Active</option>
                              <option value="draft">Draft</option>
                            </select>
                          </td>
                          <td>
                            <button className="admin-delete-btn" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Panel */}
            {adminTab === 'orders' && (
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h3>Order Tracking</h3>
                  <button className="admin-add-btn" onClick={() => setShowOrderForm(!showOrderForm)}>
                    <Plus size={16} /> Add Order
                  </button>
                </div>

                {showOrderForm && (
                  <div className="admin-form">
                    <input className="admin-input" placeholder="Customer name" value={newOrder.customer}
                      onChange={e => setNewOrder({...newOrder, customer: e.target.value})} />
                    <input className="admin-input" placeholder="Product name" value={newOrder.product}
                      onChange={e => setNewOrder({...newOrder, product: e.target.value})} />
                    <input className="admin-input" placeholder="Quantity" type="number" min="1" value={newOrder.quantity}
                      onChange={e => setNewOrder({...newOrder, quantity: Math.max(1, parseInt(e.target.value) || 1).toString()})} />
                    <input className="admin-input" placeholder="Total ($)" type="number" step="0.01" value={newOrder.total}
                      onChange={e => setNewOrder({...newOrder, total: e.target.value})} />
                    <select className="admin-select" value={newOrder.status}
                      onChange={e => setNewOrder({...newOrder, status: e.target.value})}>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <div className="admin-form-actions">
                      <button className="btn-primary" onClick={handleAddOrder}><Save size={16} /> Save Order</button>
                      <button className="btn-secondary" onClick={() => setShowOrderForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                            No orders yet. Add an order to get started.
                          </td>
                        </tr>
                      ) : (
                        orders.map(order => (
                          <tr key={order.id}>
                            <td style={{ fontWeight: 600 }}>{order.customer}</td>
                            <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.product}</td>
                            <td>{order.quantity}</td>
                            <td>${order.total}</td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.date}</td>
                            <td>
                              <select className="admin-status-select" value={order.status}
                                onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                            <td>
                              <button className="admin-delete-btn" onClick={() => handleDeleteOrder(order.id)}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin Password Modal */}
        <div className="admin-modal" id="admin-password-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <Lock size={24} className="admin-icon" />
              <h3>Admin Access</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Enter the management password to access the dashboard.</p>
            <input 
              type="password" 
              className="admin-input" 
              placeholder="Enter password"
              value={adminPassword}
              onChange={e => { setAdminPassword(e.target.value); setAdminPasswordError(''); }}
              onKeyDown={e => { if (e.key === 'Enter') handleAdminLogin(e); }}
              autoFocus
            />
            {adminPasswordError && <div className="validation-error" style={{ marginTop: '0.5rem' }}><AlertCircle size={14} /> {adminPasswordError}</div>}
            <div className="admin-modal-actions">
              <button className="btn-primary" onClick={(e) => handleAdminLogin(e)}>Unlock Dashboard</button>
              <button className="btn-secondary" onClick={() => {
                document.getElementById('admin-password-modal')?.classList.remove('visible');
                setAdminPassword('');
                setAdminPasswordError('');
              }}>Cancel</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/Pneuma/logo.svg" alt="" width="24" height="24" style={{ filter: 'drop-shadow(0 0 4px rgba(226, 184, 87, 0.5))' }} />
            <span className="brand-font" style={{ fontSize: '1.2rem' }}>ESONUTRA</span>
          </div>
          <p className="footer-desc">
            A spiritual-somatic mapping system treating birth gate placements as the correction layer for physical and metaphysical wellness. Compliant with NZ MPI food safety standards.
          </p>
          <div className="footer-links">
            <span className="footer-link" onClick={() => transitionToTab('landing')}>Doctrine</span>
            <span className="footer-link" onClick={() => transitionToTab('rotation')}>Weekly Rotation</span>
            <span className="footer-link" onClick={() => transitionToTab('intake')}>Natal Intake</span>
            <span className="footer-link" onClick={() => transitionToTab('post-purchase')}>Download Center</span>
            <a href="https://buy.stripe.com/bJefZhemgc3i2Zb3tGfnO00" target="_blank" rel="noopener noreferrer" className="footer-link">Payment Link</a>
            <a href="https://spiral-source-node.base44.app/construct" target="_blank" rel="noopener noreferrer" className="footer-link">Philosophy</a>
          </div>


          <div className="footer-copyright">
            © {new Date().getFullYear()} Esonutra Ltd. Auckland, New Zealand. All rights reserved. Registered Food safety operator standards apply.
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
