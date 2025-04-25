"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Send, Plus, Trash2, Download, Code, FileJson } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS"
type BodyFormat = "raw" | "json" | "form-data" | "x-www-form-urlencoded"

interface RequestHeader {
  id: string
  key: string
  value: string
  enabled: boolean
}

interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  time: number
  size: number
}

export default function ApiTesterClientPage() {
  const [method, setMethod] = useState<HttpMethod>("GET")
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1")
  const [headers, setHeaders] = useState<RequestHeader[]>([
    { id: "1", key: "Content-Type", value: "application/json", enabled: true },
  ])
  const [params, setParams] = useState<RequestHeader[]>([{ id: "1", key: "", value: "", enabled: true }])
  const [body, setBody] = useState("")
  const [bodyFormat, setBodyFormat] = useState<BodyFormat>("json")

  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"params" | "headers" | "body">("params")
  const [responseTab, setResponseTab] = useState<"body" | "headers">("body")

  const abortControllerRef = useRef<AbortController | null>(null)
  const { toast } = useToast()

  const addHeader = () => {
    setHeaders([...headers, { id: Date.now().toString(), key: "", value: "", enabled: true }])
  }

  const updateHeader = (id: string, field: keyof RequestHeader, value: string | boolean) => {
    setHeaders(headers.map((header) => (header.id === id ? { ...header, [field]: value } : header)))
  }

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((header) => header.id !== id))
  }

  const addParam = () => {
    setParams([...params, { id: Date.now().toString(), key: "", value: "", enabled: true }])
  }

  const updateParam = (id: string, field: keyof RequestHeader, value: string | boolean) => {
    setParams(params.map((param) => (param.id === id ? { ...param, [field]: value } : param)))
  }

  const removeParam = (id: string) => {
    setParams(params.filter((param) => param.id !== id))
  }

  // Handle body format change
  const handleBodyFormatChange = (format: BodyFormat) => {
    setBodyFormat(format)

    // Update Content-Type header based on body format
    const contentTypeHeaderIndex = headers.findIndex((h) => h.key.toLowerCase() === "content-type")
    const updatedHeaders = [...headers]

    let contentTypeValue = "text/plain"
    if (format === "json") contentTypeValue = "application/json"
    else if (format === "form-data") contentTypeValue = "multipart/form-data"
    else if (format === "x-www-form-urlencoded") contentTypeValue = "application/x-www-form-urlencoded"

    if (contentTypeHeaderIndex >= 0) {
      updatedHeaders[contentTypeHeaderIndex] = {
        ...updatedHeaders[contentTypeHeaderIndex],
        value: contentTypeValue,
        enabled: true,
      }
    } else {
      updatedHeaders.push({
        id: Date.now().toString(),
        key: "Content-Type",
        value: contentTypeValue,
        enabled: true,
      })
    }

    setHeaders(updatedHeaders)
  }

  // JSON formatting
  const formatJson = () => {
    if (bodyFormat !== "json") return

    try {
      const parsedJson = JSON.parse(body || "{}")
      setBody(JSON.stringify(parsedJson, null, 2))
      toast({
        title: "JSON formatted",
        description: "Your JSON has been formatted successfully",
      })
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax",
        variant: "destructive",
      })
    }
  }

  // JSON templates
  const loadJsonTemplate = (template: string) => {
    switch (template) {
      case "empty":
        setBody("{\n  \n}")
        break
      case "post":
        setBody(
          JSON.stringify(
            {
              title: "Sample Title",
              body: "Sample body content",
              userId: 1,
            },
            null,
            2,
          ),
        )
        break
      case "user":
        setBody(
          JSON.stringify(
            {
              name: "John Doe",
              email: "john@example.com",
              age: 30,
              address: {
                street: "123 Main St",
                city: "Anytown",
                zipCode: "12345",
              },
            },
            null,
            2,
          ),
        )
        break
      case "array":
        setBody(
          JSON.stringify(
            [
              { id: 1, name: "Item 1" },
              { id: 2, name: "Item 2" },
              { id: 3, name: "Item 3" },
            ],
            null,
            2,
          ),
        )
        break
    }

    setBodyFormat("json")
    handleBodyFormatChange("json")
  }

  // Validate JSON
  const validateJsonBody = () => {
    if (bodyFormat !== "json" || !body.trim()) return true

    try {
      JSON.parse(body)
      return true
    } catch (error) {
      return false
    }
  }

  const buildUrl = () => {
    try {
      const urlObj = new URL(url)

      urlObj.search = ""

      params.forEach((param) => {
        if (param.enabled && param.key.trim()) {
          urlObj.searchParams.append(param.key.trim(), param.value)
        }
      })

      return urlObj.toString()
    } catch (error) {
      return url
    }
  }

  // Send request
  const sendRequest = async () => {
    if (!url.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      })
      return
    }

    if (bodyFormat === "json" && body.trim() && !validateJsonBody()) {
      toast({
        title: "Invalid JSON",
        description: "Please check your JSON syntax before sending",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResponse(null)

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    const startTime = performance.now()

    try {
      const requestUrl = buildUrl()

      const options: RequestInit = {
        method,
        headers: headers
          .filter((header) => header.enabled && header.key.trim())
          .reduce(
            (acc, header) => {
              acc[header.key.trim()] = header.value
              return acc
            },
            {} as Record<string, string>,
          ),
        signal,
      }

      if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
        options.body = body
      }

      const response = await fetch(requestUrl, options)
      const endTime = performance.now()
      const responseTime = endTime - startTime

      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      let responseBody = ""
      let responseSize = 0

      try {
        const blob = await response.blob()
        responseSize = blob.size

        if (blob.type.includes("application/json")) {
          const text = await blob.text()
          try {
            const json = JSON.parse(text)
            responseBody = JSON.stringify(json, null, 2)
          } catch {
            responseBody = text
          }
        } else if (blob.type.includes("text/")) {
          responseBody = await blob.text()
        } else {
          responseBody = `Binary response with MIME type: ${blob.type}`
        }
      } catch (error) {
        responseBody = "Could not read response body"
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: responseTime,
        size: responseSize,
      })
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        toast({
          title: "Request cancelled",
          description: "The request was cancelled",
        })
      } else {
        toast({
          title: "Request failed",
          description: (error as Error).message,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }

  const copyResponse = () => {
    if (!response) return

    const textToCopy = responseTab === "body" ? response.body : JSON.stringify(response.headers, null, 2)

    navigator.clipboard.writeText(textToCopy)

    toast({
      title: "Copied to clipboard",
      description: `Response ${responseTab} copied to clipboard`,
    })
  }

  const downloadResponse = () => {
    if (!response) return

    const textToDownload = responseTab === "body" ? response.body : JSON.stringify(response.headers, null, 2)

    const blob = new Blob([textToDownload], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = responseTab === "body" ? "response-body.txt" : "response-headers.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: `Response ${responseTab} is being downloaded`,
    })
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return "text-green-600 dark:text-green-400"
    if (status >= 300 && status < 400) return "text-blue-600 dark:text-blue-400"
    if (status >= 400 && status < 500) return "text-yellow-600 dark:text-yellow-400"
    if (status >= 500) return "text-red-600 dark:text-red-400"
    return "text-gray-600 dark:text-gray-400"
  }

  const faqs = [
    {
      question: "What is an API tester?",
      answer:
        "An API tester is a tool that allows developers to send HTTP requests to APIs (Application Programming Interfaces) and examine the responses. It's useful for testing, debugging, and exploring APIs without writing code.",
    },
    {
      question: "What HTTP methods can I use?",
      answer:
        "Our API tester supports all standard HTTP methods: GET (retrieve data), POST (create data), PUT (update data), DELETE (remove data), PATCH (partially update data), HEAD (get headers only), and OPTIONS (get communication options).",
    },
    {
      question: "How do I add query parameters to my request?",
      answer:
        "In the 'Params' tab, add key-value pairs for each query parameter you want to include. These will be automatically appended to your URL when the request is sent. You can enable/disable parameters without removing them.",
    },
    {
      question: "How do I add a request body?",
      answer:
        "For methods that support a request body (POST, PUT, PATCH), switch to the 'Body' tab and enter your request body. For JSON data, select 'JSON' as the body format and use the formatting tools to ensure valid JSON.",
    },
    {
      question: "Are there any limitations to this API tester?",
      answer:
        "This API tester runs in your browser, so it's subject to browser security restrictions like CORS (Cross-Origin Resource Sharing). Some APIs may not allow requests from browsers or may require authentication that's difficult to implement in a browser environment.",
    },
  ]

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">API Tester</h1>
        <p className="mt-2 text-muted-foreground">Test and debug APIs with a simple interface</p>
      </div>

      <div className="text-center mb-6">
        <AdBanner format="horizontal" slot="api-tester-top" />
        <p className="text-xs text-muted-foreground mt-1">Advertisement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Request Section */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <div className="w-32">
                  <Select value={method} onValueChange={(value) => setMethod(value as HttpMethod)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="HEAD">HEAD</SelectItem>
                      <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Input placeholder="Enter URL" value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>

                <div>
                  {isLoading ? (
                    <Button variant="destructive" onClick={cancelRequest}>
                      Cancel
                    </Button>
                  ) : (
                    <Button onClick={sendRequest}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  )}
                </div>
              </div>

              <Tabs
                defaultValue="params"
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "params" | "headers" | "body")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="params">Params</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="body">Body</TabsTrigger>
                </TabsList>

                {/* Parameters Tab */}
                <TabsContent value="params" className="space-y-4 min-h-[300px]">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Query Parameters</h3>
                    <Button variant="outline" size="sm" onClick={addParam}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Parameter
                    </Button>
                  </div>

                  {params.map((param) => (
                    <div key={param.id} className="flex items-center space-x-2">
                      <Switch
                        checked={param.enabled}
                        onCheckedChange={(checked) => updateParam(param.id, "enabled", checked)}
                      />
                      <Input
                        placeholder="Key"
                        value={param.key}
                        onChange={(e) => updateParam(param.id, "key", e.target.value)}
                        className="flex-1"
                        disabled={!param.enabled}
                      />
                      <Input
                        placeholder="Value"
                        value={param.value}
                        onChange={(e) => updateParam(param.id, "value", e.target.value)}
                        className="flex-1"
                        disabled={!param.enabled}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeParam(param.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                {/* Headers Tab */}
                <TabsContent value="headers" className="space-y-4 min-h-[300px]">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Headers</h3>
                    <Button variant="outline" size="sm" onClick={addHeader}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Header
                    </Button>
                  </div>

                  {headers.map((header) => (
                    <div key={header.id} className="flex items-center space-x-2">
                      <Switch
                        checked={header.enabled}
                        onCheckedChange={(checked) => updateHeader(header.id, "enabled", checked)}
                      />
                      <Input
                        placeholder="Key"
                        value={header.key}
                        onChange={(e) => updateHeader(header.id, "key", e.target.value)}
                        className="flex-1"
                        disabled={!header.enabled}
                      />
                      <Input
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => updateHeader(header.id, "value", e.target.value)}
                        className="flex-1"
                        disabled={!header.enabled}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHeader(header.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                {/* Body Tab */}
                <TabsContent value="body" className="space-y-4 min-h-[300px]">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="body-format">Body Format:</Label>
                        <Select
                          value={bodyFormat}
                          onValueChange={(value) => handleBodyFormatChange(value as BodyFormat)}
                        >
                          <SelectTrigger id="body-format" className="w-40">
                            <SelectValue placeholder="Body Format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="raw">Raw</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="form-data">Form Data</SelectItem>
                            <SelectItem value="x-www-form-urlencoded">x-www-form-urlencoded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {bodyFormat === "json" && (
                        <Button variant="outline" size="sm" onClick={formatJson}>
                          <Code className="h-4 w-4 mr-2" />
                          Format JSON
                        </Button>
                      )}
                    </div>

                    {bodyFormat === "json" && (
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => loadJsonTemplate("empty")}>
                          Empty Object
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => loadJsonTemplate("post")}>
                          Post Object
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => loadJsonTemplate("user")}>
                          User Object
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => loadJsonTemplate("array")}>
                          Array
                        </Button>
                      </div>
                    )}
                  </div>

                  {bodyFormat === "json" && !validateJsonBody() && body.trim() && (
                    <div className="text-red-500 text-sm mb-2 flex items-center">
                      <Badge variant="destructive" className="mr-2">
                        Invalid JSON
                      </Badge>
                      Please check your JSON syntax before sending.
                    </div>
                  )}

                  {bodyFormat === "json" && (
                    <div className="bg-muted/30 p-2 rounded-md mb-2 flex items-center text-sm">
                      <FileJson className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        Enter valid JSON in the text area below. Use the Format JSON button to validate and format your
                        JSON.
                      </span>
                    </div>
                  )}

                  <Textarea
                    placeholder={
                      !["POST", "PUT", "PATCH"].includes(method)
                        ? "This HTTP method typically doesn't include a request body"
                        : bodyFormat === "json"
                          ? "Enter JSON body"
                          : "Enter request body"
                    }
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    disabled={!["POST", "PUT", "PATCH"].includes(method)}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Response Section */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Response</span>
                {response && (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={copyResponse}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadResponse}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-80 bg-muted/30 rounded-md">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Sending request...</p>
                  </div>
                </div>
              ) : response ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-muted/30 p-2 rounded-md">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className={`font-medium ${getStatusColor(response.status)}`}>
                        {response.status} {response.statusText}
                      </p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-md">
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-medium">{response.time.toFixed(0)} ms</p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-md">
                      <p className="text-xs text-muted-foreground">Size</p>
                      <p className="font-medium">{formatBytes(response.size)}</p>
                    </div>
                  </div>

                  <Tabs defaultValue="body" onValueChange={(value) => setResponseTab(value as "body" | "headers")}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="body">Body</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="body" className="mt-4">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono max-h-[400px] overflow-y-auto">
                        {response.body || "(No body)"}
                      </pre>
                    </TabsContent>

                    <TabsContent value="headers" className="mt-4">
                      <div className="bg-muted p-4 rounded-md overflow-x-auto max-h-[400px] overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-1 font-medium">Name</th>
                              <th className="text-left py-2 px-1 font-medium">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(response.headers).map(([key, value]) => (
                              <tr key={key} className="border-b">
                                <td className="py-2 px-1 font-mono">{key}</td>
                                <td className="py-2 px-1 font-mono break-all">{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 bg-muted/30 rounded-md">
                  <div className="text-center text-muted-foreground">
                    <p>No response yet</p>
                    <p className="text-sm mt-1">Send a request to see the response here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center my-8">
        <AdBanner format="rectangle" slot="api-tester-middle" />
        <p className="text-xs text-muted-foreground mt-1">Advertisement</p>
      </div>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About API Tester</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our API Tester tool helps developers test and debug APIs without writing code. It provides a simple
            interface for sending HTTP requests and examining responses, making it easier to work with RESTful APIs and
            web services.
          </p>
          <p>
            APIs (Application Programming Interfaces) are sets of rules that allow different software applications to
            communicate with each other. Testing APIs is an essential part of development to ensure they work as
            expected and handle various scenarios correctly.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Send requests using different HTTP methods (GET, POST, PUT, DELETE, etc.)</li>
            <li>Add custom headers to your requests</li>
            <li>Include query parameters in your URLs</li>
            <li>Send request bodies for methods that support them</li>
            <li>View response status, headers, and body</li>
            <li>Copy and download response data</li>
          </ul>
        </div>
      </section>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">Common HTTP Status Codes</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border p-2 text-left">Code</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 text-green-600 dark:text-green-400 font-medium">200</td>
                <td className="border p-2">OK</td>
                <td className="border p-2">The request was successful</td>
              </tr>
              <tr>
                <td className="border p-2 text-green-600 dark:text-green-400 font-medium">201</td>
                <td className="border p-2">Created</td>
                <td className="border p-2">The request was successful and a new resource was created</td>
              </tr>
              <tr>
                <td className="border p-2 text-blue-600 dark:text-blue-400 font-medium">304</td>
                <td className="border p-2">Not Modified</td>
                <td className="border p-2">The resource has not been modified since the last request</td>
              </tr>
              <tr>
                <td className="border p-2 text-yellow-600 dark:text-yellow-400 font-medium">400</td>
                <td className="border p-2">Bad Request</td>
                <td className="border p-2">The server could not understand the request</td>
              </tr>
              <tr>
                <td className="border p-2 text-yellow-600 dark:text-yellow-400 font-medium">401</td>
                <td className="border p-2">Unauthorized</td>
                <td className="border p-2">Authentication is required and has failed or not been provided</td>
              </tr>
              <tr>
                <td className="border p-2 text-yellow-600 dark:text-yellow-400 font-medium">403</td>
                <td className="border p-2">Forbidden</td>
                <td className="border p-2">The server understood the request but refuses to authorize it</td>
              </tr>
              <tr>
                <td className="border p-2 text-yellow-600 dark:text-yellow-400 font-medium">404</td>
                <td className="border p-2">Not Found</td>
                <td className="border p-2">The requested resource could not be found</td>
              </tr>
              <tr>
                <td className="border p-2 text-red-600 dark:text-red-400 font-medium">500</td>
                <td className="border p-2">Internal Server Error</td>
                <td className="border p-2">The server encountered an unexpected condition</td>
              </tr>
              <tr>
                <td className="border p-2 text-red-600 dark:text-red-400 font-medium">503</td>
                <td className="border p-2">Service Unavailable</td>
                <td className="border p-2">The server is not ready to handle the request</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
