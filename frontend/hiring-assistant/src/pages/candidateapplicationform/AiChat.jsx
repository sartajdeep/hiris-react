import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AiChat() {
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  const questions = [
    { id: 'skill', prompt: 'What is your strongest skill or area of expertise relevant to this role?' },
    { id: 'project', prompt: 'Tell us about a recent project or experience that best matches this position.' },
    { id: 'goal', prompt: 'What is one thing you hope to learn or achieve in this role?' },
  ]

  const [chatData, setChatData] = useState({ title: "Let's get to know you", sub: "A few quick questions to tailor recommendations for your role." })
  const [messages, setMessages] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem('hiris_application_data')
    if (!storedData) {
      navigate('/application-form')
      return
    }
    const parsed = JSON.parse(storedData)
    if (parsed?.roleTitle) {
      setChatData({
        title: `Quick Follow-up for: ${parsed.roleTitle}`,
        sub: `Here's a quick chat to customize your application based on ${parsed.roleTitle}.`
      })
    }
    
    // Start the chat flow
    const timer = setTimeout(() => {
      setMessages([{ speaker: 'assistant', text: questions[0].prompt }])
    }, 250)
    return () => clearTimeout(timer)
  }, [navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = inputVal.trim()
    if (!text || isCompleted) return

    const newAnswers = { ...answers, [questions[currentQuestionIndex].id]: text }
    setAnswers(newAnswers)
    setMessages(prev => [...prev, { speaker: 'user', text }])
    setInputVal('')

    const nextIndex = currentQuestionIndex + 1
    setCurrentQuestionIndex(nextIndex)

    if (nextIndex < questions.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { speaker: 'assistant', text: questions[nextIndex].prompt }])
      }, 350)
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { speaker: 'assistant', text: 'Thanks—everything is set. Submit when you’re ready!' }])
        setIsCompleted(true)
      }, 350)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isCompleted) {
        submitChat()
      } else {
        handleSend()
      }
    }
  }

  const submitChat = () => {
    const stored = JSON.parse(localStorage.getItem('hiris_application_data') || '{}')
    localStorage.setItem('hiris_application_data', JSON.stringify({
      ...stored,
      chatResponses: answers,
    }))
    navigate('/thank-you-for-applying')
  }

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--text-primary)] antialiased min-h-screen flex flex-col font-sans">
      
      

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 w-full">
        <div className="max-w-2xl w-full bg-[color:var(--surface)] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[color:var(--border)] p-10 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px transition-all duration-150">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-[color:var(--text-primary)]">{chatData.title}</h1>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{chatData.sub}</p>
          </div>

          <div className="flex flex-col h-[420px] overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--bg)]">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.speaker === 'user' ? 'bg-[#28666E] text-white' : 'bg-slate-100 text-slate-900'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-[color:var(--border)] px-4 py-4 bg-[color:var(--surface)]">
              <div className="flex items-start gap-3">
                <textarea 
                  rows="2" 
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 resize-none rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--text-primary)] focus:ring-[#28666E]/20 transition-all duration-150 focus:border-[#28666E] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px" 
                  placeholder="Type your response..."
                ></textarea>
                <button 
                  onClick={isCompleted ? submitChat : handleSend}
                  className="inline-flex items-center justify-center rounded-xl bg-[#28666E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#28666E]/90 transition"
                >
                  {isCompleted ? 'Submit' : 'Send'}
                </button>
              </div>
              <p className="mt-2 text-xs text-[color:var(--text-secondary)]">Your answers will help us tailor questions to your resume and role.</p>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  )
}
