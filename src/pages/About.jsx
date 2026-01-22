import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Lightbulb, TrendingUp, Users, Target, Rocket, Globe, ChevronDown, ChevronUp, Award, BookOpen } from 'lucide-react';

const About = () => {
    const { hash } = useLocation();
    const [activeAccordion, setActiveAccordion] = useState('vision');

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    const toggleAccordion = (id) => {
        setActiveAccordion(activeAccordion === id ? null : id);
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">

            {/* ================= HERO ================= */}
            <section className="relative bg-slate-900 border-b-4 border-yellow-500 overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20 opacity-10"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white uppercase drop-shadow-md mb-6">
                        About Us
                    </h1>
                    <div className="h-1 w-24 bg-yellow-500 mx-auto mb-6"></div>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                        Fostering a culture of <span className="text-white font-medium">Innovation</span>, <span className="text-white font-medium">Entrepreneurship</span>, and <span className="text-white font-medium">Technical Excellence</span> within the IT Department.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-16">

                {/* ================= IEF ================= */}
                <section id="ief" className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 md:p-12">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                            <Globe className="w-8 h-8 text-green-700" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800">Innovation & Entrepreneurship Forum (IEF)</h2>
                            <p className="text-green-700 font-medium">The Umbrella Body of IT Department</p>
                        </div>
                    </div>

                    <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-4">
                        <p>
                            The Innovation & Entrepreneurship Forum (IEF) at Kongu Engineering College (KEC) is a unified institutional platform established to nurture a holistic culture of innovation, creativity, and entrepreneurship among students, faculty, and staff.
                        </p>

                        <p>
                            IEF functions as the umbrella forum integrating the Institution’s Innovation Council (IIC), Entrepreneurship & Management Development Centre (EMDC), Technology Business Incubator (TBI), Smart India Hackathon (SIH), YUKTI programs, KEC Spark Fund, and the college Innovation & Startup Policy (KISP).
                        </p>

                        <p>
                            This integrated ecosystem supports students across every stage of innovation — from ideation and mentoring to prototype development, incubation, and startup formation. IEF promotes an innovation-driven mindset, encourages entrepreneurship as a career path, and enables the transformation of ideas into viable products and services, aligned with KEC’s Innovation & Startup Policy (KISP 2020).
                        </p>
                    </div>
                </section>

                {/* ================= PILLARS ================= */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-8 w-1 bg-blue-900 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">Our Pillars of Excellence</h2>
                    </div>

                    {/* IIC */}
                    <div id="iic" className="bg-white rounded-xl shadow-lg border-l-4 border-blue-600">
                        <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
                            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <Lightbulb className="w-10 h-10 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Institution’s Innovation Council (IIC)</h3>
                                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold uppercase">MoE Initiative</span>

                                <p className="text-gray-600 text-lg leading-relaxed my-6">
                                    Institution’s Innovation Council (IIC) at Kongu Engineering College was established in 2018–19 under the Ministry of Education’s Innovation Cell (MIC), Government of India. As a core pillar of IEF, IIC promotes innovation-led learning, creative problem solving, and startup culture.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-2"><Target className="w-4 h-4 text-blue-500" /> Hackathons & Ideation Challenges</div>
                                    <div className="flex items-center gap-2"><Rocket className="w-4 h-4 text-blue-500" /> Prototype & Startup Exposure</div>
                                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Industry Interaction</div>
                                    <div className="flex items-center gap-2"><Award className="w-4 h-4 text-blue-500" /> National Innovation Programs</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EMDC */}
                    <div id="emdc" className="bg-white rounded-xl shadow-lg border-l-4 border-purple-600">
                        <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
                            <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-10 h-10 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Entrepreneurship & Management Development Centre (EMDC)</h3>
                                <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-bold uppercase">Established 1993</span>

                                <p className="text-gray-600 text-lg leading-relaxed my-6">
                                    Entrepreneurship & Management Development Centre (EMDC) is one of the earliest entrepreneurial initiatives at KEC. As a core unit of IEF, EMDC builds awareness about entrepreneurship and equips students with business thinking, leadership skills, and startup readiness.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-2"><Target className="w-4 h-4 text-purple-500" /> Entrepreneurship Awareness</div>
                                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" /> Founder Talks & Mentorship</div>
                                    <div className="flex items-center gap-2"><Rocket className="w-4 h-4 text-purple-500" /> Pre-Incubation Support</div>
                                    <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-purple-500" /> Startup Readiness</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* IT Association */}
                    <div id="association" className="bg-white rounded-xl shadow-lg border-l-4 border-emerald-600">
                        <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
                            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <Users className="w-10 h-10 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">IT Association</h3>
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold uppercase">Student Body</span>

                                <p className="text-gray-600 text-lg leading-relaxed my-6">
                                    The IT Association represents the student community of the IT Department and actively organizes technical symposiums, workshops, coding events, industry interactions, and departmental initiatives.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-2"><Award className="w-4 h-4 text-emerald-500" /> Technical Symposiums</div>
                                    <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-emerald-500" /> Workshops & Guest Lectures</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= DEPARTMENT ================= */}
                <section className="bg-white rounded-xl shadow-xl overflow-hidden mb-16">
                    <div className="bg-slate-900 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">About the Department</h2>
                    </div>

                    <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" /> Department Profile
                            </h3>

                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        <tr><td className="px-6 py-4 text-sm font-medium text-gray-500 bg-gray-50">Established</td><td className="px-6 py-4 text-sm font-semibold text-gray-900">1998</td></tr>
                                        <tr><td className="px-6 py-4 text-sm font-medium text-gray-500 bg-gray-50">Program</td><td className="px-6 py-4 text-sm text-gray-900">B.Tech - Information Technology</td></tr>
                                        <tr><td className="px-6 py-4 text-sm font-medium text-gray-500 bg-gray-50">Accreditation</td><td className="px-6 py-4 text-sm text-gray-900">NBA Accredited (Tier-1)</td></tr>
                                        <tr><td className="px-6 py-4 text-sm font-medium text-gray-500 bg-gray-50">Intake</td><td className="px-6 py-4 text-sm text-gray-900">180 Seats</td></tr>
                                        <tr><td className="px-6 py-4 text-sm font-medium text-gray-500 bg-gray-50">HOD</td><td className="px-6 py-4 text-sm text-gray-900">Dr.S.Anandamurugan</td></tr>

                                    </tbody>
                                </table>
                            </div>

                            <p className="mt-6 text-gray-600 leading-relaxed text-sm">
                                The Department of Information Technology was started in 1998 and offers a four-year B.Tech programme. The department has a team of dedicated and experienced faculty members to prepare students for global technological challenges.
                            </p>
                        </div>

                        {/* Vision & Mission */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Target className="w-5 h-5 text-red-600" /> Strategic Goals
                            </h3>

                            {/* Vision */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <button onClick={() => toggleAccordion('vision')} className="w-full px-6 py-4 flex justify-between bg-white hover:bg-gray-50">
                                    <span className="font-bold uppercase">Vision</span>
                                    {activeAccordion === 'vision' ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {activeAccordion === 'vision' && (
                                    <div className="px-6 py-6 bg-blue-50/50 border-t">
                                        <p className="text-gray-700 italic">
                                            "To be a centre of excellence for development and dissemination of knowledge in Information Technology for the Nation and beyond."
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Mission */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <button onClick={() => toggleAccordion('mission')} className="w-full px-6 py-4 flex justify-between bg-white hover:bg-gray-50">
                                    <span className="font-bold uppercase">Mission</span>
                                    {activeAccordion === 'mission' ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {activeAccordion === 'mission' && (
                                    <div className="px-6 py-6 bg-green-50/50 border-t">
                                        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                                            <li>To transform students into innovative IT professionals.</li>
                                            <li>To impart value-based and industry-relevant education.</li>
                                            <li>To continuously enhance technical expertise of students and faculty.</li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default About;
