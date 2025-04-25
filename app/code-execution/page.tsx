"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CodeEditor from "@/components/code-editor"
import { PlayIcon, MonitorStopIcon as StopIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Language = "javascript" | "php" | "java" | "python" | "nodejs"

interface LanguageConfig {
  name: string
  extension: string
  defaultCode: string
  execute: (code: string) => Promise<string>
}

export default function CodeExecutionPage() {
  const { toast } = useToast()
  const [language, setLanguage] = useState<Language>("javascript")
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)

  const languageConfigs: Record<Language, LanguageConfig> = {
    javascript: {
      name: "JavaScript",
      extension: "js",
      defaultCode:
        '// JavaScript runs directly in the browser\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
      execute: async (code) => {
        try {
          // Create a safe execution environment
          const originalConsoleLog = console.log
          const originalConsoleError = console.error
          const logs: string[] = []

          console.log = (...args) => {
            logs.push(
              args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg))).join(" "),
            )
          }

          console.error = (...args) => {
            logs.push(
              `ERROR: ${args
                .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
                .join(" ")}`,
            )
          }

          try {
            const fn = new Function(code)
            fn()
          } catch (error) {
            console.error(error)
          }

          console.log = originalConsoleLog
          console.error = originalConsoleError

          return logs.join("\n")
        } catch (error) {
          return `Execution error: ${(error as Error).message}`
        }
      },
    },
    nodejs: {
      name: "Node.js",
      extension: "js",
      defaultCode:
        '// Node.js code (simulated)\n\nconst fs = require("fs");\n\n// This is simulated in the browser\nconsole.log("Hello from Node.js!");\n\n// Simulate reading a file\nconsole.log("Reading file: example.txt");\nconsole.log("File contents: Sample text");',
      execute: async (code) => {
        return "Node.js execution is simulated in the browser.\n\nHello from Node.js!\nReading file: example.txt\nFile contents: Sample text\n\nNote: For full Node.js functionality, a backend service would be required."
      },
    },
    php: {
      name: "PHP",
      extension: "php",
      defaultCode:
        '<?php\n// PHP code (simulated)\n\nfunction greet($name) {\n  return "Hello, " . $name . "!";\n}\n\necho greet("World");\n\n$array = array("apple", "banana", "orange");\nforeach ($array as $fruit) {\n  echo "\\n" . $fruit;\n}',
      execute: async (code) => {
        return "PHP execution is simulated in the browser.\n\nHello, World!\napple\nbanana\norange\n\nNote: For actual PHP execution, a backend service would be required."
      },
    },
    java: {
      name: "Java",
      extension: "java",
      defaultCode:
        '// Java code (simulated)\n\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n    \n    for (int i = 1; i <= 5; i++) {\n      System.out.println("Count: " + i);\n    }\n  }\n}',
      execute: async (code) => {
        return "Java execution is simulated in the browser.\n\nHello, World!\nCount: 1\nCount: 2\nCount: 3\nCount: 4\nCount: 5\n\nNote: For actual Java execution, a backend service would be required."
      },
    },
    python: {
      name: "Python",
      extension: "py",
      defaultCode:
        '# Python code (simulated)\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))\n\n# A simple loop\nfruits = ["apple", "banana", "orange"]\nfor fruit in fruits:\n    print(fruit)',
      execute: async (code) => {
        return "Python execution is simulated in the browser.\n\nHello, World!\napple\nbanana\norange\n\nNote: For actual Python execution, a backend service would be required."
      },
    },
  }

  useEffect(() => {
    setCode(languageConfigs[language].defaultCode)
  }, [language])

  const executeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please enter some code to execute.",
        variant: "destructive",
      })
      return
    }

    setIsExecuting(true)
    setOutput("Executing...")

    try {
      const result = await languageConfigs[language].execute(code)
      setOutput(result)
    } catch (error) {
      setOutput(`Execution error: ${(error as Error).message}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const stopExecution = () => {
    if (isExecuting) {
      setIsExecuting(false)
      setOutput("Execution stopped by user.")
      toast({
        title: "Execution Stopped",
        description: "Code execution was stopped.",
      })
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Code Execution Console</h1>
        <p className="mt-2 text-muted-foreground">
          Write and execute code in multiple languages with syntax highlighting
        </p>
      </div>

      <div className="flex flex-col gap-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label htmlFor="language-select" className="text-sm font-medium">
              Language:
            </label>
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger className="w-[180px]" id="language-select">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="nodejs">Node.js</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button onClick={executeCode} disabled={isExecuting} className="gap-1">
              <PlayIcon className="h-4 w-4" />
              Run
            </Button>
            <Button onClick={stopExecution} disabled={!isExecuting} variant="outline" className="gap-1">
              <StopIcon className="h-4 w-4" />
              Stop
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Code Editor</h2>
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              placeholder={`Write your ${languageConfigs[language].name} code here...`}
              minHeight="400px"
              showLineNumbers={true}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Output</h2>
            <div className="border rounded-md bg-black text-white font-mono p-4 h-[400px] overflow-auto">
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 border rounded-md bg-muted/50">
          <h3 className="text-sm font-semibold mb-2">Note:</h3>
          <p className="text-sm text-muted-foreground">
            JavaScript runs directly in your browser. For PHP, Java, Python, and full Node.js functionality, this demo
            provides simulated outputs. In a production environment, these would connect to backend services.
          </p>
        </div>
      </div>
    </div>
  )
}
