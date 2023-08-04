// ApiContext.tsx
"use client"

import React, { createContext, useContext } from "react"

// Import your custom hooks
import {
  useModelId,
  useAccent,
  useStability,
  useSimilarityBoost,
  useLoading,
} from "./index"

// Create a context to hold the shared state
const ApiContext = createContext<any>(null)

// Create a provider to wrap your components and provide the shared state
interface ApiProviderProps {
  children: React.ReactNode // Add the children prop explicitly
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  // Use your custom hooks to manage the shared state
  const modelIdHook = useModelId("eleven_monolingual_v1")
  const accentHook = useAccent("21m00Tcm4TlvDq8ikWAM")
  const stabilityHook = useStability(0.5)
  const similarityBoostHook = useSimilarityBoost(0.5)
  const loadingHook = useLoading()
  // const { loading, setLoading } = useLoading();

  return (
    <ApiContext.Provider
      value={{
        model_id: modelIdHook.model_id,
        setModel_id: modelIdHook.setModel_id,
        Accent: accentHook.Accent,
        setAccent: accentHook.setAccent,
        stability: stabilityHook.stability,
        setStability: stabilityHook.setStability,
        similarity_boost: similarityBoostHook.similarity_boost,
        setSimilarity_boost: similarityBoostHook.setSimilarity_boost,
        loading: loadingHook.loading,
        setLoading: loadingHook.setLoading,
      }}
    >
      {children}
    </ApiContext.Provider>
  )
}

// Create a custom hook to access the shared state values conveniently
export const useApiContext = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error("useApiContext must be used within an ApiProvider")
  }
  return context
}
