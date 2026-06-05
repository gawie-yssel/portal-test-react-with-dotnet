import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Failed to reach the backend'))
  }, [])

  return (
    <main style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '4rem' }}>
      <h1>{message}</h1>
      <p>Message fetched from the C# minimal API backend.</p>
    </main>
  )
}

export default App
