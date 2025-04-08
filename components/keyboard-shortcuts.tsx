"use client"

import { useEffect } from "react"

interface ShortcutAction {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  preventDefault?: boolean
}

interface KeyboardShortcutsProps {
  shortcuts: ShortcutAction[]
}

export default function KeyboardShortcuts({ shortcuts }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrlKey ? e.ctrlKey : !shortcut.ctrlKey === !e.ctrlKey
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : !shortcut.shiftKey === !e.shiftKey
        const altMatch = shortcut.altKey ? e.altKey : !shortcut.altKey === !e.altKey

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault()
          }
          shortcut.action()
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [shortcuts])

  return null
}
