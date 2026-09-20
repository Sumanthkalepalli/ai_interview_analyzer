import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(request: Request) {
  try {
    const { answers } = await request.json();

    if (!answers || answers.length === 0) {
      return Response.json(
        {
          success: false,
          error: "No interview answers provided",
        },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
    });

    const interviewText = answers
      .map(
        (
          item: {
            question: string;
            answer: string;
          },
          index: number
        ) => `
Question ${index + 1}:
${item.question}

Candidate Answer:
${item.answer}
`
      )
      .join("\n");

    const prompt = `
You are an AI Interview Analyzer evaluating a student's complete interview.

Analyze ALL of the following interview answers together.

${interviewText}

Evaluate the candidate across the complete interview.

Return ONLY valid JSON.
Do not include markdown.
Do not include code fences.
Do not add any text before or after the JSON.

Use exactly this structure:

{
  "technicalScore": 0,
  "communicationScore": 0,
  "problemSolvingScore": 0,
  "answerStructureScore": 0,
  "overallScore": 0,
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],
  "weaknesses": [
    "weakness 1",
    "weakness 2",
    "weakness 3"
  ],
  "questionFeedback": [
    {
      "questionNumber": 1,
      "feedback": "Short feedback"
    }
  ],
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ],
  "improvementPlan": {
    "day1": "Day 1 improvement activities",
    "day2": "Day 2 improvement activities",
    "day3": "Day 3 improvement activities"
  }
}

Rules:

- All scores must be numbers from 0 to 100.
- overallScore should represent the candidate's overall interview performance.
- Evaluate all answers, not just the first answer.
- questionFeedback should contain feedback for every question provided.
- Keep feedback concise and useful for a student.
- Base the evaluation only on the candidate's answers.
`;

    let result;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (error) {
        if (attempt === 3) {
          throw error;
        }

        const delay = attempt * 2000;

        await new Promise((resolve) => {
          setTimeout(resolve, delay);
        });
      }
    }

    if (!result) {
      throw new Error(
        "Gemini evaluation failed after multiple attempts."
      );
    }

    const response = result.response.text();

    return Response.json({
      success: true,
      evaluation: response,
    });
  } catch (error) {
    console.error("Gemini evaluation error:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to evaluate interview answers",
      },
      { status: 500 }
    );
  }
}