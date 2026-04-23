import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle fade-up"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="material-symbols-outlined">
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  )
}
