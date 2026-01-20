import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Lightbulb, TrendingUp, Users, Target, Rocket, Globe } from 'lucide-react';
import Card from '../components/ui/Card';

const AboutSection = ({ id, title, icon: Icon, color, children }) => {
    const colorClasses = {
        blue: "text-blue-600 bg-blue-100",
        purple: "text-purple-600 bg-purple-100",
        indigo: "text-indigo-600 bg-indigo-100",
        green: "text-green-600 bg-green-100",
    };

    return (
        <section id={id} className="scroll-mt-24 py-12 border-b border-gray-100 last:border-0">
            <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            </div>
            <div className="prose prose-lg text-gray-600 max-w-none">
                {children}
            </div>
        </section>
    );
};

const About = () => {
    const { hash } = useLocation();

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

    return (
        <div className="bg-white min-h-screen pb-16">
            {/* Header */}
            <div className="bg-slate-900 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About Us</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Fostering innovation, entrepreneurship, and technical excellence in the IT Department.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">

                {/* IEF - Innovation & Entrepreneurship Forum (Generic Intro) */}
                <AboutSection id="ief" title="Innovation & Events Forum" icon={Globe} color="green">
                    <p>
                        The Innovation & Events Forum (IEF) of the IT Department is the umbrella body that coordinates all student activities, clubs, and initiatives. Our mission is to create a vibrant ecosystem where students can explore technology, develop leadership skills, and turn their innovative ideas into reality.
                    </p>
                    <p>
                        We believe in holistic development, bridging the gap between academic learning and industry requirements through workshops, hackathons, and expert sessions.
                    </p>
                </AboutSection>

                {/* IIC */}
                <AboutSection id="iic" title="Institution's Innovation Council (IIC)" icon={Lightbulb} color="blue">
                    <p>
                        The Institution's Innovation Council (IIC) is an initiative by the Ministry of Education (MoE), Govt. of India. Our primary mandate is to encourage, inspire, and nurture young students by supporting them to work with new ideas and transform them into prototypes.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4">
                        <li>Conducting Innovation & Entrepreneurship-related activities.</li>
                        <li>Identifying and rewarding innovations and share success stories.</li>
                        <li>Organizing Hackathons, idea competitions, mini-challenges, etc.</li>
                        <li>Interaction with entrepreneurs and investors.</li>
                    </ul>
                </AboutSection>

                {/* EMDC */}
                <AboutSection id="emdc" title="Entrepreneurship & Management Development Centre (EMDC)" icon={TrendingUp} color="purple">
                    <p>
                        EMDC is dedicated to fostering an entrepreneurial spirit among students. We provide guidance, mentorship, and resources to aspiring entrepreneurs, helping them navigate the complex world of business and management.
                    </p>
                    <p>
                        Through seminars, business plan competitions, and networking events, EMDC aims to produce not just job seekers, but job creators who can contribute to the economy.
                    </p>
                </AboutSection>

                {/* IT Association */}
                <AboutSection id="association" title="IT Association" icon={Users} color="indigo">
                    <p>
                        The IT Association is the representative body of the Information Technology department students. It is responsible for organizing the department's flagship technical symposiums, cultural events, and guest lectures.
                    </p>
                    <p>
                        We strive to keep students updated with the latest trends in technology, providing a platform for peer-to-peer learning and professional networking.
                    </p>
                </AboutSection>

            </div>
        </div>
    );
};

export default About;
