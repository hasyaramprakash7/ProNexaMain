import React, { useState, useEffect, useRef } from 'react';
import {
    motion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent,
} from 'framer-motion';
import {
    ArrowRight, Zap, ChevronRight, Code, Database, BarChart3, Coffee, Sparkles,
    GraduationCap, Users, BookOpen, Sun, Moon, Bot, MessageSquare, Mic, Briefcase,
    Target, Award, CheckCircle2, Building2, TrendingUp, FileText, Video, X,
} from 'lucide-react';

import HeroParallax from './HeroParallax';
import LeadCaptureForm from './LeadCaptureForm';
import AIChatScreen from './AIChatScreen';

// ─────────────────────────────────────────────────────────────
// LOGO IMPORT
// ─────────────────────────────────────────────────────────────
import logo from './image.png';

/* --- 0. LOGO COMPONENT --- */
const Logo = ({ theme, size = 'md', showText = true }) => {
    const isDark = theme === 'dark';
    const [imgFailed, setImgFailed] = useState(false);

    const sizes = {
        sm: 'h-8',
        md: 'h-10 md:h-12',
        lg: 'h-16',
    };

    return (
        <div className="flex items-center gap-3">
            {!imgFailed && (
                <img
                    src={logo}
                    alt="ProNexa Logo"
                    className={`${sizes[size] || sizes.md} w-auto object-contain rounded-md`}
                    draggable={false}
                    onError={() => setImgFailed(true)}
                />
            )}

            {showText && (
                <span className="font-serif font-bold tracking-tighter text-2xl md:text-3xl">
                    <span className={isDark ? 'text-[#F4F4F5]' : 'text-[#0B0E14]'}>Pro</span>
                    <span className="text-[#D4AF37]">Nexa</span>
                </span>
            )}
        </div>
    );
};

/* --- 1. SHARED 3D TILT CARD --- */
const TiltCard = ({ children, className, intensity = 20 }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 400, damping: 40 });
    const mouseY = useSpring(y, { stiffness: 400, damping: 40 });

    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    const rotateX = useTransform(mouseY, [-300, 300], [intensity / 2, -intensity / 2]);
    const rotateY = useTransform(mouseX, [-300, 300], [-intensity / 2, intensity / 2]);
    const shineX = useTransform(mouseX, [-300, 300], ['0%', '100%']);
    const shineY = useTransform(mouseY, [-300, 300], ['0%', '100%']);

    return (
        <motion.div
            className={className}
            onMouseMove={onMouseMove}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
            style={{ perspective: 1000 }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="h-full w-full relative transition-shadow duration-500"
            >
                {children}
                <motion.div
                    style={{
                        background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(212,175,55,0.15), transparent 60%)`,
                    }}
                    className="absolute inset-0 rounded-[inherit] pointer-events-none z-20 mix-blend-overlay"
                />
            </motion.div>
        </motion.div>
    );
};

/* --- 2. NAVBAR --- */
const Navbar = ({ onOpenForm, theme, onToggleTheme }) => {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) setHidden(true);
        else setHidden(false);
    });

    const isDark = theme === 'dark';

    return (
        <motion.nav
            variants={{ visible: { y: 0 }, hidden: { y: '-100%' } }}
            animate={hidden ? 'hidden' : 'visible'}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 backdrop-blur-md border-b transition-colors duration-500 ${
                isDark
                    ? 'bg-[#07090E]/90 border-[#D4AF37]/20 text-white'
                    : 'bg-[#FAF8F5]/90 border-stone-200/50 text-[#0B0E14]'
            }`}
        >
            <a href="#hero" aria-label="ProNexa home">
                <Logo theme={theme} size="md" />
            </a>

            <div
                className={`hidden md:flex space-x-8 text-sm font-medium ${
                    isDark ? 'text-[#F4F4F5]/70' : 'text-[#52525B]'
                }`}
            >
                <a href="#hero" className="hover:text-[#D4AF37] transition-colors">Home</a>
                <a href="#courses" className="hover:text-[#D4AF37] transition-colors">Courses</a>
                <a href="#placement" className="hover:text-[#D4AF37] transition-colors">Placement</a>
                <button onClick={() => onOpenForm('')} className="hover:text-[#D4AF37] transition-colors">
                    Enroll
                </button>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <button
                    onClick={onToggleTheme}
                    title="Toggle theme"
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                        isDark
                            ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20'
                            : 'border-stone-300 bg-white text-[#0B0E14] hover:bg-stone-100'
                    }`}
                >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <button
                    onClick={() => onOpenForm('')}
                    className="px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-[#F9D976] via-[#D4AF37] to-[#B88A44] text-[#0B0E14]"
                >
                    Enroll Now
                </button>
            </div>
        </motion.nav>
    );
};

/* --- 3. FOOTER --- */
const Footer = ({ theme }) => (
    <footer
        className={`py-12 px-6 mt-0 transition-colors duration-500 border-t ${
            theme === 'dark' ? 'bg-[#05070A] border-[#D4AF37]/10 text-[#A1A1AA]' : 'bg-[#0B0E14] border-transparent text-stone-400'
        }`}
    >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-6 justify-between items-center">
            <Logo theme="dark" size="md" />
            <p className="text-xs text-center sm:text-right">
                © 2026 ProNexa, Inc. Prepare. Perform. Get Placed.
            </p>
        </div>
    </footer>
);

/* --- 4. COURSES DATA --- */
const COURSES = [
    {
        title: 'Agentic AI',
        description: 'Design autonomous agents that plan, reason, and execute multi-step workflows using LangChain.',
        icon: Bot,
        lessons: 32,
        level: 'Advanced',
        tag: 'Agentic',
    },
    {
        title: 'Generative AI',
        description: 'Create text, images, and multimodal AI apps using LLMs and diffusion models.',
        icon: Sparkles,
        lessons: 26,
        level: 'Advanced',
        tag: 'Generative',
    },
    {
        title: 'Full Stack Python with AI',
        description: 'Build complete web apps with FastAPI, React, and AI features end to end.',
        icon: Code,
        lessons: 36,
        level: 'Intermediate',
        tag: 'Full Stack',
    },
    {
        title: 'Data Science with AI',
        description: 'Master pandas, NumPy, statistics, and ML pipelines to turn raw data into insights.',
        icon: Database,
        lessons: 30,
        level: 'Beginner',
        tag: 'Data',
    },
    {
        title: 'Data Analyst with AI',
        description: 'Learn SQL, visualization, and AI-assisted analytics to drive real decisions.',
        icon: BarChart3,
        lessons: 24,
        level: 'Beginner',
        tag: 'Analytics',
    },
    {
        title: 'Java with AI',
        description: 'Use Java with Spring Boot and AI APIs to build production-grade backend systems.',
        icon: Coffee,
        lessons: 28,
        level: 'Intermediate',
        tag: 'Backend',
    },
    {
        title: 'Soft Skills',
        description: 'Communication, teamwork, time management, and workplace etiquette that get you hired and promoted.',
        icon: MessageSquare,
        lessons: 18,
        level: 'Beginner',
        tag: 'Soft Skills',
    },
    {
        title: 'Spoken English',
        description: 'Speak confidently in interviews, stand-ups, and client calls with daily speaking drills.',
        icon: Mic,
        lessons: 22,
        level: 'Beginner',
        tag: 'English',
    },
    {
        title: 'Internship Program',
        description: 'Work on real client projects with mentor reviews, weekly demos, and a completion certificate.',
        icon: Briefcase,
        lessons: 12,
        level: 'Intermediate',
        tag: 'Internship',
    },
    {
        title: 'Placement Preparation',
        description: 'Aptitude, DSA, resume building, and mock interviews — a complete placement sprint.',
        icon: Target,
        lessons: 20,
        level: 'Intermediate',
        tag: 'Placement',
    },
];

/* --- 5. SPACE COURSE CARD --- */
const SpaceCourseCard = ({ course, onClick, theme }) => {
    const Icon = course.icon;
    const isDark = theme === 'dark';

    return (
        <TiltCard className="h-full w-full cursor-pointer group" intensity={10}>
            <div
                onClick={onClick}
                className={`relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border p-6 backdrop-blur-xl transition-all duration-500 md:p-8 ${
                    isDark
                        ? 'border-white/10 bg-[#0B0E14]/80 hover:border-[#D4AF37]/50 hover:bg-[#0B0E14]'
                        : 'border-stone-900/10 bg-white/80 hover:border-[#D4AF37]/50 hover:bg-white/95'
                }`}
            >
                <div className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 opacity-25 transition-opacity duration-700 group-hover:opacity-60 ${isDark ? '' : 'invert'}`}>
                    <DotGlobeMini dark={isDark} />
                </div>

                <div className={`pointer-events-none absolute inset-0 rounded-[inherit] ${
                    isDark
                        ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.08),transparent_60%)]'
                        : 'bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.05),transparent_60%)]'
                }`} />

                <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider md:text-xs ${
                            isDark ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F9D976]' : 'border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#B88A44]'
                        }`}>
                            {course.tag}
                        </span>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-colors md:h-12 md:w-12 ${
                            isDark ? 'border-white/15 bg-white/5 group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/50' : 'border-stone-900/10 bg-stone-900/5 group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/50'
                        }`}>
                            <Icon size={20} className={isDark ? 'text-[#F4F4F5] group-hover:text-[#D4AF37]' : 'text-[#0B0E14] group-hover:text-[#B88A44]'} />
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        <h3 className={`mb-2 font-serif text-xl leading-tight md:text-2xl ${isDark ? 'text-white' : 'text-[#0B0E14]'}`}>
                            {course.title}
                        </h3>
                        <p className={`mb-4 line-clamp-2 text-xs leading-relaxed md:text-sm ${isDark ? 'text-white/60' : 'text-[#52525B]'}`}>
                            {course.description}
                        </p>

                        <div className={`mt-auto flex items-center justify-between border-t pt-4 ${isDark ? 'border-white/10' : 'border-stone-900/10'}`}>
                            <div className="flex flex-col gap-1">
                                <span className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-[#52525B]/70'}`}>
                                    {course.lessons} lessons
                                </span>
                                <span className={`text-xs font-bold ${isDark ? 'text-[#D4AF37]' : 'text-[#B88A44]'}`}>
                                    {course.level}
                                </span>
                            </div>
                            
                            {/* Only the Enroll Arrow Button remains here */}
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-colors md:h-10 md:w-10 ${
                                    isDark
                                        ? 'border-white/15 bg-white/5 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37]'
                                        : 'border-stone-900/10 bg-stone-900/5 group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37]'
                                }`}
                            >
                                <ChevronRight
                                    size={18}
                                    className={`transition-colors ${
                                        isDark ? 'text-white group-hover:text-[#0B0E14]' : 'text-[#0B0E14]'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TiltCard>
    );
};

const DotGlobeMini = ({ dark = true }) => (
    <svg viewBox="0 0 100 100" className="h-full w-full animate-[spin_18s_linear_infinite]">
        {Array.from({ length: 90 }).map((_, i) => {
            const phi = Math.acos(1 - (2 * (i + 0.5)) / 90);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const x = 50 + Math.cos(theta) * Math.sin(phi) * 40;
            const y = 50 + Math.cos(phi) * 40;
            const r = 0.6 + Math.sin(phi) * 1.4;
            return <circle key={i} cx={x} cy={y} r={r} fill={dark ? '#D4AF37' : '#B88A44'} />;
        })}
    </svg>
);

/* --- 6. COURSES SECTION --- */
const CoursesSection = ({ onSelectCourse, onOpenForm, theme }) => {
    const isDark = theme === 'dark';

    return (
        <section
            id="courses"
            className={`relative z-10 overflow-hidden py-24 px-4 md:px-8 transition-colors duration-500 ${
                isDark ? 'bg-[#07090E]' : 'bg-[#FAF8F5]'
            }`}
            style={{ scrollMarginTop: '80px' }}
        >
            <div className="pointer-events-none absolute inset-0 opacity-20">
                <StarfieldDots dark={isDark} />
            </div>

            <div className="relative z-10 mx-auto max-w-[1400px]">
                <div className="mb-16 text-center">
                    <div
                        className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold backdrop-blur-md ${
                            isDark
                                ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F9D976]'
                                : 'border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#B88A44]'
                        }`}
                    >
                        <Sparkles size={16} /> All Courses
                    </div>

                    <h2
                        className={`mb-6 font-serif text-5xl leading-[1.05] md:text-6xl lg:text-7xl ${
                            isDark ? 'text-white' : 'text-[#0B0E14]'
                        }`}
                    >
                        Learn AI. Build skills.
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9D976] via-[#D4AF37] to-[#B88A44]">
                            Get placed.
                        </span>
                    </h2>

                    <p
                        className={`mx-auto max-w-2xl text-lg ${
                            isDark ? 'text-white/60' : 'text-[#52525B]'
                        }`}
                    >
                        AI, soft skills, spoken English, internships, and placement preparation.
                        Pick any course below to open the enrollment form with that course preselected.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                    {COURSES.map((course, idx) => (
                        <div key={idx} className="h-[320px] md:h-[340px]">
                            <SpaceCourseCard
                                course={course}
                                onClick={() => onSelectCourse(course)}
                                theme={theme}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex flex-col items-center gap-4 sm:flex-row">
                        <button
                            onClick={() => onOpenForm('')}
                            className="flex items-center gap-2 rounded-full px-8 py-4 font-bold shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-[#F9D976] via-[#D4AF37] to-[#B88A44] text-[#0B0E14]"
                        >
                            Enroll Now
                            <ArrowRight size={18} />
                        </button>
                        <span
                            className={`flex items-center gap-1.5 text-sm ${
                                isDark ? 'text-white/60' : 'text-[#52525B]'
                            }`}
                        >
                            <Zap size={14} className="text-[#D4AF37]" />
                            Free for every student
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

const StarfieldDots = ({ dark = true }) => (
    <svg className="h-full w-full" preserveAspectRatio="none">
        {Array.from({ length: 180 }).map((_, i) => {
            const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
            const y = (Math.sin(i * 78.233) * 12345.6789) % 1;
            const r = Math.abs(Math.sin(i * 3.7)) * 1.2 + 0.3;
            const o = Math.abs(Math.sin(i * 5.1)) * 0.6 + 0.15;
            return (
                <circle
                    key={i}
                    cx={`${Math.abs(x) * 100}%`}
                    cy={`${Math.abs(y) * 100}%`}
                    r={r}
                    fill={dark ? '#D4AF37' : '#B88A44'}
                    opacity={o}
                />
            );
        })}
    </svg>
);

/* --- 7. FOR STUDENTS --- */
const ForStudentsSection = ({ theme }) => {
    const isDark = theme === 'dark';

    const features = [
        {
            icon: GraduationCap,
            title: 'Learn at your own pace',
            text: 'Beginner to advanced courses built for students — no prior experience needed.',
        },
        {
            icon: BookOpen,
            title: 'Hands-on lessons',
            text: 'Every course ends with a real project you can add to your portfolio.',
        },
        {
            icon: Users,
            title: 'Mentor support on demand',
            text: 'Stuck? Our mentors and enrollment team help you choose the right course and keep you on track.',
        },
    ];

    return (
        <section
            className={`relative z-10 py-24 px-4 md:px-8 transition-colors duration-500 ${
                isDark ? 'bg-[#07090E]' : 'bg-[#FAF8F5]'
            }`}
        >
            <div className="mx-auto max-w-[1200px]">
                <div className="mb-14 text-center">
                    <h2
                        className={`mb-4 font-serif text-4xl md:text-5xl ${
                            isDark ? 'text-white' : 'text-[#0B0E14]'
                        }`}
                    >
                        Built for students
                    </h2>
                    <p className={`mx-auto max-w-xl ${isDark ? 'text-white/60' : 'text-[#52525B]'}`}>
                        A pure learning platform — pick a course, follow the lessons, and get
                        mentor support whenever you need help.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {features.map(({ icon: Icon, title, text }, i) => (
                        <div
                            key={i}
                            className={`rounded-[2rem] border p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                                isDark
                                    ? 'border-white/10 bg-[#0B0E14] hover:border-[#D4AF37]/30'
                                    : 'border-stone-200 bg-white hover:border-[#D4AF37]/30'
                            }`}
                        >
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F9D976] to-[#B88A44] text-[#0B0E14]">
                                <Icon size={22} />
                            </div>
                            <h3
                                className={`mb-2 font-serif text-xl ${
                                    isDark ? 'text-white' : 'text-[#0B0E14]'
                                }`}
                            >
                                {title}
                            </h3>
                            <p
                                className={`text-sm leading-relaxed ${
                                    isDark ? 'text-white/60' : 'text-[#52525B]'
                                }`}
                            >
                                {text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* --- 8. INTERNSHIP & PLACEMENT SECTION --- */
const PLACEMENT_STATS = [
    { icon: Users, value: '500+', label: 'Students placed' },
    { icon: Building2, value: '120+', label: 'Hiring partners' },
    { icon: TrendingUp, value: '92%', label: 'Placement rate' },
    { icon: Award, value: '1:1', label: 'Mentor support' },
];

const PLACEMENT_STEPS = [
    {
        icon: Briefcase,
        title: 'Internship Program',
        text: 'Join a mentored internship, ship real client work, and earn a verified completion certificate.',
    },
    {
        icon: FileText,
        title: 'Resume & Portfolio',
        text: 'Build an ATS-friendly resume and a project portfolio that recruiters actually read.',
    },
    {
        icon: Video,
        title: 'Mock Interviews',
        text: 'Practice technical and HR rounds with feedback on structure, clarity, and confidence.',
    },
    {
        icon: CheckCircle2,
        title: 'Placement Drive',
        text: 'Get shortlisted with our hiring partners and walk into interviews fully prepared.',
    },
];

const PlacementSection = ({ theme, onOpenForm }) => {
    const isDark = theme === 'dark';

    return (
        <section
            id="placement"
            className={`relative z-10 overflow-hidden py-24 px-4 md:px-8 transition-colors duration-500 ${
                isDark ? 'bg-[#07090E]' : 'bg-[#FAF8F5]'
            }`}
            style={{ scrollMarginTop: '80px' }}
        >
            <div className="pointer-events-none absolute inset-0 opacity-10">
                <StarfieldDots dark={isDark} />
            </div>

            <div className="relative z-10 mx-auto max-w-[1200px]">
                <div className="mb-14 text-center">
                    <div
                        className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold backdrop-blur-md ${
                            isDark
                                ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F9D976]'
                                : 'border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#B88A44]'
                        }`}
                    >
                        <Briefcase size={16} /> Internship &amp; Placement
                    </div>

                    <h2
                        className={`mb-4 font-serif text-4xl md:text-5xl ${
                            isDark ? 'text-white' : 'text-[#0B0E14]'
                        }`}
                    >
                        From learning to hired
                    </h2>

                    <p className={`mx-auto max-w-2xl ${isDark ? 'text-white/60' : 'text-[#52525B]'}`}>
                        A mentored internship, a resume that stands out, and mock interviews that
                        build real confidence — so you walk into your placement drive prepared.
                    </p>
                </div>

                <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    {PLACEMENT_STATS.map(({ icon: Icon, value, label }, i) => (
                        <div
                            key={i}
                            className={`rounded-3xl border p-6 text-center transition-all hover:-translate-y-1 ${
                                isDark
                                    ? 'border-white/10 bg-[#0B0E14] hover:border-[#D4AF37]/30'
                                    : 'border-stone-200 bg-white'
                            }`}
                        >
                            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F9D976] to-[#B88A44] text-[#0B0E14]">
                                <Icon size={18} />
                            </div>
                            <div
                                className={`font-serif text-2xl md:text-3xl ${
                                    isDark ? 'text-white' : 'text-[#0B0E14]'
                                }`}
                            >
                                {value}
                            </div>
                            <div
                                className={`mt-1 text-xs uppercase tracking-wider ${
                                    isDark ? 'text-white/50' : 'text-[#52525B]/80'
                                }`}
                            >
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {PLACEMENT_STEPS.map(({ icon: Icon, title, text }, i) => (
                        <div
                            key={i}
                            className={`rounded-[2rem] border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                                isDark
                                    ? 'border-white/10 bg-[#0B0E14] hover:border-[#D4AF37]/30'
                                    : 'border-stone-200 bg-white hover:border-[#D4AF37]/30'
                            }`}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#F9D976] to-[#B88A44] text-[#0B0E14]">
                                    <Icon size={20} />
                                </div>
                                <span
                                    className={`font-serif text-2xl ${
                                        isDark ? 'text-[#D4AF37]/20' : 'text-[#B88A44]/20'
                                    }`}
                                >
                                    0{i + 1}
                                </span>
                            </div>
                            <h3
                                className={`mb-2 font-serif text-lg ${
                                    isDark ? 'text-white' : 'text-[#0B0E14]'
                                }`}
                            >
                                {title}
                            </h3>
                            <p
                                className={`text-sm leading-relaxed ${
                                    isDark ? 'text-white/60' : 'text-[#52525B]'
                                }`}
                            >
                                {text}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-14 text-center">
                    <div className="inline-flex flex-col items-center gap-4 sm:flex-row">
                        <button
                            onClick={() => onOpenForm('Internship & Placement')}
                            className="flex items-center gap-2 rounded-full px-8 py-4 font-bold shadow-xl transition-all hover:scale-105 bg-gradient-to-r from-[#F9D976] via-[#D4AF37] to-[#B88A44] text-[#0B0E14]"
                        >
                            Apply for Internship & Placement
                            <ArrowRight size={18} />
                        </button>
                        <span
                            className={`flex items-center gap-1.5 text-sm ${
                                isDark ? 'text-white/60' : 'text-[#52525B]'
                            }`}
                        >
                            <Award size={14} className="text-[#D4AF37]" />
                            Certificate on completion
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* --- 9. 3D SPACE BACKGROUND --- */
function SpaceBackground({ theme }) {
    const canvasRef = useRef(null);
    const themeRef = useRef(theme);
    themeRef.current = theme;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const reduce =
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let w = 0;
        let h = 0;
        let raf = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

        const resize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();

        const STAR_COUNT = w < 640 ? 260 : 520;
        const stars = Array.from({ length: STAR_COUNT }, () => ({
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: Math.random() * 0.95 + 0.05,
            s: Math.random() * 0.8 + 0.4,
        }));

        const GLOBE_COUNT = 360;
        const globe = Array.from({ length: GLOBE_COUNT }, (_, i) => {
            const phi = Math.acos(1 - (2 * (i + 0.5)) / GLOBE_COUNT);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            return {
                x: Math.cos(theta) * Math.sin(phi),
                y: Math.cos(phi),
                z: Math.sin(theta) * Math.sin(phi),
            };
        });

        let globeAlpha = 0;
        let angle = 0;

        const onMove = (e) => {
            mouse.tx = (e.clientX / w - 0.5) * 2;
            mouse.ty = (e.clientY / h - 0.5) * 2;
        };

        const frame = () => {
            const isDark = themeRef.current === 'dark';
            ctx.clearRect(0, 0, w, h);
            mouse.x += (mouse.tx - mouse.x) * 0.05;
            mouse.y += (mouse.ty - mouse.y) * 0.05;

            const cx = w / 2;
            const cy = h / 2;
            const focal = Math.max(w, h) * 0.9;
            const starColor = isDark ? '#D4AF37' : '#B88A44'; // Gold stars

            for (const st of stars) {
                if (!reduce) st.z -= 0.0007;
                if (st.z <= 0.05) {
                    st.z = 1;
                    st.x = (Math.random() - 0.5) * 2;
                    st.y = (Math.random() - 0.5) * 2;
                }
                const px = cx + (st.x / st.z) * focal * 0.35 - mouse.x * 40 * (1 - st.z);
                const py = cy + (st.y / st.z) * focal * 0.35 - mouse.y * 40 * (1 - st.z);
                if (px < -5 || px > w + 5 || py < -5 || py > h + 5) continue;
                const depth = 1 - st.z;
                const r = st.s * (0.5 + depth * 1.4);
                ctx.globalAlpha = Math.min(1, 0.25 + depth * 0.9);
                ctx.fillStyle = starColor;
                ctx.beginPath();
                ctx.arc(px, py, r, 0, Math.PI * 2);
                ctx.fill();
            }

            globeAlpha += (1 - globeAlpha) * 0.06;
            if (globeAlpha > 0.01) {
                if (!reduce) angle += 0.004;
                const radius = Math.min(w, h) * (w < 640 ? 0.3 : 0.24);
                const gcx = cx + mouse.x * 14;
                const gcy = cy - h * 0.08 + mouse.y * 14;
                const tilt = 0.35 + mouse.y * 0.15;
                const rot = angle + mouse.x * 0.4;
                const cosY = Math.cos(rot);
                const sinY = Math.sin(rot);
                const cosX = Math.cos(tilt);
                const sinX = Math.sin(tilt);
                const globeColor = isDark ? '#D4AF37' : '#B88A44';

                for (const p of globe) {
                    const x1 = p.x * cosY + p.z * sinY;
                    const z1 = -p.x * sinY + p.z * cosY;
                    const y2 = p.y * cosX - z1 * sinX;
                    const z2 = p.y * sinX + z1 * cosX;
                    const persp = 1 / (1.8 - z2 * 0.5);
                    const sx = gcx + x1 * radius * persp * 1.8;
                    const sy = gcy + y2 * radius * persp * 1.8;
                    const front = (z2 + 1) / 2;
                    ctx.globalAlpha = globeAlpha * (0.12 + front * 0.8);
                    ctx.fillStyle = globeColor;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 0.6 + front * 1.3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);

        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', onMove);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
                pointerEvents: 'none',
                backgroundColor: theme === 'dark' ? '#07090E' : '#FAF8F5',
                transition: 'background-color 0.5s ease',
            }}
        />
    );
}

/* --- 10. INLINE FORM SECTION WITH 3D BACKGROUND --- */
const EnrollmentSection = ({ theme }) => {
    const isDark = theme === 'dark';

    return (
        <section
            id="enroll"
            className="relative z-10 py-24 px-4 md:px-8 transition-colors duration-500 overflow-hidden"
        >
            <SpaceBackground theme={theme} />

            <div className="relative z-10 mx-auto max-w-xl">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full"
                >
                    <div className="mb-8 text-center">
                        <div
                            className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-bold backdrop-blur-md ${
                                isDark
                                    ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F9D976]'
                                    : 'border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#B88A44]'
                            }`}
                        >
                            <Users size={16} /> Free enrollment
                        </div>

                        <h2
                            className={`mb-2 font-serif text-4xl md:text-5xl ${
                                isDark ? 'text-white' : 'text-[#0B0E14]'
                            }`}
                        >
                            Join ProNexa
                        </h2>

                        <p className={`text-lg ${isDark ? 'text-white/60' : 'text-[#52525B]'}`}>
                            Fill in your details and we&apos;ll open WhatsApp so you can send your
                            information to the team.
                        </p>
                    </div>

                    <LeadCaptureForm
                        open={true}
                        onClose={() => {}}
                        theme={theme}
                        presetCourse=""
                        inline={true}
                    />
                </motion.div>
            </div>
        </section>
    );
};

/* --- 11. ENROLLMENT FORM MODAL --- */
const EnrollmentFormModal = ({ open, onClose, theme, presetCourse }) => {
    if (!open) return null;

    const isDark = theme === 'dark';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border shadow-2xl ${
                    isDark
                        ? 'border-[#D4AF37]/20 bg-[#0B0E14] text-white'
                        : 'border-stone-200 bg-[#FAF8F5] text-[#0B0E14]'
                }`}
            >
                <button
                    onClick={onClose}
                    aria-label="Close enrollment form"
                    className={`absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                        isDark
                            ? 'border-white/20 bg-white/5 text-white hover:bg-[#D4AF37]/20'
                            : 'border-stone-300 bg-white text-[#0B0E14] hover:bg-stone-100'
                    }`}
                >
                    <X size={16} />
                </button>

                <div className="max-h-[85vh] overflow-y-auto p-4 md:p-6">
                    <LeadCaptureForm
                        open={open}
                        onClose={onClose}
                        theme={theme}
                        presetCourse={presetCourse}
                        inline={false}
                    />
                </div>
            </motion.div>
        </div>
    );
};

/* --- 12. MAIN LAYOUT --- */
const LandingPage = () => {
    const [theme, setTheme] = useState('dark');
    
    // Form State
    const [formOpen, setFormOpen] = useState(false);
    const [presetCourse, setPresetCourse] = useState('');
    
    // Chat State
    const [chatOpen, setChatOpen] = useState(false);
    const [chatKey, setChatKey] = useState(0);

    const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

    // Form Methods
    const openForm = (courseTitle = '') => {
        setPresetCourse(courseTitle);
        setFormOpen(true);
    };
    const closeForm = () => {
        setFormOpen(false);
        setPresetCourse('');
    };
    const openCourseForm = (course) => {
        openForm(course?.title || '');
    };

    // Chat Methods
    const openChat = () => {
        setChatKey(k => k + 1);
        setChatOpen(true);
    };

    return (
        <div
            className={`min-h-screen font-sans selection:bg-[#D4AF37]/30 transition-colors duration-500 ${
                theme === 'dark' ? 'bg-[#07090E] text-white' : 'bg-[#FAF8F5] text-[#0B0E14]'
            }`}
        >
            <Navbar onOpenForm={openForm} theme={theme} onToggleTheme={toggleTheme} />

            <section id="hero" className="relative">
                <HeroParallax theme={theme} />
            </section>

            <CoursesSection
                onSelectCourse={openCourseForm}
                onOpenForm={openForm}
                theme={theme}
            />

            <EnrollmentSection theme={theme} />

            <ForStudentsSection theme={theme} />

            <PlacementSection theme={theme} onOpenForm={openForm} />

            <Footer theme={theme} />

            {/* ONLY FLOATING ROBOT ICON FOR AI CHAT */}
            <motion.button
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.3 }}
                onClick={openChat}
                className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#F9D976] to-[#B88A44] text-[#0B0E14] shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-transform hover:scale-110"
                title="Ask AI Tutor"
            >
                <Bot size={26} />
            </motion.button>

            {/* Modals */}
            <EnrollmentFormModal
                open={formOpen}
                onClose={closeForm}
                theme={theme}
                presetCourse={presetCourse}
            />

            <AIChatScreen
                key={chatKey}
                open={chatOpen}
                onClose={() => setChatOpen(false)}
                theme={theme}
                onToggleTheme={toggleTheme}
            />
        </div>
    );
};

export default LandingPage;