import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import QuoteEntry from './QuoteEntry'
import QuoteWizard from './QuoteWizard'
import SimpleCalculator from './SimpleCalculator'
import './index.css'

function QuoteApp() {
  const [mode, setMode] = useState<'entry' | 'interactive' | 'classic'>('entry');

  return (
    <>
      {mode === 'entry' && <QuoteEntry onSelect={(selected) => setMode(selected)} />}
      {mode === 'interactive' && <QuoteWizard onBack={() => setMode('entry')} />}
      {mode === 'classic' && <SimpleCalculator onBack={() => setMode('entry')} />}
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuoteApp />
  </StrictMode>
)
