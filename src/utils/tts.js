const TTS_ENDPOINT = '/numbah/api/tts.php'

export async function speakRussian(text) {
  try {
    const response = await fetch(TTS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) return null

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}
