import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendAiChatMessage, completeAiChat } from '../../api/client'

const MAX_QUESTIONS = 3

export default function AiChat() {
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  const [roleTitle, setRoleTitle] = useState('the role')
  const [messages, setMessages] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [chatData, setChatData] = useState({ title: "Let's get to know you", sub: 'A few quick questions to tailor recommendations for your role.' })

  useEffect(() => {
    const storedData = localStorage.getItem('hiris_application_data')
    if (!storedData) { navigate('/application-form'); return }
    const parsed = JSON.parse(storedData)
    const title = parsed?.roleTitle || 'the role'
    setRoleTitle(title)
    if (parsed?.roleTitle) {
      setChatData({
        title: `Quick Follow-up for: ${parsed.roleTitle}`,
        sub: `A short AI-powered chat to personalise your application for ${parsed.roleTitle}.`
      })
    }
    // Kick off first AI question
    askNextQuestion([], 0, title)
  }, [navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const askNextQuestion = async (history, index, title) => {
    setIsLoading(true)
    try {
      const data = await sendAiChatMessage({
        roleTitle: title || roleTitle,
        chatHistory: history,
        questionIndex: index,
      })
      setMessages(prev => [...prev, { speaker: 'assistant', text: data.message }])
    } catch (e) {
      console.error('AI chat error:', e)
      setMessages(prev => [...prev, { speaker: 'assistant', text: 'Tell us about your most relevant experience for this role.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    const text = inputVal.trim()
    if (!text || isCompleted || isLoading) return

    const newAnswers = { ...answers, [`q${questionIndex}`]: text }
    setAnswers(newAnswers)
    const updatedMessages = [...messages, { speaker: 'user', text }]
    setMessages(updatedMessages)
    setInputVal('')

    const nextIndex = questionIndex + 1
    setQuestionIndex(nextIndex)

    if (nextIndex >= MAX_QUESTIONS) {
      // Show completion message
      setIsLoading(true)
      try {
        const data = await completeAiChat()
        setMessages(prev => [...prev, { speaker: 'assistant', text: data.message }])
      } catch {
        setMessages(prev => [...prev, { speaker: 'assistant', text: "Thanks — everything is set. Submit when you're ready!" }])
      } finally {
        setIsLoading(false)
        setIsCompleted(true)
      }
    } else {
      // Ask next dynamic question
      await askNextQuestion(updatedMessages, nextIndex, roleTitle)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isCompleted) submitChat()
      else handleSend()
    }
  }

  const submitChat = () => {
    const stored = JSON.parse(localStorage.getItem('hiris_application_data') || '{}')
    localStorage.setItem('hiris_application_data', JSON.stringify({ ...stored, chatResponses: answers }))
    navigate('/thank-you-for-applying')
  }

  return (
    <div className="bg-[var(--bg)] text-[var(--text-primary)] antialiased min-h-screen flex flex-col font-sans">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 w-full">
        <div className="max-w-2xl w-full bg-[var(--surface)] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[var(--border)] p-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px transition-all duration-150">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(40,102,110,0.1)] text-[var(--teal)] text-[11px] font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-[14px]">smart_toy</span>
              AI Pre-Screening
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">{chatData.title}</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{chatData.sub}</p>
          </div>

          <div className="flex flex-col h-[420px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)]">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.speaker === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-[#28666E] flex items-center justify-center mr-2 shrink-0 mt-1">
                      <span className="material-symbols-outlined text-white text-[14px]">smart_toy</span>
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.speaker === 'user' ? 'bg-[#28666E] text-white' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-[#28666E] flex items-center justify-center mr-2 shrink-0 mt-1">
                    <span className="material-symbols-outlined text-white text-[14px]">smart_toy</span>
                  </div>
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-2 h-2 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-[var(--border)] px-4 py-4 bg-[var(--surface)]">
              <div className="flex items-start gap-3">
                <textarea
                  rows="2"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading || isCompleted}
                  className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] focus:ring-[#28666E]/20 transition-all duration-150 focus:border-[#28666E] disabled:opacity-50"
                  placeholder={isCompleted ? 'All done!' : isLoading ? 'AI is thinking...' : 'Type your response...'}
                />
                <button
                  onClick={isCompleted ? submitChat : handleSend}
                  disabled={isLoading && !isCompleted}
                  className="inline-flex items-center justify-center rounded-xl bg-[#28666E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1e5059] transition disabled:opacity-50"
                >
                  {isCompleted ? (
                    <><span className="material-symbols-outlined text-[18px] mr-1">send</span>Submit</>
                  ) : (
                    <><span className="material-symbols-outlined text-[18px] mr-1">arrow_upward</span>Send</>
                  )}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-[var(--text-muted)]">Your answers help us tailor this application.</p>
                <p className="text-xs text-[var(--text-muted)] font-semibold">
                  {Math.min(questionIndex, MAX_QUESTIONS)} / {MAX_QUESTIONS} questions
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
