import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FiUsers, FiStar, FiBriefcase, FiArrowRight, FiMenu, FiShield, 
  FiTrendingUp, FiCheckCircle, FiPenTool, FiCode, FiBarChart2
} from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
// --- Reusable Components for the new theme ---
 
const Button = ({ children, className, variant = 'primary' }) => {
    const variants = {
        primary: "bg-[#7b61ff] hover:bg-[#6a50e0] text-white",
        secondary: "bg-white text-[#7b61ff] hover:bg-gray-100",
    };
    return (
        <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className={clsx("px-6 py-3 font-bold rounded-xl text-base transition-colors flex items-center justify-center gap-2", variants[variant], className)}
        >
            {children}
        </motion.button>
    );
};

const SectionWrapper = ({ children, className }) => (
    <section className={clsx("py-24 px-4 sm:px-6 lg:px-8", className)}>
        <div className="max-w-7xl mx-auto">
            {children}
        </div>
    </section>
);

const SectionTitle = ({ children }) => (
    <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
    >
        {children}
    </motion.div>
);

// --- Main Landing Page Component ---
const ProLandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = ['Features', 'How It Works', 'Testimonials', 'Pricing'];
    
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef });
    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

    const stats = [
        { value: '50K+', label: 'Verified Professionals', position: "top-0 left-0", rotation: "-rotate-6" },
        { value: '95%', label: 'Project Success Rate', position: "top-1/4 right-0", rotation: "rotate-6" },
        { value: '24/7', label: 'Dedicated Support', position: "bottom-0 left-1/4", rotation: "rotate-3" },
    ];

    const features = [
      { icon: <FiCheckCircle size={28}/>, title: "Vetted Talent", description: "Every professional is screened for quality, expertise, and reliability, so you can hire with confidence." },
      { icon: <FiTrendingUp size={28}/>, title: "Grow Faster", description: "Scale your team on-demand with freelancers for any role, from design to development." },
      { icon: <FiShield size={28}/>, title: "Secure Payments", description: "Manage contracts and pay securely through our platform with protection for both parties." },
    ];

    const howItWorks = [
      { number: "01", title: "Post a Job", description: "Tell us about your project. Our smart system helps you create a brief that attracts the right talent.", icon: <FiPenTool size={40}/> },
      { number: "02", title: "Get Matched", description: "Our AI algorithm instantly finds you a shortlist of top candidates. Review profiles, portfolios, and reviews.", icon: <FiUsers size={40}/> },
      { number: "03", title: "Collaborate", description: "Hire your favorite professional and manage the entire project, from communication to payment, on one platform.", icon: <FiBriefcase size={40}/> },
    ];

    const testimonials = [
      { name: 'Aisha Khan', role: 'Lead Product Manager', quote: 'WorkJunction transformed our hiring. The quality and speed of matching is simply unparalleled. We filled a senior role in three days!' },
      { name: 'Ben Carter', role: 'Freelance Data Scientist', quote: 'As a freelancer, finding quality clients is everything. This platform delivers consistently. It\'s a career game-changer.' },
      { name: 'Carlos Rodriguez', role: 'CTO, Fintech Startup', quote: 'We built our core engineering team through WorkJunction. The access to verified, global talent was critical for our growth.' },
    ];

    const logos = [
      '/path/to/logo1.svg', '/path/to/logo2.svg', '/path/to/logo3.svg', 
      '/path/to/logo4.svg', '/path/to/logo5.svg', '/path/to/logo6.svg'
    ]; // Placeholder paths

    const listAnimation = {
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
        hidden: { opacity: 0 }
    };
    const itemAnimation = {
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        hidden: { opacity: 0, y: 30 }
    };
   
    const navigate = useNavigate();

    return (
        <div ref={targetRef} className="bg-white text-zinc-800 antialiased font-sans overflow-x-hidden">
            
            {/* --- Navigation --- */}
            <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-[#7b61ff] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">WJ</span>
                            </div>
                            <span className="text-2xl font-extrabold text-zinc-900">WorkJunction</span>
                        </Link>
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map(link => <a key={link} href="#" className="font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">{link}</a>)}
                        </div>
                        <div className="hidden md:flex"><Button onClick= {
                          ()=> navigate('/login')
                        }>login</Button></div>
                        <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-zinc-700"><FiMenu size={28} /></button>
                    </div>
                </div>
            </nav>

            {/* --- Main Content --- */}
            <main className="pt-20 relative">

                {/* --- Hero Section --- */}
                <section className="relative min-h-[90vh] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full z-0">
                        <motion.div style={{ y: y1 }} className="absolute -top-40 -left-40 w-96 h-96 bg-[#00c6ff]/20 rounded-full filter blur-3xl opacity-70"></motion.div>
                        <motion.div style={{ y: y2 }} className="absolute -bottom-40 -right-20 w-96 h-96 bg-[#7b61ff]/20 rounded-full filter blur-3xl opacity-70"></motion.div>
                    </div>

                    <motion.div 
                        className="relative w-full max-w-6xl bg-[#0f0f3b] text-white rounded-[2.5rem] p-8 md:p-12 transform -rotate-2 shadow-2xl"
                        initial={{ opacity: 0, y: 50, rotate: -5 }}
                        animate={{ opacity: 1, y: 0, rotate: -2 }}
                        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center transform rotate-2">
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-tight">The new standard for hiring top talent.</h1>
                                <p className="mt-6 text-lg text-gray-300 max-w-md mx-auto lg:mx-0">Instantly connect with a global network of vetted freelance professionals ready to tackle your most ambitious projects.</p>
                                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Button onClick = { 
                                      () =>
                                      navigate('/signup')
                                    }>Get Started <FiArrowRight /></Button>
                                    <Button variant="secondary">How It Works</Button>
                                </div>
                            </div>
                            <div className="relative h-80 lg:h-96">
                                <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 1, delay: 0.5, type: 'spring' }}>
                                    <div className="w-48 h-48 bg-gradient-to-br from-[#7b61ff] to-[#00c6ff] rounded-3xl shadow-2xl flex items-center justify-center"><FiBriefcase size={64} className="text-white/80" /></div>
                                </motion.div>
                                {stats.map(stat => (
                                    <motion.div key={stat.label} className={clsx("absolute p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 text-center", stat.position, stat.rotation)}
                                        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8 + Math.random() * 0.4, type: 'spring' }}>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-xs text-gray-300">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>
                
                {/* --- Trusted By Section --- */}
                <SectionWrapper className="py-16">
                    <h3 className="text-center text-zinc-500 font-semibold mb-8">TRUSTED BY THE WORLD'S MOST INNOVATIVE COMPANIES</h3>
                    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                        <motion.div className="flex gap-16" animate={{ x: ['0%', '-50%'] }} transition={{ ease: 'linear', duration: 25, repeat: Infinity }}>
                            {[...logos, ...logos].map((logo, i) => <img key={i} src={`https://logo.clearbit.com/${['google', 'amazon', 'netflix', 'slack', 'microsoft', 'spotify'][i%6]}.com`} alt="Company Logo" className="h-8 object-contain" style={{ filter: 'grayscale(1) opacity(0.6)' }}/>)}
                        </motion.div>
                    </div>
                </SectionWrapper>

                {/* --- How It Works Section --- */}
                <SectionWrapper>
                    <SectionTitle>
                        <h2 className="text-4xl font-extrabold text-zinc-900">Get Hired in 3 Easy Steps</h2>
                        <p className="mt-4 text-lg text-zinc-600">Our streamlined process makes it simple to connect with your next opportunity.</p>
                    </SectionTitle>
                    <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={listAnimation} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                        {howItWorks.map(step => (
                            <motion.div key={step.number} className="bg-[#f4f4f5] border border-zinc-200 rounded-3xl p-8 text-center" variants={itemAnimation}>
                                <div className="mx-auto w-20 h-20 flex items-center justify-center bg-[#7b61ff]/10 text-[#7b61ff] rounded-2xl mb-6">{step.icon}</div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-2">{step.title}</h3>
                                <p className="text-zinc-600">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </SectionWrapper>
                
                {/* --- Features Section --- */}
                <SectionWrapper className="bg-white">
                    <SectionTitle>
                        <h2 className="text-4xl font-extrabold text-zinc-900">A better way to build your team</h2>
                        <p className="mt-4 text-lg text-zinc-600">Powerful tools that make finding and hiring talent simple.</p>
                    </SectionTitle>
                    <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" variants={listAnimation} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                        {features.map(feature => (
                            <motion.div key={feature.title} className="p-8" variants={itemAnimation}>
                                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-[#0f0f3b] text-white rounded-2xl mb-6">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-2">{feature.title}</h3>
                                <p className="text-zinc-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </SectionWrapper>
                
                {/* --- Testimonials Section --- */}
                <SectionWrapper>
                    <SectionTitle>
                        <h2 className="text-4xl font-extrabold text-zinc-900">What Our Users Say</h2>
                        <p className="mt-4 text-lg text-zinc-600">Hear from the people building their futures on WorkJunction.</p>
                    </SectionTitle>
                    <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={listAnimation} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                        {testimonials.map(t => (
                            <motion.div key={t.name} className="bg-white border border-zinc-200/80 rounded-2xl p-8 shadow-lg" variants={itemAnimation}>
                                <p className="text-zinc-700 text-lg font-medium mb-6">"{t.quote}"</p>
                                <div>
                                    <p className="font-bold text-zinc-900">{t.name}</p>
                                    <p className="text-sm text-zinc-500">{t.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </SectionWrapper>
                
                {/* --- Final CTA Section --- */}
                <SectionWrapper>
                    <div className="relative max-w-6xl mx-auto bg-[#00c6ff] rounded-3xl p-12 text-center overflow-hidden">
                        <div className="relative z-10">
                           <h2 className="text-4xl font-extrabold text-zinc-900">Ready to Get Started?</h2>
                           <p className="mt-4 text-lg text-zinc-800 max-w-2xl mx-auto">Join thousands of businesses and professionals finding success on the world's most advanced talent platform.</p>
                           <div className="mt-8">
                               <Button onClick = {
                                  () =>
                                 navigate('/signup')
                               }>Sign Up For Free</Button>
                           </div>
                        </div>
                    </div>
                </SectionWrapper>

            </main>
            
            {/* --- Footer --- */}
            <footer className="bg-white border-t border-zinc-200">
                <SectionWrapper className="py-16">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        <div className="col-span-2 md:col-span-2">
                           <Link to="/" className="flex items-center gap-2 mb-4">
                               <div className="w-10 h-10 bg-[#7b61ff] rounded-lg flex items-center justify-center"><span className="text-white font-bold text-xl">WJ</span></div>
                               <span className="text-2xl font-extrabold text-zinc-900">WorkJunction</span>
                           </Link>
                           <p className="text-zinc-600 max-w-xs">The new standard for hiring top talent, simplified.</p>
                        </div>
                        <div>
                           <h4 className="font-bold text-zinc-900 mb-4">Product</h4>
                           <ul className="space-y-2">
                               <li><a href="#" className="text-zinc-600 hover:text-black">Features</a></li>
                               <li><a href="#" className="text-zinc-600 hover:text-black">Pricing</a></li>
                               <li><a href="#" className="text-zinc-600 hover:text-black">For Talent</a></li>
                           </ul>
                        </div>
                        <div>
                           <h4 className="font-bold text-zinc-900 mb-4">Company</h4>
                           <ul className="space-y-2">
                               <li><a href="#" className="text-zinc-600 hover:text-black">About Us</a></li>
                               <li><a href="#" className="text-zinc-600 hover:text-black">Careers</a></li>
                               <li><a href="#" className="text-zinc-600 hover:text-black">Blog</a></li>
                           </ul>
                        </div>
                        <div>
                           <div className="flex space-x-4">
                               <a href="#" className="text-zinc-500 hover:text-black"><FaTwitter size={24}/></a>
                               <a href="#" className="text-zinc-500 hover:text-black"><FaLinkedin size={24}/></a>
                               <a href="#" className="text-zinc-500 hover:text-black"><FaFacebook size={24}/></a>
                           </div>
                        </div>
                    </div>
                    <div className="mt-16 pt-8 border-t border-zinc-200 text-center text-zinc-500 text-sm">
                       <p>&copy; {new Date().getFullYear()} WorkJunction. All Rights Reserved.</p>
                    </div>
                </SectionWrapper>
            </footer>
        </div>
    );
};

export default ProLandingPage;