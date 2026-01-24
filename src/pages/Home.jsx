import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight, Calendar, Users, Award,
    Lightbulb, TrendingUp, Rocket, Shield,
    Cpu, Target, Sparkles, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EventCard from '../components/events/EventCard';

const Home = () => {
    // Mock Data for Events
    const upcomingEvents = [
        {
            id: 1,
            title: "Innovation Hackathon 2024",
            date: "March 15, 2024",
            time: "9:00 AM",
            venue: "Main Auditorium",
            category: "IIC",
            type: "Hackathon",
            image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: 2,
            title: "Entrepreneurship Summit",
            date: "March 20, 2024",
            time: "10:00 AM",
            venue: "Seminar Hall 1",
            category: "EMDC",
            type: "Seminar",
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: 3,
            title: "Tech Talk: AI in 2024",
            date: "March 25, 2024",
            time: "2:00 PM",
            venue: "Online",
            category: "Association",
            type: "Workshop",
            image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=1000",
        },
    ];

    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="bg-[#efeadf] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* 🌌 Premium Institutional Hero Section */}
            <section className="relative h-[550px] flex items-center justify-center overflow-hidden bg-slate-950 border-b-4 border-yellow-500/30">
                {/* Background Textures & Depth */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/Kec.jpeg"
                        alt="KEC Campus"
                        className="w-full h-full object-cover opacity-45 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-900/60 to-slate-950/90"></div>
                </div>

                {/* Hero Content */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.2 } }
                    }}
                    className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                >
                    <motion.div
                        variants={fadeIn}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-8 backdrop-blur-sm"
                    >
                        <Sparkles size={12} />
                        <span>Innovation & Entrepreneurship Ecosystem</span>
                    </motion.div>

                    <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase italic font-serif">
                        Department of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Information Technology</span>
                    </motion.h1>

                    <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light border-y border-white/10 py-4 uppercase tracking-widest">
                        Excellence in Innovation, Entrepreneurship, and Technology
                    </motion.p>

                    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/events">
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl shadow-2xl shadow-blue-900/40 transition-all hover:-translate-y-1 uppercase tracking-widest text-xs">
                                Explore Activities
                            </Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="outline" className="border border-white/20 text-white hover:bg-white/5 px-10 py-4 rounded-xl backdrop-blur-sm font-semibold uppercase tracking-widest text-xs">
                                Discover More
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* 🏛️ About IEF Block - Mission & Vision */}
            <section className="py-24 bg-[#e8e4d8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="lg:col-span-12 mb-12"
                        >
                            {/* Visual Placeholder for Carousel (Future Prep) */}
                            {/* <div className="h-[400px] w-full bg-slate-200 rounded-3xl overflow-hidden shadow-inner border border-slate-300">
                                <div className="w-full h-full flex items-center justify-center text-slate-400 italic">Carousel Placeholder</div>
                            </div> */}
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="lg:col-span-7 space-y-8"
                        >
                            <div className="space-y-4">
                                <div className="h-1 w-12 bg-blue-600"></div>
                                <h2 className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">About IEF</h2>
                                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                                    A structured gateway for <br />
                                    <span className="italic font-serif text-blue-900">Student Innovation</span>
                                </h3>
                            </div>
                            <p className="text-slate-800 text-lg leading-relaxed max-w-2xl">
                                The Innovation & Entrepreneurship Forum (IEF) serves as the primary governing body for all entrepreneurial and technical student initiatives within the IT department. We believe in high-institutional standards and deep-tech impact.
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-slate-900">IEF</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Forum Identity</span>
                                </div>
                                <div className="h-12 w-px bg-slate-400 mx-4"></div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-slate-900 tracking-tighter">ESTD.</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Founded 2023</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 relative"
                        >
                            <div className="aspect-[4/5] bg-white p-4 rounded-2xl shadow-2xl border border-[#dcd8cc] rotate-2 hover:rotate-0 transition-transform duration-700 group">
                                <img
                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000"
                                    alt="Innovation Hub"
                                    className="w-full h-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 🛡️ Bodies Showcase Section - Enhanced Contrast */}
            <section className="py-24 bg-[#efeadf] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-blue-600 font-bold tracking-widest text-[10px] uppercase">Governance</h2>
                            <h3 className="text-4xl font-bold text-slate-900 tracking-tight uppercase leading-snug">Core Ecosystem Bodies</h3>
                        </div>
                        <p className="text-slate-600 max-w-md text-right hidden md:block text-xs uppercase tracking-widest font-medium">
                            Four distinct pillars under IEF.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                id: 'iic',
                                name: "IIC",
                                title: "Institution's Innovation Council",
                                icon: Lightbulb,
                                desc: "Cultivating a culture of innovation and creating a vibrant startup ecosystem among the students.",
                                link: "/about#iic",
                                accent: "bg-blue-600"
                            },
                            {
                                id: 'emdc',
                                name: "EMDC",
                                title: "Entrepreneurship Development Center",
                                icon: TrendingUp,
                                desc: "Nurturing entrepreneurial spirit and providing professional management skills for future leaders.",
                                link: "/about#emdc",
                                accent: "bg-slate-800"
                            },
                            {
                                id: 'asoc',
                                name: "IT Association",
                                title: "Student Welfare & Socials",
                                icon: Users,
                                desc: "The central student body managing technical symposiums, workshops, and extracurricular department flow.",
                                link: "/about#association",
                                accent: "bg-blue-800"
                            }
                        ].map((body, idx) => (
                            <motion.div
                                key={body.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white border border-[#dcd8cc] p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500 group"
                            >
                                <div className={`w-12 h-12 ${body.accent} rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform`}>
                                    <body.icon size={24} />
                                </div>
                                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">{body.name}</h4>
                                <h5 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">{body.title}</h5>
                                <p className="text-slate-600 text-sm leading-relaxed mb-10">
                                    {body.desc}
                                </p>
                                <Link to={body.link} className="inline-flex items-center text-slate-900 font-bold text-[10px] uppercase tracking-widest group/link">
                                    Learn More <ChevronRight size={14} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🛤️ Innovation Journey Flow - Enhanced visibility */}
            <section className="py-24 bg-[#e8e4d8] overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-blue-600 font-bold tracking-widest text-[10px] uppercase">Roadmap</h2>
                        <h3 className="text-4xl font-bold text-slate-900 tracking-tight uppercase">The Innovation Lifecycle</h3>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-1 bg-slate-400/20 shadow-inner"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                            {[
                                { step: "01", label: "Idea Stage", icon: Lightbulb, desc: "Submit and validate your core concept." },
                                { step: "02", label: "Innovation", icon: Shield, desc: "Refine technology and market strategy." },
                                { step: "03", label: "Prototype", icon: Cpu, desc: "Build MVP with our specialized labs." },
                                { step: "04", label: "Startup", icon: Target, desc: "Scaling and commercialization." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="flex flex-col items-center text-center space-y-6"
                                >
                                    <div className="w-24 h-24 rounded-[2rem] bg-white border border-[#dcd8cc] flex items-center justify-center text-blue-600 shadow-xl shadow-blue-900/5 relative z-10 group hover:bg-blue-600 hover:text-white transition-all duration-300">
                                        <item.icon size={36} />
                                        <span className="absolute -top-3 -right-3 bg-slate-900 text-white text-[10px] w-8 h-8 rounded-xl flex items-center justify-center font-bold tracking-tighter">{item.step}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-base font-bold text-slate-900 uppercase tracking-tight">{item.label}</h4>
                                        <p className="text-slate-600 text-[13px] max-w-[170px] mx-auto leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 📈 Impact / Statistics Section */}
            <section className="py-24 bg-slate-950 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-white/5">
                        {[
                            { val: "50+", label: "Total Events", icon: Calendar },
                            { val: "1.2K", label: "Participants", icon: Users },
                            { val: "24", label: "Active Startups", icon: Rocket },
                            { val: "15", label: "Awards Won", icon: Award }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-4"
                            >
                                <div className="text-5xl font-black text-white tracking-tighter mb-2 font-mono italic">{stat.val}</div>
                                <div className="text-blue-500 text-[9px] font-bold uppercase tracking-[0.4em]">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* Visual Depth Orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            </section>

            {/* 📅 Ongoing Activities List (Beige Theme - White Cards) */}
            <section className="py-24 bg-[#efeadf]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-16 border-b border-[#dcd8cc] pb-8">
                        <div className="space-y-2">
                            <h2 className="text-blue-600 font-bold tracking-widest text-[10px] uppercase">Curated Feed</h2>
                            <h3 className="text-4xl font-bold text-slate-900 uppercase">Upcoming Activities</h3>
                        </div>
                        <Link to="/events" className="group flex items-center gap-2 text-slate-900 font-bold uppercase text-[10px] tracking-widest hover:text-blue-600 transition-colors">
                            All Events <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
