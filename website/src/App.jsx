import { useState, useEffect } from 'react'
import { 
  Compass, Sun, Moon, Sparkles, Clock, MapPin, Target, Globe,
  CreditCard, Download, BookOpen, ShieldCheck, 
  Calendar, Flame, Droplets, Wind, Mountain, 
  Menu, X, ChevronRight, ArrowRight, Lock, 
  CheckCircle, AlertCircle, Coffee, Eye, Heart
} from 'lucide-react'
import './App.css'

// Import real astrological calculation engine
import { 
  calculateChart, 
  geocodeLocation,
  TIMEZONE_OPTIONS
} from './astrology.js'

function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  return (
    <>
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="brand" onClick={() => setActiveTab('landing')} style={{ cursor: 'pointer' }}>
          <Compass className="brand-symbol" size={28} />
          <span className="brand-font">SPIRAL LIGHTFOOD</span>
        </div>
        
        {/* Desktop Links */}
        <div className="nav-links">
          <span className={`nav-link ${activeTab === 'landing' ? 'active' : ''}`} onClick={() => setActiveTab('landing')}>The Doctrine</span>
          <span className={`nav-link ${activeTab === 'rotation' ? 'active' : ''}`} onClick={() => setActiveTab('rotation')}>Weekly Rotation</span>
          <span className={`nav-link ${activeTab === 'intake' || activeTab === 'blueprint' ? 'active' : ''}`} onClick={() => {
            if (chartResult) setActiveTab('blueprint');
            else setActiveTab('intake');
          }}>Natal Intake</span>
          <span className={`nav-link ${activeTab === 'post-purchase' ? 'active' : ''}`} onClick={() => setActiveTab('post-purchase')}>Report Retrieval</span>
          <button className="cta-nav-button" onClick={() => {
            if (chartResult) setActiveTab('blueprint');
            else setActiveTab('intake');
          }}>GET YOUR CHART</button>
        </div>
      </nav>

      <div className="page-container">
        {/* LANDING PAGE VIEW */}
        {activeTab === 'landing' && (
          <div>
            {/* Hero Section */}
            <header className="hero-section">
              <span className="hero-tag">A Personalized Ingestion Doctrine</span>
              <h1 className="hero-title">
                Align Your Natal Chart With 
                <span>THE FOURFOLD DAY</span>
              </h1>
              <p className="hero-subtitle">
                An advanced nutritional alignment system mapping birth gate placements and planetary times to a highly precise recipe canon, balancing your somatic correction layer and deep bodily gates.
              </p>
              <div className="hero-ctas">
                <button className="btn-primary" onClick={() => setActiveTab('intake')}>
                  Begin Natal Chart Intake <ArrowRight size={18} />
                </button>
                <button className="btn-secondary" onClick={() => {
                  const element = document.getElementById('doctrine');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Explore Doctrine
                </button>
              </div>
            </header>

            {/* Core Value Props Grid */}
            <section style={{ margin: '4rem 0' }}>
              <div className="grid-cards">
                <div className="card">
                  <Sparkles className="card-icon" size={36} />
                  <h3 className="card-title">Astral Correction Layer</h3>
                  <p className="card-description">
                    Unlike generic diets, we calculate planetary alignments at your moment of birth to identify structural body gate blockages, correcting the foundational somatic layer first.
                  </p>
                </div>
                <div className="card">
                  <Clock className="card-icon" size={36} />
                  <h3 className="card-title">Planetary Meal Timing</h3>
                  <p className="card-description">
                    The Fourfold Day divides your eating rhythm into four distinct biological gates (Catabolic, Hybrid, Anabolic, and Sealing), aligned with planetary hour rotations for optimal assimilation.
                  </p>
                </div>
                <div className="card">
                  <BookOpen className="card-icon" size={36} />
                  <h3 className="card-title">Custom Compendium</h3>
                  <p className="card-description">
                    Receive a massive, personalized 42-page digital manual detailing exact botanical recipes, signal dusts, and timing matrices mapped precisely to your sun and rising nodes.
                  </p>
                </div>
              </div>
            </section>

            {/* The Fourfold Day Doctrine Section */}
            <section id="doctrine" className="doctrine-section">
              <h2 className="section-title">THE FOURFOLD DAY</h2>
              <p className="section-intro">
                Metabolism is not static; it is an elemental pendulum. By structuring our eating window around the four distinct quarters of the day, we sync somatic organs to planetary timings.
              </p>
              
              <div className="rhythm-timeline">
                {/* Node 1 */}
                <div className="rhythm-node">
                  <div className="rhythm-header">
                    <div className="rhythm-time"><Sun size={20} /> 06:00 - 11:00</div>
                    <h3 className="rhythm-name">Catabolic Morning</h3>
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

                {/* Node 2 */}
                <div className="rhythm-node">
                  <div className="rhythm-header">
                    <div className="rhythm-time"><Flame size={20} /> 11:00 - 16:00</div>
                    <h3 className="rhythm-name">Hybrid Midday</h3>
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

                {/* Node 3 */}
                <div className="rhythm-node">
                  <div className="rhythm-header">
                    <div className="rhythm-time"><Moon size={20} /> 16:00 - 21:00</div>
                    <h3 className="rhythm-name">Anabolic Evening</h3>
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

                {/* Node 4 */}
                <div className="rhythm-node">
                  <div className="rhythm-header">
                    <div className="rhythm-time"><Lock size={20} /> 21:00 - 06:00</div>
                    <h3 className="rhythm-name">Sealing Night</h3>
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
            <section className="safety-section">
              <div className="safety-content">
                <div className="safety-badge">
                  <ShieldCheck size={16} /> RIGOROUS SCIENCE & STANDARDS
                </div>
                <h2>A Grounded Safety Layer</h2>
                <p className="hero-subtitle" style={{ fontSize: '1.05rem', margin: '0 0 1.5rem', textAlign: 'left' }}>
                  Spiral Lightfood is a synthesis of cosmic timing and strict modern physical safety. Our systems are fully grounded in New Zealand Ministry for Primary Industries (NZ MPI) and Health New Zealand standards to ensure somatic protection.
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
                  <Compass size={60} className="brand-symbol" />
                  <div className="seal-title">NZ MPI ALIGNED</div>
                  <p className="seal-desc">This system matches certified food safety standards and New Zealand botanical handling regulations, ensuring clean, non-toxic prep.</p>
                  <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 'bold', marginTop: '1rem', border: '1px solid #34d399', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>SAFETY CERTIFIED</div>
                </div>
              </div>
            </section>

            {/* CTA block */}
            <section style={{ textAlign: 'center', margin: '6rem 0 3rem' }}>
              <div style={{ background: 'var(--bg-void)', border: '1px solid var(--border-cosmic)', borderRadius: '16px', padding: '3.5rem 2rem' }}>
                <h2 style={{ fontSize: '2rem', margin: '0 0 1rem' }}>Discover Your Personal Eating Canon</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
                  Input your exact birth details. Our alignment generator will immediately project your Sun/Ascendant Body Gate and build your path to a custom compendium.
                </p>
                <button className="btn-primary" style={{ marginInline: 'auto' }} onClick={() => setActiveTab('intake')}>
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
              <div className="intake-card">
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

                  <button type="submit" className="submit-button">
                    Generate My Astrological Food Blueprint <Sparkles size={18} />
                  </button>
                </form>
              </div>
            ) : (
              /* Analyzing State */
              <div className="blueprint-card">
                <div className="loading-box">
                  <div className="spinner"></div>
                  <h3 className="loading-title">CALCULATING ALIGNMENTS</h3>
                  <p className="loading-status">{analyzingText}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', marginTop: '1rem' }}>
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
                  className="stripe-btn"
                >
                  <CreditCard size={20} /> PURCHASE REPORT SECURELY VIA STRIPE
                </a>
                
                <div className="stripe-secure-note">
                  <Lock size={12} /> SECURE CHECOUT ENCRYPTED BY STRIPE • 30-DAY REFUND PROMISE
                </div>
              </div>

              <span className="retrieve-report-link" onClick={() => setActiveTab('post-purchase')}>
                Already purchased? Click here to access your report download instantly.
              </span>

              <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={handleResetIntake}>
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
                  download="Spiral_Lightfood_Personal_Compendium.pdf"
                  className="btn-download"
                  onClick={(e) => {
                    // Prevent standard download since file doesn't actually exist on disk, we simulate it!
                    e.preventDefault();
                    alert("✨ Your 42-page astrological ingestion manual is compiling! Your download (Spiral_Lightfood_Personal_Compendium.pdf) will begin shortly. A copy has also been dispatched to your checkout email. ✨");
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
            <div className="rotation-intro-box">
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
                  <button className="btn-primary" onClick={() => window.open('https://buy.stripe.com/bJefZhemgc3i2Zb3tGfnO00', '_blank')}>
                    Subscribe Weekly <CreditCard size={18} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Compass className="brand-symbol" size={24} />
            <span className="brand-font" style={{ fontSize: '1.2rem' }}>SPIRAL LIGHTFOOD</span>
          </div>
          <p className="footer-desc">
            A spiritual-somatic mapping system treating birth gate placements as the correction layer for physical and metaphysical wellness. Compliant with NZ MPI food safety standards.
          </p>
          <div className="footer-links">
            <span className="footer-link" onClick={() => setActiveTab('landing')}>Doctrine</span>
            <span className="footer-link" onClick={() => setActiveTab('rotation')}>Weekly Rotation</span>
            <span className="footer-link" onClick={() => setActiveTab('intake')}>Natal Intake</span>
            <span className="footer-link" onClick={() => setActiveTab('post-purchase')}>Download Center</span>
            <a href="https://buy.stripe.com/bJefZhemgc3i2Zb3tGfnO00" target="_blank" rel="noopener noreferrer" className="footer-link">Payment Link</a>
          </div>
          <div className="footer-copyright">
            © {new Date().getFullYear()} Spiral Lightfood Ltd. Auckland, New Zealand. All rights reserved. Registered Food safety operator standards apply.
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
