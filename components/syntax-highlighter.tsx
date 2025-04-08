"use client"

import { useEffect, useState } from "react"
import { Highlight, themes } from "prism-react-renderer"
import { useTheme } from "next-themes"

interface SyntaxHighlighterProps {
  code: string
  language: string
  className?: string
  showLineNumbers?: boolean
}

export default function SyntaxHighlighter({
  code,
  language,
  className = "",
  showLineNumbers = false,
}: SyntaxHighlighterProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Map language names to Prism language identifiers
  const languageMap: Record<string, string> = {
    javascript: "jsx",
    js: "jsx",
    typescript: "tsx",
    ts: "tsx",
    jsx: "jsx",
    tsx: "tsx",
    html: "html",
    css: "css",
    json: "json",
    python: "python",
    py: "python",
    java: "java",
    php: "php",
    nodejs: "jsx",
    plaintext: "text",
    text: "text",
  }

  const prismLanguage = languageMap[language.toLowerCase()] || "text"
  const prismTheme = theme === "dark" ? themes.nightOwl : themes.github

  // Special handling for JSON to color keys differently
  if (prismLanguage === "json" && code.trim()) {
    try {
      // Try to parse the JSON to ensure it's valid
      JSON.parse(code)
    } catch (error) {
      // If JSON is invalid, just render it as text
      return (
        <Highlight theme={prismTheme} code={code} language="text">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} ${className} overflow-auto p-4 rounded-md`} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {showLineNumbers && <span className="mr-4 text-gray-500 select-none">{i + 1}</span>}
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      )
    }
  }

  return (
    <Highlight theme={prismTheme} code={code} language={prismLanguage}>
      {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${highlightClassName} ${className} overflow-auto p-4 rounded-md`}
          style={{
            ...style,
            margin: 0,
          }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {showLineNumbers && <span className="mr-4 text-gray-500 select-none">{i + 1}</span>}
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
