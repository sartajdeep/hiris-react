import { useState, useEffect } from 'react'
export function useLiveClock() {
  const [currentDate, setCurrentDate] = useState('')
  const [liveTimeText, setLiveTimeText] = useState('Live')
  const [indicatorTop, setIndicatorTop] = useState(null)
  useEffect(() => {
    function update() {
      const now = new Date()
      setCurrentDate(now.toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' }))
      const h = now.getHours() + now.getMinutes() / 60
      if (h >= 9 && h <= 19) {
        setIndicatorTop((h - 9) * 84)
        setLiveTimeText(`Live ${now.getHours()}:${now.getMinutes().toString().padStart(2,'0')}`)
      }
    }
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [])
  return { currentDate, liveTimeText, indicatorTop }
}
