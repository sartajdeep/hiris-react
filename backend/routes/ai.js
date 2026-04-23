const express = require('express')
const { GoogleGenAI } = require('@google/genai')

const router = express.Router()

// Initialize Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
const MODEL = 'gemini-2.0-flash'

// Helper: clean up markdown fences if model wraps response in ```json
function parseJson(text) {
  const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
  return JSON.parse(cleaned)
}

/**
 * @swagger
 * /api/ai/generate-jd:
 *   post:
 *     summary: Generate a job description using AI
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               department:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Generated job description
 */
router.post('/generate-jd', async (req, res) => {
  const { title = 'Faculty Position', department = 'General', skills = [], location = 'On-campus', notes = '' } = req.body

  const prompt = `You are an expert HR writer for a university and research institution. 
Generate a professional, compelling job description for the following role.

Role: ${title}
Department: ${department}
Required Skills: ${skills.join(', ') || 'As appropriate for the role'}
Location: ${location}
Additional Notes from Department: ${notes || 'None'}

Return ONLY a valid JSON object with this exact shape:
{
  "summary": "A 2-3 sentence overview of the role and its significance.",
  "responsibilities": ["responsibility 1", "responsibility 2", "responsibility 3", "responsibility 4", "responsibility 5"],
  "qualifications": ["qualification 1", "qualification 2", "qualification 3", "qualification 4"],
  "benefits": ["benefit 1", "benefit 2", "benefit 3"]
}`

  const result = await ai.models.generateContent({ model: MODEL, contents: prompt })
  const data = parseJson(result.text)
  res.json(data)
})

/**
 * @swagger
 * /api/ai/chat-response:
 *   post:
 *     summary: Generate a dynamic AI pre-screening chat reply for candidates
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleTitle:
 *                 type: string
 *               chatHistory:
 *                 type: array
 *                 description: Array of {speaker, text} objects
 *               questionIndex:
 *                 type: number
 *     responses:
 *       200:
 *         description: The next AI message to send to the candidate
 */
router.post('/chat-response', async (req, res) => {
  const { roleTitle = 'the role', chatHistory = [], questionIndex = 0 } = req.body

  const MAX_QUESTIONS = 3
  const isLastQuestion = questionIndex >= MAX_QUESTIONS - 1

  const historyContext = chatHistory
    .map(m => `${m.speaker === 'assistant' ? 'AI Recruiter' : 'Candidate'}: ${m.text}`)
    .join('\n')

  const prompt = `You are an AI recruiter conducting a friendly, professional pre-screening interview for a "${roleTitle}" position at a university.

Conversation so far:
${historyContext || '(Conversation just started)'}

${isLastQuestion
    ? 'This is the LAST question. Ask a final, thoughtful question about the candidate\'s motivation or long-term goals for this role, then conclude warmly.'
    : `Ask question #${questionIndex + 1}. Keep it concise (1-2 sentences), conversational and relevant to their previous answer if one was given. Ask about skills, experience, or what they hope to achieve.`
  }

Return ONLY a JSON object:
{
  "message": "your question or response here",
  "isComplete": ${isLastQuestion ? 'false' : 'false'}
}

Do NOT end the conversation yet unless this is the last question and the candidate has answered it.`

  const result = await ai.models.generateContent({ model: MODEL, contents: prompt })
  const data = parseJson(result.text)
  res.json(data)
})

/**
 * @swagger
 * /api/ai/complete-chat:
 *   post:
 *     summary: Generate the final completion message for the AI screening chat
 *     tags: [AI]
 */
router.post('/complete-chat', async (req, res) => {
  res.json({
    message: "Thank you! Your answers have been recorded. Please go ahead and submit your application — we'll be in touch soon!",
    isComplete: true
  })
})

/**
 * @swagger
 * /api/ai/interview-suggestion:
 *   post:
 *     summary: Generate a real-time AI follow-up question suggestion during an interview
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transcript:
 *                 type: array
 *                 description: Array of {speaker, text} transcript entries
 *               rubricTraits:
 *                 type: array
 *                 items:
 *                   type: string
 *               candidateName:
 *                 type: string
 *               roleTitle:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI follow-up question suggestion
 */
router.post('/interview-suggestion', async (req, res) => {
  const {
    transcript = [],
    rubricTraits = ['Research Output', 'Teaching Ability', 'Culture Fit'],
    candidateName = 'the candidate',
    roleTitle = 'the role'
  } = req.body

  const recentTranscript = transcript.slice(-6) // Use last 6 exchanges for context
    .map(t => `${t.speaker}: ${t.text}`)
    .join('\n')

  const prompt = `You are an AI interview assistant helping an interviewer evaluate a candidate for "${roleTitle}".

Candidate: ${candidateName}
Evaluation Rubric Traits: ${rubricTraits.join(', ')}

Recent interview transcript:
${recentTranscript || '(Interview just started)'}

Based on what the candidate just said and the rubric traits that may not yet be covered, suggest ONE powerful follow-up question. Be specific and insightful.

Return ONLY a JSON object:
{
  "suggestion": "Your follow-up question here",
  "rubricTrait": "The specific rubric trait this question probes",
  "reason": "One sentence explaining why this question is useful right now"
}`

  const result = await ai.models.generateContent({ model: MODEL, contents: prompt })
  const data = parseJson(result.text)
  res.json(data)
})

/**
 * @swagger
 * /api/ai/candidate-summary:
 *   post:
 *     summary: Generate an AI match score and summary for a candidate profile
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               candidateName:
 *                 type: string
 *               resumeData:
 *                 type: object
 *               jobDescription:
 *                 type: string
 *               roleTitle:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI-generated candidate summary and match score
 */
router.post('/candidate-summary', async (req, res) => {
  const {
    candidateName = 'The candidate',
    resumeData = {},
    jobDescription = '',
    roleTitle = 'the role'
  } = req.body

  const prompt = `You are an expert HR analyst reviewing a candidate for a "${roleTitle}" position.

Candidate Name: ${candidateName}
Candidate Details: ${JSON.stringify(resumeData, null, 2)}
Job Description: ${jobDescription || 'Not provided'}

Generate a concise, professional evaluation of this candidate.

Return ONLY a JSON object:
{
  "matchScore": <number from 0-100>,
  "matchLabel": "<one of: 'Strong Match', 'Good Match', 'Partial Match', 'Weak Match'>",
  "summary": "A 2-3 sentence professional summary of the candidate's fit for the role.",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2"]
}`

  const result = await ai.models.generateContent({ model: MODEL, contents: prompt })
  const data = parseJson(result.text)
  res.json(data)
})

module.exports = router
