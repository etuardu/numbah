const API_KEY = import.meta.env.VITE_11LABS_API_KEY || ''
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'

export async function speakRussian(text) {
  if (!API_KEY) return null

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
      }),
    })

    if (!response.ok) return null

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}
