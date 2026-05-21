import React, { useState, useEffect } from "react";
import "./hearingtest.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Mic, Headphones, Volume2, Check } from "lucide-react";
import { saveHearingTestResult } from "../utils/hearingTestUtils";

// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const frequencies = [
    125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000,
];
const questions = [
    "Do you often have trouble hearing in noisy places?",
    "Do you frequently ask people to repeat themselves?",
    "Do you experience ringing or buzzing in your ears?",
    "Do you have trouble hearing high-pitched sounds?",
];

// Helper function to make the animation dynamic based on frequency
const getAnimationDuration = (freq) => {
    if (freq <= 250) return "4s";
    if (freq <= 750) return "3s";
    if (freq <= 1500) return "2s";
    if (freq <= 4000) return "1.5s";
    return "1s";
};

const HearingTest = () => {
    const [step, setStep] = useState("details");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentFrequency, setCurrentFrequency] = useState(0);
    const [results, setResults] = useState([]);
    const [summary, setSummary] = useState("");
    const [userPosition, setUserPosition] = useState(null);
    const [audioContext, setAudioContext] = useState(null);
    const [instructionsChecked, setInstructionsChecked] = useState({
        quiet: false,
        headphones: false,
        volume: false,
    });

    const allInstructionsChecked = Object.values(instructionsChecked).every(Boolean);
    const handleCheckboxChange = (name) => {
        setInstructionsChecked((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    useEffect(() => {
        try {
            setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
        } catch (e) {
            console.error("Web Audio API is not supported.", e);
        }
        navigator.geolocation.getCurrentPosition(
            (position) =>
                setUserPosition([position.coords.latitude, position.coords.longitude]),
            (error) => console.error("Location access denied:", error)
        );
    }, []);

    useEffect(() => {
        if (step === "test" && audioContext) {
            playSound(frequencies[currentFrequency]);
        }
    }, [currentFrequency, step, audioContext]);

    const playSound = (freq) => {
        if (!audioContext) return;
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        setTimeout(() => oscillator.stop(), 1000);
    };

    const handleHeard = async (heard) => {
        const newResult = { freq: frequencies[currentFrequency], heard };
        const updatedResults = [...results.filter((r) => r.freq !== newResult.freq), newResult];
        setResults(updatedResults);

        if (currentFrequency < frequencies.length - 1) {
            setCurrentFrequency(currentFrequency + 1);
        } else {
            await calculateSummary(updatedResults);
            setStep("result");
        }
    };

    const calculateSummary = async (data) => {
        const heardCount = data.filter((d) => d.heard).length;
        const score = Math.round((heardCount / frequencies.length) * 100);
        
        let summaryText;
        if (heardCount === frequencies.length) {
            summaryText = "Your hearing appears to be in the excellent range!";
        } else if (heardCount >= frequencies.length * 0.7) {
            summaryText = "Your results show signs of potential mild hearing loss.";
        } else {
            summaryText = "Your results show signs of potential moderate to severe hearing loss.";
        }
        
        setSummary(summaryText);
        
        // Save to Supabase
        const testData = {
            leftEar: data.filter(d => d.heard),
            rightEar: data.filter(d => d.heard),
            overallScore: score,
            testType: 'online_audiometry'
        };
        
        const result = await saveHearingTestResult(testData);
        if (result.success) {
            console.log('Hearing test saved successfully');
        } else {
            console.error('Failed to save hearing test:', result.error);
        }
    };

    const handleConsultClick = () => {
        document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
    };

    const handleStart = () => { if (gender && age) setStep("questions"); };
    const handleAnswer = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setStep("instructions");
        }
    };

    const dummyDoctors = [
        { name: "Dr. Mohan's ENT Speciality Center, T. Nagar", latOffset: 0.008, lngOffset: -0.003 },
        { name: "KKR ENT Hospital, Kilpauk", latOffset: -0.005, lngOffset: 0.006 },
        { name: "Madras ENT Research Foundation, RA Puram", latOffset: 0.002, lngOffset: 0.008 },
    ];

    const renderStep = () => {
        switch (step) {
            case "details":
                return (
                    <div key="details" className="content-wrapper details-wrapper">
                        <div className="details-layout">
                            <div className="details-visual"><h2>Begin Your Journey to Better Hearing.</h2></div>
                            <div className="details-form">
                                <h1>Online Hearing Test</h1>
                                <p className="subtitle">Get a quick baseline of your hearing in just a few minutes. Please fill out the details below to begin.</p>
                                <div className="modern-dropdown-wrapper">
                                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="" disabled>Select Gender</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="modern-dropdown-wrapper">
                                    <select value={age} onChange={(e) => setAge(e.target.value)}>
                                        <option value="" disabled>Select Age Range</option><option value="18-39">18–39</option><option value="40-59">40–59</option><option value="60-79">60–79</option><option value="80+">80+</option>
                                    </select>
                                </div>
                                <button className="action-button" onClick={handleStart}>Start The Test</button>
                            </div>
                        </div>
                    </div>
                );
            case "questions":
                return (
                    <div key="questions" className="content-wrapper">
                        <h1>{questions[currentQuestion]}</h1>
                        <div className="btn-group"><button className="action-button" onClick={() => handleAnswer()}>Yes</button><button className="action-button btn-secondary" onClick={() => handleAnswer()}>No</button></div>
                    </div>
                );
            case "instructions":
                return (
                    <div key="instructions" className="content-wrapper instructions-wrapper-new">
                        <h1>Before you start</h1>
                        <p className="subtitle">For the most accurate results, please confirm the following:</p>
                        <div className="instructions-steps-new">
                            <div className={`instruction-item-new ${instructionsChecked.quiet ? 'checked' : ''}`} onClick={() => handleCheckboxChange('quiet')}>
                                <div className="inst-num-new">1</div>
                                <div className="inst-text-new"><h3>Find somewhere quiet</h3><p>with as little noise as possible</p></div>
                                <div className="inst-checkbox-new"><Check /></div>
                            </div>
                            <div className={`instruction-item-new ${instructionsChecked.headphones ? 'checked' : ''}`} onClick={() => handleCheckboxChange('headphones')}>
                                <div className="inst-num-new">2</div>
                                <div className="inst-text-new"><h3>Use headphones</h3><p>for accurate left & right ear results</p></div>
                                <div className="inst-checkbox-new"><Check /></div>
                            </div>
                            <div className={`instruction-item-new ${instructionsChecked.volume ? 'checked' : ''}`} onClick={() => handleCheckboxChange('volume')}>
                                <div className="inst-num-new">3</div>
                                <div className="inst-text-new"><h3>Set device volume</h3><p>to a comfortable medium level (50%)</p></div>
                                <div className="inst-checkbox-new"><Check /></div>
                            </div>
                        </div>
                        <button className="action-button" disabled={!allInstructionsChecked} onClick={() => setStep('test')}>
                            {allInstructionsChecked ? 'Begin the Test' : 'Please Confirm All Steps'}
                        </button>
                    </div>
                );
            case "test":
                const duration = getAnimationDuration(frequencies[currentFrequency]);
                return (
                    <div key="test" className="content-wrapper">
                        <div className="pulsar-container">
                            <div className="pulsar" style={{ animationDuration: duration }}></div><div className="pulsar-ring" style={{ animationDuration: duration }}></div><div className="pulsar-ring" style={{ animationDuration: duration }}></div><div className="pulsar-ring" style={{ animationDuration: duration }}></div>
                        </div>
                        <h1 style={{ marginTop: "2rem" }}>Can you hear this sound?</h1>
                        <p className="current-frequency-display">Frequency: {frequencies[currentFrequency]} Hz</p>
                        <div className="btn-group">
                            <button className="action-button" onClick={() => handleHeard(true)}>Yes, I hear it</button><button className="action-button btn-secondary" onClick={() => handleHeard(false)}>No</button>
                        </div>
                        <div className="progress-dots-container">
                            {frequencies.map((freq, index) => (
                                <div key={freq} className={`progress-dot ${index < currentFrequency ? "completed" : ""} ${index === currentFrequency ? "active" : ""}`}></div>
                            ))}
                        </div>
                    </div>
                );
            case "result":
                return (
                    <div key="result" className="content-wrapper result-wrapper">
                        <h1>Your Hearing Test Results</h1>
                        <p className="subtitle summary-text">{summary}</p>
                        <div className="audiogram-graph">
                            <div className="audiogram-grid">
                                <div className="y-axis-label" style={{ gridRow: 1 }}>Normal</div><div className="y-axis-label" style={{ gridRow: 2 }}>Mild Loss</div><div className="y-axis-label" style={{ gridRow: 3 }}>Moderate Loss</div>
                                {results.sort((a, b) => a.freq - b.freq).map(({ freq, heard }, index) => (
                                    <div key={freq} className="result-dot" style={{ gridColumn: index + 2, gridRow: heard ? 1 : 2 }}></div>
                                ))}
                            </div>
                            <div className="x-axis-labels">
                                <div className="x-axis-spacer"></div>
                                {frequencies.map((freq) => (<div key={freq} className="x-axis-label">{freq < 1000 ? freq : `${freq / 1000}k`}</div>))}
                            </div>
                            <div className="x-axis-title">Frequency (Hz)</div>
                        </div>
                        <div className="btn-group">
                            <button className="action-button btn-secondary" onClick={() => window.location.reload()}>Retake Test</button>
                            <button className="action-button" onClick={handleConsultClick}>Find a Specialist in Chennai</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="hearing-test-page-container">
            <div className="hearing-fullscreen">{renderStep()}</div>
            <div id="map-section" className="map-container">
                <h2>Find Nearby ENT Specialists in Chennai</h2>
                <p>
                    Based on your location, here are some highly-rated specialists near
                    you for a professional diagnosis.
                </p>
                {userPosition ? (
                    <MapContainer center={userPosition} zoom={14} scrollWheelZoom={true}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                        <Marker position={userPosition}><Popup>Your approximate location</Popup></Marker>
                        {dummyDoctors.map((doc, index) => (
                            <Marker key={index} position={[userPosition[0] + doc.latOffset, userPosition[1] + doc.lngOffset]}>
                                <Popup>{doc.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                ) : (
                    <p>Please allow location access to show nearby specialists.</p>
                )}
            </div>
        </div>
    );
};

export default HearingTest;


