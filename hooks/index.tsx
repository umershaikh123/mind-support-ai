import React from "react"

export const useModelId = (initialValue: string) => {
  const [model_id, setModel_id] = React.useState(initialValue)
  return { model_id, setModel_id }
}

export const useAccent = (initialValue: string) => {
  const [Accent, setAccent] = React.useState(initialValue)
  return { Accent, setAccent }
}

export const useStability = (initialValue: number) => {
  const [stability, setStability] = React.useState(initialValue)
  return { stability, setStability }
}

export const useSimilarityBoost = (initialValue: number) => {
  const [similarity_boost, setSimilarity_boost] = React.useState(initialValue)
  return { similarity_boost, setSimilarity_boost }
}

export const useLoading = () => {
  const [loading, setLoading] = React.useState(true)
  return { loading, setLoading }
}
