
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  CircleStop,
  FileText,
  Lightbulb,
  Mic,
  MicOff,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Video,
  VideoOff,
} from "lucide-react";

import { interviewQuestions } from "../../data/questions";
import { supabase } from "../../lib/supabase";

type Question = {
  id: number;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  hint: string;
};

type Answer = {
  questionId: number;
  question: string;
  answer: string;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

export default function InterviewPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);

  const [interviewMode, setInterviewMode] = useState("text");
  const [assessmentType, setAssessmentType] = useState("initial");

  const [cameraStarted, setCameraStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  const finalTranscriptRef = useRef("");

  // Check user authentication
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  // Check browser speech recognition support
  useEffect(() => {
    const browserWindow = window as any;

    const SpeechRecognition =
      browserWindow.SpeechRecognition ||
      browserWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Select random questions
  const getRandomQuestions = () => {
    const shuffled = [...interviewQuestions].sort(
      () => Math.random() - 0.5
    );

    return shuffled.slice(0, 10);
  };

  // Load interview mode and questions
  useEffect(() => {
    const savedMode =
      sessionStorage.getItem("interviewMode") || "text";

    const savedAssessmentType =
      sessionStorage.getItem("assessmentType") || "initial";

    setInterviewMode(savedMode);
    setAssessmentType(savedAssessmentType);
    setQuestions(getRandomQuestions());
  }, []);

  // Stop speech recognition
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setIsListening(false);
  };

  // Cleanup resources when leaving the page
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }
    };
  }, []);

  // Start speech recognition
  const startSpeechRecognition = () => {
    const browserWindow = window as any;

    const SpeechRecognition: SpeechRecognitionConstructor =
      browserWindow.SpeechRecognition ||
      browserWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    if (isListening) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setAnswer(
        finalTranscriptRef.current + interimTranscript
      );
    };

    recognition.onerror = (event: any) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Unable to start speech recognition:",
        error
      );

      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraStarted(true);
    } catch (error) {
      console.error("Camera access error:", error);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setCameraStarted(false);
  };

  // Start video recording
  const startRecording = () => {
    const stream = streamRef.current;

    if (!stream) {
      console.error("Camera is not started.");
      return;
    }

    recordedChunksRef.current = [];

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
      videoBitsPerSecond: 1200000,
      audioBitsPerSecond: 64000,
    });

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onstart = () => {
      setIsRecording(true);
    };

    recorder.onstop = () => {
      setIsRecording(false);

      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });

      const videoUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = videoUrl;
      link.download = "ai-interview-recording.webm";
      link.click();

      URL.revokeObjectURL(videoUrl);
    };

    recorder.start();
  };

  // Stop video recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  // Save current answer
  const saveCurrentAnswer = () => {
    if (!questions[currentIndex]) {
      return;
    }

    const currentQuestion = questions[currentIndex];

    const updatedAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer: answer.trim(),
      },
    ];

    setAnswers(updatedAnswers);

    return updatedAnswers;
  };

  // Move to next question
  const handleNext = () => {
    stopSpeechRecognition();

    finalTranscriptRef.current = "";

    const updatedAnswers = saveCurrentAnswer();

    if (!updatedAnswers) {
      return;
    }

    setAnswer("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      sessionStorage.setItem(
        "interviewAnswers",
        JSON.stringify(updatedAnswers)
      );

      sessionStorage.setItem(
        "assessmentType",
        assessmentType
      );

      router.push("/results");
    }
  };

  // Loading screen
  if (questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f9f8] px-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e1f2ee] text-[#2b887d]">
            <Sparkles size={30} strokeWidth={1.8} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#183b4d]">
            Preparing your interview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your personalized questions are being prepared.
          </p>

          <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-[#2b887d]" />
          </div>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  const progressPercentage = Math.round(
    ((currentIndex + 1) / questions.length) * 100
  );

  const isLastQuestion =
    currentIndex === questions.length - 1;

  const modeLabel =
    interviewMode.charAt(0).toUpperCase() +
    interviewMode.slice(1);

  const assessmentLabel =
    assessmentType === "reassessment"
      ? "Reassessment"
      : "Initial Assessment";

  return (
    <main className="min-h-screen bg-[#f6f9f8] px-4 py-5 text-[#183b4d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Top navigation */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/assessment")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#2b887d] hover:text-[#2b887d]"
          >
            <ArrowLeft size={17} />
            Back to Setup
          </button>

          <div className="flex items-center gap-2 text-sm font-semibold text-[#2b887d]">
            <ShieldCheck size={17} />
            Secure Interview Session
          </div>
        </header>

        {/* Page heading */}
        <section className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e1f2ee] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                <Sparkles size={14} />
                AI Interview Analyzer
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#183b4d] sm:text-4xl">
                AI Interview
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Answer each question carefully. Your responses
                will be used to generate personalized feedback.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1f2ee] text-[#2b887d]">
                  {interviewMode === "text" && (
                    <FileText size={20} />
                  )}

                  {interviewMode === "voice" && (
                    <Mic size={20} />
                  )}

                  {interviewMode === "video" && (
                    <Video size={20} />
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Interview Mode
                  </p>

                  <p className="text-sm font-bold text-[#183b4d]">
                    {modeLabel}
                  </p>
                </div>
              </div>

              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-400">
                  Assessment
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {assessmentLabel}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress section */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                Your Progress
              </p>

              <p className="mt-1 text-sm font-semibold text-[#183b4d]">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-[#2b887d]">
                {progressPercentage}%
              </p>

              <p className="text-xs text-slate-400">
                Completed
              </p>
            </div>
          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#2b887d] transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {questions.map((question, index) => (
              <div
                key={`${question.id}-${index}`}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                  index < currentIndex
                    ? "bg-[#2b887d] text-white"
                    : index === currentIndex
                      ? "border-2 border-[#2b887d] bg-[#e1f2ee] text-[#2b887d]"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {index < currentIndex ? (
                  <CheckCircle2 size={15} />
                ) : (
                  index + 1
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Main question card */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Question header */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-[#f0f8f5] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#e1f2ee] px-3 py-1.5 text-xs font-bold text-[#2b887d]">
                  {currentQuestion.category}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-500">
                  {currentQuestion.difficulty}
                </span>
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {currentQuestion.type}
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-bold leading-relaxed text-[#183b4d] sm:text-3xl">
              {currentQuestion.question}
            </h2>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#d9eee8] bg-[#f2faf7] p-4">
              <div className="mt-0.5 text-[#2b887d]">
                <Lightbulb size={19} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#2b887d]">
                  Helpful Hint
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {currentQuestion.hint}
                </p>
              </div>
            </div>
          </div>

          {/* Answer section */}
          <div className="p-6 sm:p-8">

            {/* TEXT MODE */}
            {interviewMode === "text" && (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label
                    htmlFor="text-answer"
                    className="text-sm font-bold text-[#183b4d]"
                  >
                    Your Answer
                  </label>

                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                    <FileText size={14} />
                    Written Response
                  </span>
                </div>

                <textarea
                  id="text-answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write your answer here. Explain your thoughts clearly and include examples where appropriate..."
                  className="min-h-[240px] w-full resize-y rounded-2xl border border-slate-200 bg-[#fbfcfc] p-5 text-sm leading-7 text-[#183b4d] outline-none transition placeholder:text-slate-400 focus:border-[#2b887d] focus:bg-white focus:ring-4 focus:ring-[#2b887d]/10"
                />

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Take your time to provide a clear answer.</span>
                  <span>{answer.length} characters</span>
                </div>
              </div>
            )}

            {/* VOICE MODE */}
            {interviewMode === "voice" && (
              <div className="rounded-2xl border border-[#d9eee8] bg-[#f5faf8] p-5 sm:p-7">

                <div className="flex flex-col items-center text-center">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full transition ${
                      isListening
                        ? "bg-red-100 text-red-500 ring-8 ring-red-50"
                        : "bg-[#e1f2ee] text-[#2b887d]"
                    }`}
                  >
                    {isListening ? (
                      <Mic size={34} />
                    ) : (
                      <MicOff size={34} />
                    )}
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-[#183b4d]">
                    Voice Interview
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Speak your answer naturally. Your speech
                    will be converted into text automatically.
                  </p>
                </div>

                {!speechSupported && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm leading-6 text-red-600">
                    Speech recognition is not supported in this
                    browser. Try Google Chrome or Microsoft Edge.
                  </div>
                )}

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {!isListening && speechSupported && (
                    <button
                      type="button"
                      onClick={startSpeechRecognition}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2b887d] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#236f66]"
                    >
                      <Mic size={18} />
                      Start Speaking
                    </button>
                  )}

                  {isListening && (
                    <button
                      type="button"
                      onClick={stopSpeechRecognition}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3 font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      <CircleStop size={18} />
                      Stop Speaking
                    </button>
                  )}
                </div>

                {isListening && (
                  <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-red-500">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    Listening... Speak clearly.
                  </div>
                )}

                <label
                  htmlFor="voice-answer"
                  className="mt-7 block text-sm font-bold text-[#183b4d]"
                >
                  Speech Transcription
                </label>

                <textarea
                  id="voice-answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Your speech transcription will appear here..."
                  className="mt-3 min-h-[220px] w-full resize-y rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-[#183b4d] outline-none transition placeholder:text-slate-400 focus:border-[#2b887d] focus:ring-4 focus:ring-[#2b887d]/10"
                />

                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck size={14} />
                  Language: English (India)
                </div>
              </div>
            )}

            {/* VIDEO MODE */}
            {interviewMode === "video" && (
              <div className="rounded-2xl border border-[#d9eee8] bg-[#f5faf8] p-5 sm:p-7">

                <div className="flex flex-col items-center text-center">
                  {!cameraStarted && (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e1f2ee] text-[#2b887d]">
                      <Video size={34} />
                    </div>
                  )}

                  {cameraStarted && (
                    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 p-2 shadow-sm">
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="mx-auto max-h-[460px] w-full rounded-xl object-contain"
                      />
                    </div>
                  )}

                  <h3 className="mt-5 text-xl font-bold text-[#183b4d]">
                    Video Interview
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Use your camera to practice your presentation
                    and communication skills.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {!cameraStarted && (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2b887d] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#236f66]"
                    >
                      <Camera size={18} />
                      Start Video Interview
                    </button>
                  )}

                  {cameraStarted && !isRecording && (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      <VideoOff size={18} />
                      Stop Camera
                    </button>
                  )}

                  {cameraStarted && !isRecording && (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
                    >
                      <Radio size={18} />
                      Start Recording
                    </button>
                  )}

                  {isRecording && (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3 font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      <CircleStop size={18} />
                      Stop Recording
                    </button>
                  )}
                </div>

                {isRecording && (
                  <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-red-500">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    Recording in progress...
                  </div>
                )}

                <label
                  htmlFor="video-answer"
                  className="mt-7 block text-sm font-bold text-[#183b4d]"
                >
                  Your Answer or Summary
                </label>

                <textarea
                  id="video-answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type a summary or answer for this question..."
                  className="mt-3 min-h-[190px] w-full resize-y rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-[#183b4d] outline-none transition placeholder:text-slate-400 focus:border-[#2b887d] focus:ring-4 focus:ring-[#2b887d]/10"
                />
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex flex-col-reverse gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={15} />
                Your response is saved for evaluation.
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#2b887d] px-7 py-3.5 font-bold text-white shadow-sm transition hover:bg-[#236f66] focus:outline-none focus:ring-4 focus:ring-[#2b887d]/20"
              >
                {isLastQuestion
                  ? "Finish Interview"
                  : "Next Question"}

                {isLastQuestion ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Bottom information */}
        <footer className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pb-4 text-center text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Secure session
          </span>

          <span>•</span>

          <span>AI-powered interview practice</span>

          <span>•</span>

          <span>Answer honestly and clearly</span>
        </footer>
      </div>
    </main>
  );
}