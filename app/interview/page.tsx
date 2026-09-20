"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function InterviewPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");

  const [answers, setAnswers] = useState<Answer[]>([]);

  const [interviewMode, setInterviewMode] = useState("text");
  const [assessmentType, setAssessmentType] = useState("initial");


  const [cameraStarted, setCameraStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const recordedChunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
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

    setInterviewMode(savedMode);

    setQuestions(getRandomQuestions());
  }, []);

  // Cleanup camera when leaving page
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }
    };
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      // Stop existing stream first
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

  // Start recording
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

  // Stop recording
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
        answer: answer,
      },
    ];

    setAnswers(updatedAnswers);

    return updatedAnswers;
  };

  // Move to next question
  const handleNext = () => {
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

      router.push("/results");
    }
  };

  if (questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-gray-400">
          Preparing your interview...
        </p>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-cyan-400">
            AI INTERVIEW ANALYZER
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            AI Interview
          </h1>

          <p className="mt-2 text-sm text-cyan-400">
            Mode: {interviewMode.toUpperCase()}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </span>

            <span className="text-gray-500">
              {Math.round(
                ((currentIndex + 1) / questions.length) * 100
              )}
              %
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-900">
            <div
              className="h-full bg-cyan-400 transition-all"
              style={{
                width: `${((currentIndex + 1) /
                  questions.length) *
                  100
                  }%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <section className="rounded-2xl border border-gray-800 bg-gray-950 p-7">

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-400">
              {currentQuestion.category}
            </span>

            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs text-gray-400">
              {currentQuestion.difficulty}
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-semibold leading-relaxed">
            {currentQuestion.question}
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            Hint: {currentQuestion.hint}
          </p>

          {/* TEXT MODE */}
          {interviewMode === "text" && (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="mt-6 min-h-[220px] w-full resize-none rounded-xl border border-white/10 bg-black/50 p-5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400/50"
            />
          )}

          {/* VOICE MODE */}
          {interviewMode === "voice" && (
            <div className="mt-6 rounded-xl border border-cyan-400/20 bg-black/50 p-8 text-center">

              <div className="text-5xl">
                🎤
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                Voice Interview
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Voice recording will be available here.
              </p>

              <button
                type="button"
                className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
              >
                Start Recording
              </button>

            </div>
          )}

          {/* VIDEO MODE */}
          {interviewMode === "video" && (
            <div className="mt-6 rounded-xl border border-cyan-400/20 bg-black/50 p-8 text-center">

              {cameraStarted && (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="mx-auto mt-2 w-full max-w-2xl rounded-xl border border-cyan-400/20"
                />
              )}

              {!cameraStarted && (
                <div className="text-5xl">
                  🎥
                </div>
              )}

              <h3 className="mt-4 text-xl font-semibold">
                Video Interview
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Record your interview and analyze your
                presentation skills.
              </p>

              {/* Start Camera */}
              {!cameraStarted && (
                <button
                  type="button"
                  onClick={startCamera}
                  className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
                >
                  Start Video Interview
                </button>
              )}

              {/* Stop Camera */}
              {cameraStarted && !isRecording && (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="mt-6 rounded-xl border border-red-500/40 px-6 py-3 font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  Stop Camera
                </button>
              )}

              {/* Start Recording */}
              {cameraStarted && !isRecording && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="ml-3 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-400"
                >
                  ⏺ Start Recording
                </button>
              )}

              {/* Stop Recording */}
              {isRecording && (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="mt-6 rounded-xl border border-red-500 px-6 py-3 font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  ⏹ Stop Recording
                </button>
              )}

              {isRecording && (
                <p className="mt-4 text-sm text-red-400">
                  ● Recording in progress...
                </p>
              )}

            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">

            <span className="text-sm text-gray-500">
              {currentQuestion.type}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl bg-white px-7 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              {currentIndex === questions.length - 1
                ? "Finish Interview"
                : "Next Question →"}
            </button>

          </div>

        </section>

      </div>
    </main>
  );
}