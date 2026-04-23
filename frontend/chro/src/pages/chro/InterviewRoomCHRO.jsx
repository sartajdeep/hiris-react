import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useToast } from '../../components/ToastContext';

// ── Static/Mock Data ──────────────────────────────────────────
const AI_SCORES = { 'Academic Qualifications': 4.2, 'Research Output': 4.0, 'Teaching Demo': 3.2, 'Communication Skills': 4.1, 'Culture Fit': 3.9 };
const CRITERIA_WEIGHTS = { 'Academic Qualifications': 0.25, 'Research Output': 0.30, 'Teaching Demo': 0.20, 'Communication Skills': 0.15, 'Culture Fit': 0.10 };

const SIM_TRANSCRIPT = [
    { speaker: 'Interviewer', text: "Can you walk us through your background and how it relates to this role?", tag: null },
    { speaker: 'Candidate', text: "Of course. My work focused on advanced machine learning algorithms. I developed a framework that improved model accuracy by 34% on our benchmark tasks.", tag: 'Academic Qualifications' },
    { speaker: 'Interviewer', text: "That's impressive. What is your publication record so far?", tag: null },
    { speaker: 'Candidate', text: "I've published 7 peer-reviewed papers. My h-index is currently 8.", tag: 'Research Output' },
    { speaker: 'Interviewer', text: "Tell me about your teaching experience.", tag: null },
    { speaker: 'Candidate', text: "I've mostly done guest lectures in my department — around 10 sessions. I haven't had a full semester course of my own yet, but I'm eager to start.", tag: 'Teaching Demo' },
    { speaker: 'Interviewer', text: "How do you approach collaboration with students on research projects?", tag: null },
    { speaker: 'Candidate', text: "Collaboration with students is where my best research ideas come from. I believe in giving students real ownership of sub-problems.", tag: 'Culture Fit' },
    { speaker: 'Interviewer', text: "How would you describe your communication style with non-technical audiences?", tag: null },
    { speaker: 'Candidate', text: "I focus on analogies and visual explanations. I've given talks to industry partners who had no technical background, and the feedback has always been positive.", tag: 'Communication Skills' },
];

const AI_SUGGESTIONS = [
    { text: "Probe grant funding: Ask if they have applied for or received external research grants.", criterion: 'Research Output' },
    { text: "Teaching plan: Ask how they would structure an intro course from scratch.", criterion: 'Teaching Demo' },
    { text: "Student mentorship: Ask about their experience guiding students.", criterion: 'Teaching Demo' },
    { text: "Conflict resolution: How do they handle disagreements with collaborators?", criterion: 'Culture Fit' },
    { text: "5-year research vision: What funding or industry partnerships do they plan to pursue?", criterion: 'Research Output' },
];

// Helper to format MM:SS
function formatTime(s) {
    return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

const RUBRIC_COVERAGE_ITEMS = [
    { key: 'Academic Qualifications', label: 'Academic Qualifications', weight: '25%' },
    { key: 'Research Output', label: 'Research Output', weight: '30%' },
    { key: 'Teaching Demo', label: 'Teaching Demo', weight: '20%' },
    { key: 'Communication Skills', label: 'Communication Skills', weight: '15%' },
    { key: 'Culture Fit', label: 'Culture & Values Fit', weight: '10%' },
];

export default function InterviewRoomCHRO() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const toast = useToast();
    const candidateId = params.candidateId;

    // Candidate state and fallback
    const [candidate, setCandidate] = useState(location.state?.candidate || {
        name: 'Dr. Ananya Roy',
        role: 'Asst. Professor, Robotics',
        dept: 'Computer Science',
        initials: 'AR',
        color: '#28666E'
    });

    useEffect(() => {
        if (!location.state?.candidate && candidateId) {
            fetch(`http://localhost:3001/api/candidates/${candidateId}`)
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (!data) return;
                    setCandidate({
                        name: data.name || 'Candidate',
                        role: data.role_applied || 'Candidate Review',
                        dept: data.opening_id || 'Department',
                        initials: data.name ? data.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'C',
                        color: '#28666E',
                        ...data,
                    });
                })
                .catch(() => {});
        }
    }, [candidateId, location.state?.candidate]);

    // ── Phase & UI State ───────────────────────────────────────
    const [phase, setPhase] = useState('interview'); // 'interview' | 'review'
    const [showRubricModal, setShowRubricModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // ── Recording & Timer State ────────────────────────────────
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [finalDuration, setFinalDuration] = useState('00:00');
    const timerRef = useRef(null);

    // ── Transcript & Simulation State ──────────────────────────
    const [transcript, setTranscript] = useState([]);
    const [simIndex, setSimIndex] = useState(0);
    const [simInterval, setSimInterval] = useState(null);
    const [coveredCriteria, setCoveredCriteria] = useState(new Set());
    
    const [suggestions, setSuggestions] = useState([]);
    const [suggIndex, setSuggIndex] = useState(0);

    const [interviewNotes, setInterviewNotes] = useState('');

    // ── Review State ──────────────────────────────────────────
    const [manualOverall, setManualOverall] = useState(0);
    const [manualScores, setManualScores] = useState({
        'Academic Qualifications': 3,
        'Research Output': 3,
        'Teaching Demo': 3,
        'Communication Skills': 3,
        'Culture Fit': 3,
    });
    const [recommendation, setRecommendation] = useState(null); // 'proceed' | 'hold' | 'reject'
    const [aiWeightPct, setAiWeightPct] = useState(50);
    const [manualFeedback, setManualFeedback] = useState('');

    const transcriptEndRef = useRef(null);

    // Escape listener to close modals
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowRubricModal(false);
                setShowSubmitModal(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Timer logic
    useEffect(() => {
        if (isRecording && !isPaused) {
            timerRef.current = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRecording, isPaused]);

    // Simulation logic for transcript
    useEffect(() => {
        if (isRecording && !isPaused) {
            const int = setInterval(() => {
                if (simIndex < SIM_TRANSCRIPT.length) {
                    const entry = SIM_TRANSCRIPT[simIndex];
                    
                    setTranscript(prev => [...prev, { ...entry, time: seconds }]);
                    
                    if (entry.tag) {
                        setCoveredCriteria(prev => new Set(prev).add(entry.tag));
                    }

                    // Surface suggestion every 2 entries
                    if (simIndex % 2 === 0 && suggIndex < AI_SUGGESTIONS.length) {
                        const sugg = AI_SUGGESTIONS[suggIndex];
                        setSuggestions(prev => [sugg, ...prev]);
                        setSuggIndex(s => s + 1);
                    }

                    setSimIndex(s => s + 1);
                }
            }, 3500);
            setSimInterval(int);
            return () => clearInterval(int);
        } else {
            clearInterval(simInterval);
        }
    }, [isRecording, isPaused, simIndex, suggIndex, seconds]);

    // Auto scroll transcript
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    const handleToggleRecording = () => {
        if (!isRecording) {
            setIsRecording(true);
            setIsPaused(false);
            setTranscript([]); // Clear if started recording again (though one-way flow usually)
            setSimIndex(0);
            setSuggIndex(0);
            setSuggestions([]);
        } else {
            // End interview
            handleEndInterview();
        }
    };

    const handleEndInterview = () => {
        setIsRecording(false);
        setIsPaused(false);
        setFinalDuration(formatTime(seconds));
        setPhase('review');
    };

    const copyTranscript = () => {
        const text = transcript.map(t => `[${t.speaker}] ${t.text}`).join('\n\n');
        navigator.clipboard?.writeText(text);
        toast('Transcript copied to clipboard', 'success');
    };

    const downloadTranscript = () => {
        const text = transcript.length
            ? transcript.map(t => `[${t.speaker}]\n${t.text}`).join('\n\n---\n\n')
            : 'No transcript recorded.';
        const blob = new Blob([text], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Interview_Transcript_${candidate.name.replace(/\s+/g,'')}.txt`;
        a.click();
    };

    const handleDecision = (decision) => {
        setRecommendation(decision);
        setShowSubmitModal(true);
    };

    // Calculate composites
    let aiWeighted = 0;
    let manWeighted = 0;
    let hasManual = false;

    Object.keys(AI_SCORES).forEach(criterion => {
        const w = CRITERIA_WEIGHTS[criterion];
        aiWeighted += AI_SCORES[criterion] * w;
        if (manualScores[criterion] > 0) {
            manWeighted += manualScores[criterion] * w;
            hasManual = true;
        }
    });

    const wPct = aiWeightPct / 100;
    const overallComposite = hasManual ? (aiWeighted * wPct + manWeighted * (1 - wPct)) : aiWeighted;
    
    let verdictText = '✗ Reject';
    let verdictClass = 'bg-red-100 text-red-600';
    if (overallComposite >= 4.0) { verdictText = '✓ Strong Proceed'; verdictClass = 'bg-green-100 text-green-700'; }
    else if (overallComposite >= 3.5) { verdictText = '→ Proceed'; verdictClass = 'bg-teal-100 text-teal-700'; }
    else if (overallComposite >= 3.0) { verdictText = '⏸ Hold for Review'; verdictClass = 'bg-amber-100 text-amber-700'; }

    return (
        <div style={{ background: '#F8FAFC', color: '#1E293B', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>

            {/* Injected animations directly since we replaced index.css mostly or want to ensure they work */}
            <style>{`
                @keyframes ripple { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
                @keyframes pulse-ring { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.85; } }
                @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes fadeIn { from{opacity:0} to{opacity:1} }
                @keyframes waveBar { 0%, 100% { height: 6px; } 50% { height: 22px; } }
                .ripple-ring { position: absolute; border-radius: 50%; border: 2px solid #28666E; animation: ripple 1.8s ease-out infinite; }
                .mic-active { animation: pulse-ring 1.5s ease-in-out infinite; }
                .wave-bar { display: inline-block; width: 4px; border-radius: 3px; background: #28666E; margin: 0 1.5px; animation: waveBar 0.8s ease-in-out infinite; }
                .wave-bar:nth-child(2) { animation-delay: 0.1s; }
                .wave-bar:nth-child(3) { animation-delay: 0.2s; }
                .wave-bar:nth-child(4) { animation-delay: 0.3s; }
                .wave-bar:nth-child(5) { animation-delay: 0.15s; }
                .star-btn { cursor:pointer; transition: color 0.15s; }
                .star-btn:hover, .star-btn.active { color: #f59e0b; }
                .thin-scroll::-webkit-scrollbar { width: 4px; }
                .thin-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                input[type=range] { accent-color: #28666E; }
            `}</style>
            
            {/* HEADER */}
            <header style={{ height: 64, borderBottom: '1px solid #e5e7eb', background: '#fff', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button onClick={() => navigate('/?tab=candidates')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ca3af', fontSize: 14, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                        Candidates
                    </button>
                    <div style={{ width: 1, height: 16, background: '#e5e7eb' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, background: '#28666E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', borderRadius: 4, fontSize: 12 }}>H</div>
                        <span style={{ fontSize: 16, fontFamily: 'var(--font-h, Outfit)', fontWeight: 600, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>HIRIS <span style={{ color: '#9ca3af', fontWeight: 300, textTransform: 'none', fontSize: 14 }}>| Interview Room</span></span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right', display: 'none', '@media(min-width: 640px)': { display: 'block' } }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', margin: 0 }}>{candidate.name}</p>
                        <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>{candidate.role} · Stage 2: Technical Assessment</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f3f4f6', padding: '6px 12px', borderRadius: 8 }}>
                        {isRecording && !isPaused && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>}
                        <span style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 600, color: '#1E293B' }}>{formatTime(seconds)}</span>
                    </div>
                    <img src="https://ui-avatars.com/api/?name=Smriti+Kinra&background=28666E&color=fff" style={{ height: 32, width: 32, borderRadius: '50%' }} alt="CHRO"/>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            {phase === 'interview' ? (
                <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
                    {/* LEFT: Voice + Transcript */}
                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', background: '#fff' }}>
                        
                        <div style={{ borderBottom: '1px solid #f3f4f6', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className="material-symbols-outlined text-hiris-teal" style={{ fontSize: 16, color: '#28666E' }}>policy</span>
                                <p style={{ fontSize: 12, fontWeight: 600, color: '#4b5563', margin: 0 }}>Active Rubric: <span style={{ color: '#28666E' }}>Faculty Policy v3</span></p>
                                <span style={{ color: '#d1d5db', margin: '0 4px' }}>·</span>
                                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Stage: Technical Assessment</p>
                            </div>
                            <button onClick={() => setShowRubricModal(true)} style={{ fontSize: 10, fontWeight: 600, color: '#28666E', background: 'none', border: 'none', cursor: 'pointer' }}>View Rubric</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', borderBottom: '1px solid #f3f4f6', background: '#fff' }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24, margin: '0 0 24px' }}>
                                {!isRecording ? 'Ready to Record' : isPaused ? 'Paused' : 'Recording…'}
                            </p>

                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 112, height: 112, marginBottom: 24 }}>
                                {isRecording && !isPaused && (
                                    <>
                                        <div className="ripple-ring" style={{ width: 112, height: 112, animationDelay: '0s' }}></div>
                                        <div className="ripple-ring" style={{ width: 112, height: 112, animationDelay: '0.6s' }}></div>
                                        <div className="ripple-ring" style={{ width: 112, height: 112, animationDelay: '1.2s' }}></div>
                                    </>
                                )}
                                <button onClick={handleToggleRecording}
                                    style={{
                                        position: 'relative', zIndex: 10, width: 80, height: 80, borderRadius: '50%',
                                        background: isRecording ? '#ef4444' : '#28666E', color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        border: 'none', cursor: 'pointer', transition: 'all .2s'
                                    }}
                                    className={isRecording && !isPaused ? 'mic-active' : ''}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 32 }}>{isRecording ? 'stop' : 'mic'}</span>
                                </button>
                            </div>

                            <div style={{ display: isRecording && !isPaused ? 'flex' : 'none', alignItems: 'flex-end', height: 24, marginBottom: 12 }}>
                                <div className="wave-bar"></div><div className="wave-bar"></div><div className="wave-bar"></div><div className="wave-bar"></div><div className="wave-bar"></div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                                {isRecording && (
                                    <>
                                        <button onClick={() => setIsPaused(!isPaused)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#6b7280', border: '1px solid #e5e7eb', padding: '6px 12px', borderRadius: 8, background: 'none', cursor: 'pointer' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{isPaused ? 'play_arrow' : 'pause'}</span>
                                            {isPaused ? 'Resume' : 'Pause'}
                                        </button>
                                        <button onClick={handleEndInterview} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#fff', background: '#ef4444', padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>stop_circle</span>
                                            End Interview
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                            <div style={{ padding: '12px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <p style={{ fontSize: 14, fontFamily: 'var(--font-h, Outfit)', fontWeight: 600, margin: 0 }}>Live Transcript</p>
                                    {isRecording && !isPaused && <span style={{ fontSize: 9, fontWeight: 'bold', background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live</span>}
                                </div>
                                <button onClick={copyTranscript} style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>content_copy</span> Copy
                                </button>
                            </div>
                            <div className="thin-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {transcript.length === 0 ? (
                                    <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '16px 0', margin: 0 }}>Click the microphone to begin recording the interview.</p>
                                ) : (
                                    transcript.map((t, i) => {
                                        const isInterviewer = t.speaker === 'Interviewer';
                                        return (
                                            <div key={i} style={{ display: 'flex', gap: 12, flexDirection: isInterviewer ? 'row' : 'row-reverse', animation: 'slideUp 0.3s ease' }}>
                                                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold', color: '#fff', background: isInterviewer ? '#28666E' : '#9ca3af' }}>
                                                    {isInterviewer ? 'I' : 'C'}
                                                </div>
                                                <div style={{ maxWidth: '75%' }}>
                                                    <p style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4, margin: '0 0 4px 0', textAlign: isInterviewer ? 'left' : 'right' }}>{t.speaker} · {formatTime(t.time)}</p>
                                                    <div style={{ borderRadius: 12, padding: '8px 12px', fontSize: 12, lineHeight: 1.6, background: isInterviewer ? 'rgba(40,102,110,0.1)' : '#f3f4f6', color: isInterviewer ? '#1E293B' : '#374151' }}>
                                                        {t.text}
                                                        {t.tag && <span style={{ display: 'inline-block', marginLeft: 6, fontSize: 9, fontWeight: 'bold', color: '#28666E', background: 'rgba(40,102,110,0.1)', padding: '2px 6px', borderRadius: 9999 }}>{t.tag}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={transcriptEndRef} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: AI Assistant */}
                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
                        
                        <div style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 28, height: 28, background: 'rgba(40,102,110,0.1)', color: '#28666E', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>psychology</span>
                                </div>
                                <p style={{ fontSize: 14, fontFamily: 'var(--font-h, Outfit)', fontWeight: 'bold', color: '#28666E', margin: 0 }}>AI Interview Assistant</p>
                            </div>
                            <span style={{ fontSize: 10, background: '#dcfce7', color: '#15803d', fontWeight: 'bold', padding: '2px 8px', borderRadius: 9999, textTransform: 'uppercase' }}>Active</span>
                        </div>

                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>Rubric Coverage</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {RUBRIC_COVERAGE_ITEMS.map((item, idx) => {
                                    const isCov = coveredCriteria.has(item.key);
                                    return (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 16, height: 16, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: isCov ? 'none' : '2px solid #d1d5db', background: isCov ? '#28666E' : 'transparent', flexShrink: 0 }}>
                                                {isCov && <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 10, fontVariationSettings: "'FILL' 1" }}>check</span>}
                                            </div>
                                            <span style={{ fontSize: 12, color: '#4b5563', flex: 1 }}>{item.label} <span style={{ color: '#9ca3af' }}>({item.weight})</span></span>
                                            <span style={{ fontSize: 10, fontWeight: 'bold', color: isCov ? '#16a34a' : '#9ca3af' }}>{isCov ? 'Covered' : 'Not covered'}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="thin-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto', padding: '16px 24px' }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>AI Suggested Follow-ups</p>
                            <div style={{ flex: 1 }}>
                                {suggestions.length === 0 ? (
                                    <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '24px 0', margin: 0 }}>Start the interview to receive real-time follow-up suggestions based on the rubric.</p>
                                ) : (
                                    suggestions.map((s, i) => (
                                        <div key={i} style={{ border: '1px solid rgba(40,102,110,0.3)', background: '#fff', borderRadius: 12, padding: '10px 12px', marginBottom: 8, fontSize: 12, color: '#374151', cursor: 'pointer', animation: 'slideUp 0.3s ease', transition: 'all 0.15s' }} onClick={(e) => { e.currentTarget.style.opacity = '0.4' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                <span className="material-symbols-outlined" style={{ color: '#28666E', fontSize: 14, flexShrink: 0, marginTop: 2 }}>lightbulb</span>
                                                <div>
                                                    <p style={{ margin: '0 0 4px 0', lineHeight: 1.4 }}>{s.text}</p>
                                                    <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 'bold', background: 'rgba(40,102,110,0.1)', color: '#28666E', padding: '2px 6px', borderRadius: 9999 }}>{s.criterion}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16, marginTop: 8 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Quick Notes</p>
                                <textarea rows="4" placeholder="Add your personal notes here during the interview…" value={interviewNotes} onChange={e => setInterviewNotes(e.target.value)}
                                    style={{ width: '100%', borderRadius: 8, border: '1px solid #e5e7eb', padding: '10px 12px', fontSize: 12, resize: 'none', background: '#fff', outline: 'none' }}></textarea>
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                /* REVIEW PHASE */
                <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                        <div>
                            <h2 style={{ fontSize: 18, fontFamily: 'var(--font-h, Outfit)', fontWeight: 'bold', margin: '0 0 2px 0', color: '#1E293B' }}>Post-Interview Review — <span style={{ color: '#28666E' }}>{candidate.name}</span></h2>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Technical Assessment · {candidate.role} · Duration: {finalDuration}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={downloadTranscript} style={{ fontSize: 14, fontWeight: 600, color: '#4b5563', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span> Download Transcript
                            </button>
                            <button onClick={() => handleDecision('reject')} style={{ fontSize: 14, fontWeight: 600, color: '#b91c1c', background: '#fef2f2', padding: '8px 16px', borderRadius: 8, border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#b91c1c' }}>close</span> Reject Candidate
                            </button>
                            <button onClick={() => handleDecision('proceed')} style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: '#16a34a', padding: '8px 16px', borderRadius: 8, border: 'none', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span> Proceed Candidate
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                        
                        {/* COL 1: AI Rating & Review */}
                        <div className="thin-scroll" style={{ width: '33.333%', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', background: 'rgba(40,102,110,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="material-symbols-outlined" style={{ color: '#28666E', fontSize: 18 }}>psychology</span>
                                    <p style={{ fontSize: 14, fontFamily: 'var(--font-h, Outfit)', fontWeight: 'bold', color: '#28666E', margin: 0 }}>AI Assessment</p>
                                </div>
                                <p style={{ fontSize: 10, color: '#6b7280', margin: '2px 0 0 0' }}>Auto-generated from transcript analysis</p>
                            </div>

                            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.4s ease' }}>
                                <div style={{ textAlign: 'center', background: 'rgba(40,102,110,0.05)', borderRadius: 12, padding: 16, border: '1px solid rgba(40,102,110,0.2)' }}>
                                    <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px 0' }}>Overall AI Score</p>
                                    <p style={{ fontSize: 36, fontFamily: 'var(--font-h, Outfit)', fontWeight: 'bold', color: '#28666E', margin: 0 }}>3.8<span style={{ fontSize: 18, color: '#9ca3af', fontWeight: 'normal' }}>/5</span></p>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
                                        {[1,2,3,4].map(n => <span key={n} className="material-symbols-outlined" style={{ color: '#fbbf24', fontSize: 18, fontVariationSettings: "'FILL' 1" }}>star</span>)}
                                        <span className="material-symbols-outlined" style={{ color: '#d1d5db', fontSize: 18 }}>star</span>
                                    </div>
                                    <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 8, margin: '8px 0 0 0' }}>Recommended: <strong style={{ color: '#16a34a' }}>Proceed to Next Stage</strong></p>
                                </div>

                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>Criterion Scores</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {[
                                            { k: 'Academic Qualifications', s: 4.2 },
                                            { k: 'Research Output', s: 4.0 },
                                            { k: 'Teaching Demo', s: 3.2, warn: true },
                                            { k: 'Communication Skills', s: 4.1 },
                                            { k: 'Culture Fit', s: 3.9 }
                                        ].map(c => (
                                            <div key={c.k}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ fontWeight: 500, color: '#374151' }}>{c.k}</span><span style={{ fontWeight: 'bold', color: c.warn ? '#f59e0b' : '#28666E' }}>{c.s}/5</span></div>
                                                <div style={{ height: 8, background: '#f3f4f6', borderRadius: 9999, overflow: 'hidden' }}><div style={{ height: '100%', background: c.warn ? '#fbbf24' : '#28666E', width: `${(c.s/5)*100}%` }}></div></div>
                                                <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0 0' }}>{c.warn ? 'Limited undergrad teaching evidence' : 'Meets criteria'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>AI Summary</p>
                                    <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, fontSize: 12, color: '#4b5563', lineHeight: 1.6 }}>
                                        Dr. Roy demonstrates strong academic credentials and solid research output. Her communication was confident and structured. The primary gap identified is in teaching experience — she mentioned limited formal classroom exposure. The AI flags this as the key area to probe in the next stage.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COL 2: CHRO Target Assessment */}
                        <div className="thin-scroll" style={{ width: '33.333%', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#fff' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb', position: 'sticky', top: 0, zIndex: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="material-symbols-outlined" style={{ color: '#1E293B', fontSize: 18 }}>edit_note</span>
                                    <p style={{ fontSize: 14, fontFamily: 'var(--font-h, Outfit)', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>Your Assessment</p>
                                </div>
                                <p style={{ fontSize: 10, color: '#6b7280', margin: '2px 0 0 0' }}>Smriti Kinra · CHRO</p>
                            </div>

                            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ textAlign: 'center', background: '#f9fafb', borderRadius: 12, padding: 16, border: '1px solid #e5e7eb' }}>
                                    <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 8px 0' }}>Your Overall Score</p>
                                    <p style={{ fontSize: 36, fontFamily: 'var(--font-h, Outfit)', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>{manualOverall > 0 ? `${manualOverall}.0/5` : '—'}</p>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
                                        {[1,2,3,4,5].map(n => (
                                            <span key={n} onClick={() => setManualOverall(n)}
                                                className="star-btn material-symbols-outlined"
                                                style={{ fontSize: 22, color: n <= manualOverall ? '#fbbf24' : '#d1d5db', fontVariationSettings: n <= manualOverall ? "'FILL' 1" : "'FILL' 0" }}
                                            >star</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>Rate Each Criterion</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {Object.keys(CRITERIA_WEIGHTS).map(k => (
                                            <div key={k}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                                                    <span style={{ color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 13, color: '#28666E' }}>psychology</span> {k} <span style={{ color: '#9ca3af' }}>({CRITERIA_WEIGHTS[k]*100}%)</span></span>
                                                    <span style={{ fontWeight: 'bold', color: '#28666E' }}>{manualScores[k].toFixed(1)}/5</span>
                                                </div>
                                                <input type="range" min="1" max="5" step="0.5" value={manualScores[k]} onChange={e => setManualScores({...manualScores, [k]: parseFloat(e.target.value)})} style={{ width: '100%' }} />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#d1d5db', marginTop: 2 }}><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Your Recommendation</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                                        {[
                                            {id:'proceed', l:'✓ Proceed', activeClasses:'border-green-500 bg-green-50 text-green-700'},
                                            {id:'hold',    l:'⏸ Hold',    activeClasses:'border-amber-400 bg-amber-50 text-amber-700'},
                                            {id:'reject',  l:'✗ Reject',  activeClasses:'border-red-400 bg-red-50 text-red-600'}
                                        ].map(r => (
                                            <button key={r.id} onClick={() => setRecommendation(r.id)}
                                                className={`text-xs font-semibold py-2 rounded-lg border transition ${recommendation === r.id ? r.activeClasses : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {r.l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>Written Feedback</p>
                                    <textarea rows="5" placeholder="Share your observations, concerns, and overall impression…" value={manualFeedback} onChange={e => setManualFeedback(e.target.value)}
                                        style={{ width: '100%', borderRadius: 8, border: '1px solid #e5e7eb', padding: '10px 12px', fontSize: 12, resize: 'none', background: '#fff', outline: 'none' }}></textarea>
                                </div>
                            </div>
                        </div>

                        {/* COL 3: Weighted Result */}
                        <div className="thin-scroll" style={{ width: '33.333%', display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#F8FAFC' }}>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="material-symbols-outlined" style={{ color: '#28666E', fontSize: 18 }}>balance</span>
                                    <p style={{ fontSize: 14, fontFamily: 'var(--font-h, Outfit)', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>Weighted Result</p>
                                </div>
                                <p style={{ fontSize: 10, color: '#6b7280', margin: '2px 0 0 0' }}>AI weight: {aiWeightPct}% · CHRO weight: {100-aiWeightPct}%</p>
                            </div>

                            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px 0' }}>Composite Score</p>
                                    <p style={{ fontSize: 48, fontFamily: 'var(--font-h, Outfit)', fontWeight: 'bold', color: '#28666E', margin: 0 }}>{overallComposite.toFixed(2)}</p>
                                    <p style={{ fontSize: 14, color: '#9ca3af', margin: '4px 0 0 0' }}>/5.0</p>
                                    <div style={{ marginTop: 12 }}>
                                        <span className={verdictClass} style={{ fontSize: 12, fontWeight: 'bold', padding: '4px 12px', borderRadius: 9999 }}>{verdictText}</span>
                                    </div>
                                    <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 12, margin: '12px 0 0 0' }}>Updates as you rate</p>
                                </div>

                                <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 12, padding: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>Adjust Weights</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                                                <span style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 13, color: '#28666E' }}>psychology</span> AI Weight</span>
                                                <span style={{ fontWeight: 'bold', color: '#28666E' }}>{aiWeightPct}%</span>
                                            </div>
                                            <input type="range" min="0" max="100" value={aiWeightPct} onChange={e => setAiWeightPct(parseInt(e.target.value))} style={{ width: '100%' }} />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                                                <span style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 13, color: '#1E293B' }}>edit_note</span> CHRO Weight</span>
                                                <span style={{ fontWeight: 'bold', color: '#1E293B' }}>{100-aiWeightPct}%</span>
                                            </div>
                                            <div style={{ height: 8, background: '#f3f4f6', borderRadius: 9999, overflow: 'hidden' }}><div style={{ height: '100%', background: 'rgba(30,41,59,0.4)', transition: 'all 0.2s', width: `${100-aiWeightPct}%` }}></div></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 12, padding: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>Criterion Composite</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {Object.keys(AI_SCORES).map(k => {
                                            const aiS = AI_SCORES[k];
                                            const manS = manualScores[k] || 0;
                                            const comp = manS > 0 ? (aiS * wPct + manS * (1 - wPct)) : aiS;
                                            return (
                                                <div key={k}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                                                        <span style={{ color: '#4b5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{k}</span>
                                                        <span style={{ fontWeight: 'bold', color: '#28666E', flexShrink: 0, marginLeft: 4 }}>{comp.toFixed(1)}</span>
                                                    </div>
                                                    <div style={{ height: 6, background: '#f3f4f6', borderRadius: 9999, overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', background: 'linear-gradient(to right, #28666E, #2dd4bf)', width: `${(comp/5)*100}%` }}></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Rubric Preview Modal */}
            {showRubricModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', padding: 16 }}>
                    <div style={{ width: '100%', maxWidth: 512, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', borderBottom: '1px solid #f3f4f6', padding: '16px 20px' }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 2px 0' }}>Faculty Policy v3 — Rubric</h4>
                                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Active rubric for this interview stage</p>
                            </div>
                            <button onClick={() => setShowRubricModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div style={{ padding: 20 }}>
                            <div style={{ background: 'rgba(40,102,110,0.05)', borderRadius: 8, padding: 12, fontSize: 12, color: '#28666E', fontWeight: 500, marginBottom: 16 }}>Minimum qualifying score: 3.5 / 5.0 weighted average</div>
                            <table style={{ width: '100%', fontSize: 12, textAlign: 'left', borderCollapse: 'collapse', marginBottom: 16 }}>
                                <thead><tr style={{ color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #f3f4f6' }}><th style={{ paddingBottom: 8 }}>Criterion</th><th style={{ textAlign: 'center', paddingBottom: 8 }}>Weight</th><th style={{ textAlign: 'center', paddingBottom: 8 }}>Scorer</th></tr></thead>
                                <tbody>
                                    {[
                                        { c: 'Academic Qualifications', w: '25%', s: 'HR + Dept Head' },
                                        { c: 'Research Output', w: '30%', s: 'Dept Head' },
                                        { c: 'Teaching Demo', w: '20%', s: 'Panel' },
                                        { c: 'Communication Skills', w: '15%', s: 'HR' },
                                        { c: 'Culture & Values Fit', w: '10%', s: 'HR' }
                                    ].map(r => (
                                        <tr key={r.c} style={{ borderBottom: '1px solid #f9fafb' }}>
                                            <td style={{ padding: '10px 0', fontWeight: 500 }}>{r.c}</td>
                                            <td style={{ textAlign: 'center', color: '#28666E', fontWeight: 'bold' }}>{r.w}</td>
                                            <td style={{ textAlign: 'center', color: '#6b7280' }}>{r.s}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, margin: '0 0 8px 0' }}>Scoring Scale</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                                    {[
                                        { s: 1, l: 'Does Not Meet', bg: '#fef2f2', c: '#dc2626' },
                                        { s: 2, l: 'Partial', bg: '#fff7ed', c: '#f97316' },
                                        { s: 3, l: 'Meets', bg: '#fefce8', c: '#ca8a04' },
                                        { s: 4, l: 'Exceeds', bg: '#f0fdfa', c: '#0d9488' },
                                        { s: 5, l: 'Exceptional', bg: '#f0fdf4', c: '#16a34a' }
                                    ].map(x => (
                                        <div key={x.s} style={{ textAlign: 'center', padding: 8, background: x.bg, borderRadius: 8 }}>
                                            <p style={{ fontSize: 10, fontWeight: 'bold', color: x.c, margin: '0 0 2px 0' }}>{x.s}</p>
                                            <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>{x.l}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Confirmation Modal */}
            {showSubmitModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', padding: 16 }}>
                    <div style={{ width: '100%', maxWidth: 384, background: '#fff', borderRadius: 16, padding: 24, textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', background: recommendation === 'reject' ? '#fee2e2' : '#dcfce7' }}>
                            <span className="material-symbols-outlined" style={{ color: recommendation === 'reject' ? '#b91c1c' : '#16a34a', fontSize: 28 }}>{recommendation === 'reject' ? 'cancel' : 'check_circle'}</span>
                        </div>
                        <h4 style={{ fontSize: 18, fontFamily: 'var(--font-h, Outfit)', fontWeight: 'bold', margin: '0 0 4px 0' }}>{recommendation === 'reject' ? 'Candidate Rejected' : 'Candidate Proceeding'}</h4>
                        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, margin: '0 0 20px 0' }}>
                            {recommendation === 'reject'
                                ? `${candidate.name} has been rejected and the status will be updated.`
                                : `${candidate.name} will proceed to the next stage of the interview pipeline.`}
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setShowSubmitModal(false)} style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#4b5563', border: '1px solid #e5e7eb', padding: '8px 0', borderRadius: 8, background: '#fff', cursor: 'pointer' }}>Stay</button>
                            <button onClick={() => navigate('/chro')} style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#fff', background: '#28666E', padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Back to Overview</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
