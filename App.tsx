import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  FileText, 
  CreditCard, 
  Utensils, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  IndianRupee, 
  MapPin, 
  Menu, 
  X,
  ChevronRight,
  Send,
  Settings,
  Eye,
  Save,
  Trash2,
  Plus,
  Moon,
  Sun,
  Layout,
  Palette,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  Lock,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from 'motion/react';
import { SiteContent, Service } from './types';
import { DEFAULT_CONTENT, PRESET_THEMES } from './constants';

const IconMap: Record<string, React.ElementType> = {
  FileText, CreditCard, Utensils, Briefcase, Clock, ShieldCheck, IndianRupee, MapPin, Sparkles, Zap
};

const ParticleBackground = ({ color }: { color: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.floor(window.innerWidth / 20);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      
      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string; key?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Reveal = ({ children, width = "100%", delay = 0, color = "#00d2ff" }: { children: React.ReactNode; width?: "fit-content" | "100%"; delay?: number; color?: string }) => {
  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25 + delay }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeIn", delay: delay }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          background: color,
          zIndex: 20,
        }}
      />
    </div>
  );
};

const App = () => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  
  // Login State
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Load content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem('acz_site_content');
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent));
      } catch (e) {
        console.error("Failed to parse saved content", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks >= 5) {
      setIsLoginOpen(true);
      setLogoClicks(0);
    }
    setTimeout(() => setLogoClicks(0), 3000); // Reset clicks after 3s
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === 'Abhay@#kumar*372' && loginPass === 'Abhay@kumar372#') {
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setIsAdminOpen(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Credentials');
    }
  };

  const saveContent = (newContent: SiteContent) => {
    setContent(newContent);
    localStorage.setItem('acz_site_content', JSON.stringify(newContent));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const renderIcon = (name: string, className: string) => {
    const Icon = IconMap[name] || FileText;
    return <Icon className={className} />;
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 selection:bg-neon-blue/30 ${content.theme.isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`} style={{ backgroundColor: content.theme.isDarkMode ? '#020617' : content.theme.backgroundColor }}>
      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left" style={{ scaleX, backgroundColor: content.theme.primaryColor }} />
      
      {/* Full-screen Background Image with Blur & Overlay */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <img 
          src={content.images.background} 
          alt="Background" 
          className="w-full h-full object-cover blur-[8px] scale-110 opacity-40" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]"></div>
      </div>

      {/* Particle Background */}
      <ParticleBackground color={content.theme.primaryColor} />

      {/* Cursor Glow */}
      <div 
        className="cursor-glow hidden lg:block" 
        style={{ 
          left: mousePos.x, 
          top: mousePos.y,
          background: `radial-gradient(circle, ${content.theme.primaryColor}20 0%, ${content.theme.secondaryColor}10 50%, transparent 70%)`
        }} 
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/50 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_0_20px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-active:scale-95 relative overflow-hidden bg-white/10 border border-white/10">
              <img src={content.images.logo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter leading-none group-hover:text-neon-blue transition-colors uppercase">ABHAY CYBER</span>
              <span className="text-[10px] font-bold tracking-[0.2em] opacity-50 leading-none">ZONE BIRAUL</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Home', 'Services', 'Features', 'Contact'].map((item) => (
              (item === 'Services' && !content.theme.showServices) || 
              (item === 'Features' && !content.theme.showFeatures) || 
              (item === 'Contact' && !content.theme.showContact) ? null : (
                <button 
                  key={item} 
                  onClick={() => scrollToSection(item.toLowerCase())} 
                  className="text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all hover:text-glow relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-neon-blue to-neon-purple transition-all group-hover:w-full"></span>
                </button>
              )
            ))}
            <a 
              href={`tel:${content.contact.phone}`} 
              className="relative group overflow-hidden px-7 py-3 rounded-full text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,210,255,0.3)]"
              style={{ backgroundColor: content.theme.primaryColor }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              Call Now
            </a>
            {isLoggedIn && (
              <button onClick={() => setIsAdminOpen(true)} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>

          <button className="md:hidden p-2 opacity-70" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }} 
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }} 
            className="fixed inset-0 z-40 bg-slate-950/60 pt-32 px-8 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {['Home', 'Services', 'Features', 'Contact'].map((item, index) => (
                <motion.button 
                  key={item} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.toLowerCase())} 
                  className="text-4xl font-black tracking-tighter uppercase italic text-left border-b border-white/5 pb-4 hover:text-neon-blue transition-colors"
                >
                  {item}
                </motion.button>
              ))}
              <motion.a 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                href={`tel:${content.contact.phone}`} 
                className="text-white text-center py-5 rounded-[2rem] text-xl font-black uppercase tracking-widest shadow-2xl active:scale-95 mt-4" 
                style={{ backgroundColor: content.theme.primaryColor }}
              >
                Call Now
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 animate-pulse" style={{ backgroundColor: content.theme.primaryColor }}></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 animate-pulse" style={{ backgroundColor: content.theme.secondaryColor, animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,210,255,0.05)_0%,transparent_70%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Reveal width="fit-content" color={content.theme.primaryColor}>
              <span className="inline-block px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 glass border-white/10 text-neon-blue shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                The Future of Digital Services
              </span>
            </Reveal>
            <Reveal color={content.theme.primaryColor}>
              <h1 className="text-6xl lg:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
                {content.hero.heading.split(' ').slice(0, -2).join(' ')} <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-neon-blue via-neon-purple to-neon-cyan text-glow">
                  {content.hero.heading.split(' ').slice(-2).join(' ')}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1} color={content.theme.primaryColor}>
              <p className="max-w-2xl mx-auto text-lg lg:text-xl opacity-60 mb-12 leading-relaxed font-medium">
                {content.hero.tagline}
              </p>
            </Reveal>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')} 
                className="w-full sm:w-auto px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:shadow-[0_0_50px_rgba(0,210,255,0.6)] transition-all relative overflow-hidden group"
                style={{ backgroundColor: content.theme.primaryColor }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {content.hero.ctaPrimary}
              </motion.button>
              <motion.a 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                href={`https://wa.me/${content.contact.whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto glass-dark px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all border-white/10"
              >
                <MessageCircle className="w-6 h-6 text-emerald-400" /> {content.hero.ctaSecondary}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      {content.theme.showServices && (
        <section id="services" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <Reveal width="fit-content" color={content.theme.primaryColor}>
                <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter uppercase italic">
                  Our <span className="text-neon-blue">Premium</span> Services
                </h2>
              </Reveal>
              <Reveal delay={0.1} color={content.theme.primaryColor}>
                <p className="opacity-50 max-w-2xl mx-auto text-lg font-medium">
                  {content.services.description}
                </p>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
              {content.services.items.map((service, index) => (
                <TiltCard key={service.id} className="h-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: index * 0.1 }} 
                    className="group relative p-8 rounded-[2.5rem] glass-dark border-white/5 hover:border-neon-blue/30 transition-all duration-500 overflow-hidden h-full flex flex-col preserve-3d animate-[float_6s_ease-in-out_infinite]"
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-neon-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:neon-glow-blue transition-all duration-500 transform translate-z-10">
                      {renderIcon(service.iconName, "w-8 h-8 text-neon-blue")}
                    </div>
                    <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-neon-blue transition-colors translate-z-10">{service.title}</h3>
                    <p className="opacity-50 text-sm leading-relaxed font-medium translate-z-10 flex-grow">{service.description}</p>
                    
                    <div className="mt-8 flex items-center gap-2 text-neon-blue text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-z-10">
                      Learn More <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {content.theme.showFeatures && (
        <section id="features" className="py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2">
                <Reveal width="fit-content" color={content.theme.secondaryColor}>
                  <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
                    Why <span className="text-neon-purple">Choose</span> Us?
                  </h2>
                </Reveal>
                <Reveal delay={0.1} color={content.theme.secondaryColor}>
                  <p className="opacity-50 mb-12 text-lg font-medium leading-relaxed">
                    {content.features.description}
                  </p>
                </Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {content.features.items.map((feature, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ scale: 1.02 }}
                      className="flex gap-5 p-6 rounded-3xl glass-dark border-white/5 hover:border-neon-purple/30 transition-all"
                    >
                      <div className="flex-shrink-0 w-12 h-12 glass rounded-xl flex items-center justify-center">
                        {renderIcon(feature.iconName, "w-6 h-6 text-neon-purple")}
                      </div>
                      <div>
                        <h4 className="font-black text-lg mb-1 tracking-tight">{feature.title}</h4>
                        <p className="opacity-40 text-xs font-medium leading-tight">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(157,80,187,0.2)] border border-white/10 group">
                  <img src={content.images.featuresImg} alt="Features" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-purple/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {content.theme.showContact && (
        <section id="contact" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-dark rounded-[4rem] overflow-hidden border border-white/10 flex flex-col lg:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="lg:w-1/2 p-12 lg:p-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-neon-blue/10 to-transparent -z-10"></div>
                <Reveal width="fit-content" color={content.theme.primaryColor}>
                  <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter uppercase italic">
                    Let's <span className="text-neon-blue">Connect</span>
                  </h2>
                </Reveal>
                <Reveal delay={0.1} color={content.theme.primaryColor}>
                  <p className="opacity-50 mb-12 text-lg font-medium">
                    Ready to experience the best digital services in Biraul? Get in touch today.
                  </p>
                </Reveal>
                <div className="space-y-10">
                  <div className="flex items-center gap-8 group">
                    <motion.a 
                      whileTap={{ scale: 0.9 }}
                      href={`tel:${content.contact.phone}`} 
                      className="w-16 h-16 glass rounded-2xl flex items-center justify-center group-hover:neon-glow-blue transition-all duration-500"
                    >
                      <Phone className="w-7 h-7 text-neon-blue" />
                    </motion.a>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest opacity-30 mb-1">Call Us</p>
                      <a href={`tel:${content.contact.phone}`} className="text-2xl font-black hover:text-neon-blue transition-colors tracking-tight">{content.contact.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 group">
                    <motion.a 
                      whileTap={{ scale: 0.9 }}
                      href={`https://wa.me/${content.contact.whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-16 h-16 glass rounded-2xl flex items-center justify-center group-hover:neon-glow-purple transition-all duration-500"
                    >
                      <MessageCircle className="w-7 h-7 text-neon-purple" />
                    </motion.a>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest opacity-30 mb-1">WhatsApp</p>
                      <a href={`https://wa.me/${content.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-2xl font-black hover:text-neon-purple transition-colors tracking-tight">Chat with Us</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 p-12 lg:p-20 bg-white/5 backdrop-blur-sm border-l border-white/10">
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Full Name</label>
                      <input type="text" placeholder="John Doe" className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Phone Number</label>
                      <input type="tel" placeholder="+91 00000 00000" className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Your Message</label>
                    <textarea rows={4} placeholder="How can we help you?" className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all font-medium resize-none"></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(0,210,255,0.3)] hover:shadow-[0_0_50px_rgba(0,210,255,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                    style={{ backgroundColor: content.theme.primaryColor }}
                  >
                    Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: content.theme.primaryColor }}>
              <span className="text-white font-black text-sm">A</span>
            </div>
            <span className="font-black text-lg tracking-tighter">ABHAY CYBER ZONE</span>
          </div>
          <p className="opacity-30 text-[10px] font-black uppercase tracking-[0.5em]">
            © {new Date().getFullYear()} Abhay Cyber Zone Biraul. Crafted for the Future.
          </p>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-neon-blue to-transparent opacity-20"></div>
      </footer>

      {/* Floating WhatsApp */}
      <a 
        href={`https://wa.me/${content.contact.whatsapp}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-90 transition-all group animate-bounce"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-full mr-4 px-4 py-2 glass rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
          Chat with us
        </span>
      </a>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="glass-dark rounded-[3rem] p-10 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] relative border-white/10"
            >
              <button onClick={() => setIsLoginOpen(false)} className="absolute top-8 right-8 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"><X className="w-5 h-5" /></button>
              <div className="text-center mb-10">
                <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl neon-glow-blue"><Lock className="w-10 h-10 text-neon-blue" /></div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Admin <span className="text-neon-blue">Access</span></h2>
                <p className="opacity-40 text-[10px] font-black uppercase tracking-widest mt-2">Secure Gateway</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Ownership ID</label>
                  <input type="text" placeholder="Enter ID" value={loginId} onChange={(e) => setLoginId(e.target.value)} className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Password</label>
                  <input type="password" placeholder="••••••••" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all font-medium" />
                </div>
                {loginError && <p className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center">{loginError}</p>}
                <button type="submit" className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(0,210,255,0.3)] hover:shadow-[0_0_50px_rgba(0,210,255,0.5)] active:scale-95 transition-all" style={{ backgroundColor: content.theme.primaryColor }}>
                  Authorize
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Dashboard */}
      <AnimatePresence>
        {isAdminOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-end bg-slate-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 30, stiffness: 300 }} 
              className="w-full max-w-2xl h-full glass-dark border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center neon-glow-blue"><Settings className="w-6 h-6 text-neon-blue" /></div>
                  <div>
                    <h2 className="font-black text-xl tracking-tighter uppercase italic">Control <span className="text-neon-blue">Panel</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30">System Configuration</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setIsAdminOpen(false); setIsLoggedIn(false); }} className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                  <button onClick={() => setIsAdminOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32">
                {/* Hero Section Editor */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-neon-blue font-black uppercase tracking-widest text-xs"><Type className="w-5 h-5" /> <h3>Hero Content</h3></div>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Main Heading</label>
                      <input value={content.hero.heading} onChange={(e) => saveContent({...content, hero: {...content.hero, heading: e.target.value}})} className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-neon-blue transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Subtext Tagline</label>
                      <textarea value={content.hero.tagline} onChange={(e) => saveContent({...content, hero: {...content.hero, tagline: e.target.value}})} className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-neon-blue transition-all font-medium resize-none" rows={3} />
                    </div>
                  </div>
                </section>

                {/* Theme Editor */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-neon-purple font-black uppercase tracking-widest text-xs"><Palette className="w-5 h-5" /> <h3>Visual Identity</h3></div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Preset Themes</label>
                    <div className="grid grid-cols-3 gap-3">
                      {PRESET_THEMES.map((theme) => (
                        <button 
                          key={theme.name}
                          onClick={() => saveContent({
                            ...content, 
                            theme: {
                              ...content.theme, 
                              primaryColor: theme.primary, 
                              secondaryColor: theme.secondary
                            }
                          })}
                          className="p-3 rounded-xl glass border-white/5 hover:border-white/20 transition-all flex flex-col items-center gap-2 group"
                        >
                          <div className="flex gap-1">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.secondary }}></div>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-tighter opacity-50 group-hover:opacity-100">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Primary Neon</label>
                      <div className="flex gap-3">
                        <input type="color" value={content.theme.primaryColor} onChange={(e) => saveContent({...content, theme: {...content.theme, primaryColor: e.target.value}})} className="w-14 h-14 p-1 bg-white/5 rounded-xl border border-white/10 cursor-pointer" />
                        <input value={content.theme.primaryColor} onChange={(e) => saveContent({...content, theme: {...content.theme, primaryColor: e.target.value}})} className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10 outline-none text-xs font-mono" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Secondary Neon</label>
                      <div className="flex gap-3">
                        <input type="color" value={content.theme.secondaryColor} onChange={(e) => saveContent({...content, theme: {...content.theme, secondaryColor: e.target.value}})} className="w-14 h-14 p-1 bg-white/5 rounded-xl border border-white/10 cursor-pointer" />
                        <input value={content.theme.secondaryColor} onChange={(e) => saveContent({...content, theme: {...content.theme, secondaryColor: e.target.value}})} className="flex-1 p-4 bg-white/5 rounded-xl border border-white/10 outline-none text-xs font-mono" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 glass rounded-[2rem] border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
                        {content.theme.isDarkMode ? <Moon className="w-5 h-5 text-neon-blue" /> : <Sun className="w-5 h-5 text-orange-400" />}
                      </div>
                      <span className="font-black uppercase tracking-widest text-xs">Dark Interface</span>
                    </div>
                    <button 
                      onClick={() => saveContent({...content, theme: {...content.theme, isDarkMode: !content.theme.isDarkMode}})} 
                      className={`w-14 h-7 rounded-full transition-all relative ${content.theme.isDarkMode ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${content.theme.isDarkMode ? 'left-8' : 'left-1'}`}></div>
                    </button>
                  </div>
                </section>

                {/* Layout Control */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-emerald-400 font-black uppercase tracking-widest text-xs"><Layout className="w-5 h-5" /> <h3>Module Control</h3></div>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: 'Services Module', key: 'showServices' },
                      { label: 'Features Module', key: 'showFeatures' },
                      { label: 'Contact Module', key: 'showContact' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-xs font-black uppercase tracking-widest opacity-60">{item.label}</span>
                        <button 
                          onClick={() => saveContent({...content, theme: {...content.theme, [item.key]: !content.theme[item.key as keyof typeof content.theme]}})} 
                          className={`w-12 h-6 rounded-full transition-all relative ${content.theme[item.key as keyof typeof content.theme] ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${content.theme[item.key as keyof typeof content.theme] ? 'left-7' : 'left-1'}`}></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Services Editor */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-orange-400 font-black uppercase tracking-widest text-xs"><Briefcase className="w-5 h-5" /> <h3>Service Catalog</h3></div>
                    <button onClick={() => {
                      const newService: Service = { id: Date.now().toString(), title: "New Service", description: "Service description", iconName: "FileText" };
                      saveContent({...content, services: {...content.services, items: [...content.services.items, newService]}});
                    }} className="p-3 bg-neon-blue/10 text-neon-blue rounded-xl hover:bg-neon-blue/20 transition-all"><Plus className="w-5 h-5" /></button>
                  </div>
                  <div className="space-y-6">
                    {content.services.items.map((service, idx) => (
                      <div key={service.id} className="p-6 glass-dark rounded-[2rem] border border-white/5 space-y-4 relative group">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Entry #{idx + 1}</span>
                          <button onClick={() => saveContent({...content, services: {...content.services, items: content.services.items.filter(s => s.id !== service.id)}})} className="text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-4">
                          <input value={service.title} onChange={(e) => {
                            const newItems = [...content.services.items];
                            newItems[idx].title = e.target.value;
                            saveContent({...content, services: {...content.services, items: newItems}});
                          }} className="w-full p-4 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-neon-blue transition-all font-black uppercase tracking-tight text-sm" />
                          <textarea value={service.description} onChange={(e) => {
                            const newItems = [...content.services.items];
                            newItems[idx].description = e.target.value;
                            saveContent({...content, services: {...content.services, items: newItems}});
                          }} className="w-full p-4 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-neon-blue transition-all text-xs opacity-60 resize-none font-medium" rows={2} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Image Management */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-purple-400 font-black uppercase tracking-widest text-xs"><ImageIcon className="w-5 h-5" /> <h3>Media Assets</h3></div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Brand Logo URL</label>
                      <div className="flex gap-4">
                        <input value={content.images.logo} onChange={(e) => saveContent({...content, images: {...content.images, logo: e.target.value}})} className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-[10px] font-mono" />
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 glass">
                          <img src={content.images.logo} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">App Background URL</label>
                      <div className="flex gap-4">
                        <input value={content.images.background} onChange={(e) => saveContent({...content, images: {...content.images, background: e.target.value}})} className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-[10px] font-mono" />
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 glass">
                          <img src={content.images.background} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Feature Showcase Image</label>
                      <div className="flex gap-4">
                        <input value={content.images.featuresImg} onChange={(e) => saveContent({...content, images: {...content.images, featuresImg: e.target.value}})} className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-[10px] font-mono" />
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 glass">
                          <img src={content.images.featuresImg} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Editor */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-red-400 font-black uppercase tracking-widest text-xs"><LinkIcon className="w-5 h-5" /> <h3>Connectivity</h3></div>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">Direct Line</label>
                      <input value={content.contact.phone} onChange={(e) => saveContent({...content, contact: {...content.contact, phone: e.target.value}})} className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-neon-blue transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-4">WhatsApp Protocol</label>
                      <input value={content.contact.whatsapp} onChange={(e) => saveContent({...content, contact: {...content.contact, whatsapp: e.target.value}})} className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-neon-blue transition-all font-medium" />
                    </div>
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl absolute bottom-0 left-0 right-0">
                <button onClick={() => setIsAdminOpen(false)} className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(0,210,255,0.4)] hover:shadow-[0_0_50px_rgba(0,210,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-3" style={{ backgroundColor: content.theme.primaryColor }}>
                  <Save className="w-5 h-5" /> Synchronize Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
