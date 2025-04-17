"use client"

import { useRef, useEffect } from "react"

export function generateFavicon() {
  const canvas = document.createElement("canvas")
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext("2d")

  if (!ctx) return null

  // Background
  ctx.fillStyle = "#0f172a" // Dark blue background
  ctx.fillRect(0, 0, 32, 32)

  // "D" letter
  ctx.fillStyle = "#38bdf8" // Light blue for the letter
  ctx.font = "bold 24px sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("D", 16, 16)

  // Add a subtle border
  ctx.strokeStyle = "#0284c7" // Darker blue for border
  ctx.lineWidth = 2
  ctx.strokeRect(2, 2, 28, 28)

  return canvas.toDataURL("image/png")
}

export default function FaviconGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Background
    ctx.fillStyle = "#0f172a" // Dark blue background
    ctx.fillRect(0, 0, 32, 32)

    // "D" letter
    ctx.fillStyle = "#38bdf8" // Light blue for the letter
    ctx.font = "bold 24px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("D", 16, 16)

    // Add a subtle border
    ctx.strokeStyle = "#0284c7" // Darker blue for border
    ctx.lineWidth = 2
    ctx.strokeRect(2, 2, 28, 28)

    // Generate favicon link
    const link = document.createElement("link")
    link.rel = "icon"
    link.href = canvas.toDataURL("image/png")
    document.head.appendChild(link)
  }, [])

  return <canvas ref={canvasRef} width={32} height={32} style={{ display: "none" }} />
}
