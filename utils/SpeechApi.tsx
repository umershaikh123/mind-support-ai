interface ApiProps {
  text: string
  model_id: string
  Accent: string
  stability: number
  similarity_boost: number
}

const callElevenLabsTextToSpeechAPI = async (props: ApiProps) => {
  const { text, model_id, stability, similarity_boost, Accent } = props

  if (!text) return "Text parameter can't be null"

  const [rachel, anntoni] = ["21m00Tcm4TlvDq8ikWAM", "ErXwobaYiN019PkySvjV"]

  const voiceModel = model_id || "undefined"
  const accent = Accent || "undefined"
  const Stability = stability || "undefined"
  const SimilarityBoost = similarity_boost || "undefined"

  console.log("voiceModel", voiceModel)
  console.log("text", text)

  console.log("accent", accent)
  console.log("Stability", Stability)
  console.log("SimilarityBoost", SimilarityBoost)

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${accent}`
  const getModel = `https://api.elevenlabs.io/v1/models` // response.name
  const getVoices = `https://api.elevenlabs.io/v1/voices`
  const getVoiceSettings = `https://api.elevenlabs.io/v1/voices/${accent}/settings`
  const getVoice = `https://api.elevenlabs.io/v1/voices/${accent}?with_settings=true`

  // const apiKey = process.env.ELEVENLABS_API_KEY || "undefined"

  console.log("process env", process.env)
  // console.log("Api Key", process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY)

  const headers = {
    accept: "audio/mpeg",
    "xi-api-key":
      process.env.ELEVENLABS_API_KEY || "67f09ee6a4dbb1a534806df1203448c2",
    "Content-Type": "application/json",
  }
  console.log("Api Key speech", process.env.ELEVENLABS_API_KEY)

  const data = {
    text,
    model_id: voiceModel,
    voice_settings: {
      stability: Stability,
      similarity_boost: SimilarityBoost,
    },
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const blob = await response.blob()
    const audioUrl = URL.createObjectURL(blob)

    return audioUrl
  } catch (error) {
    console.error("Error:", error) // Handle any errors
  }

  //   try {
  //     const response = await fetch(getModel, {
  //       method: "GET",
  //       headers: headers,
  //     })

  //     if (!response.ok) {
  //       throw new Error("API request failed")
  //     }

  //     console.log("getModel response", response.json())
  //   } catch (error) {
  //     console.error("Error:", error) // Handle any errors
  //   }

  //   try {
  //     const response = await fetch(getVoices, {
  //       method: "GET",
  //       headers: headers,
  //     })

  //     if (!response.ok) {
  //       throw new Error("API request failed")
  //     }

  //     console.log("getVoices response", response.json())
  //   } catch (error) {
  //     console.error("Error:", error) // Handle any errors
  //   }

  //   try {
  //     const response = await fetch(getVoiceSettings, {
  //       method: "GET",
  //       headers: headers,
  //     })

  //     if (!response.ok) {
  //       throw new Error("API request failed")
  //     }

  //     console.log("getVoiceSettings response", response.json())
  //   } catch (error) {
  //     console.error("Error:", error) // Handle any errors
  //   }

  //   try {
  //     const response = await fetch(getVoice, {
  //       method: "GET",
  //       headers: headers,
  //     })

  //     if (!response.ok) {
  //       throw new Error("API request failed")
  //     }

  //     console.log("getVoice response", response.json())
  //   } catch (error) {
  //     console.error("Error:", error) // Handle any errors
  //   }
}

export { callElevenLabsTextToSpeechAPI }
