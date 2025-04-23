"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  CheckCircle2,
  AlertCircle,
  Globe,
  Smartphone,
  Zap,
  Link2,
  Search,
  FileText,
  Copy,
  Info,
  ArrowRight,
  ExternalLink,
  Loader2,
} from "lucide-react"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { useToast } from "@/components/ui/use-toast"

// Types for our audit results
interface AuditResult {
  score: number
  issues: AuditIssue[]
  recommendations: string[]
  passed: string[]
}

interface AuditIssue {
  type: "error" | "warning" | "info"
  message: string
  details?: string
  impact: "high" | "medium" | "low"
}

export default function WebsiteAuditClientPage() {
  const [url, setUrl] = useState("")
  const [isValidUrl, setIsValidUrl] = useState(false)
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditProgress, setAuditProgress] = useState(0)
  const [auditComplete, setAuditComplete] = useState(false)
  const [currentAuditStep, setCurrentAuditStep] = useState("")

  // Audit results for each category
  const [seoResults, setSeoResults] = useState<AuditResult | null>(null)
  const [technicalResults, setTechnicalResults] = useState<AuditResult | null>(null)
  const [mobileResults, setMobileResults] = useState<AuditResult | null>(null)
  const [performanceResults, setPerformanceResults] = useState<AuditResult | null>(null)
  const [linksResults, setLinksResults] = useState<AuditResult | null>(null)
  const [contentResults, setContentResults] = useState<AuditResult | null>(null)

  // Audit options
  const [auditOptions, setAuditOptions] = useState({
    seo: true,
    technical: true,
    mobile: true,
    performance: true,
    links: true,
    content: true,
  })

  // Ref to store the abort controller
  const abortControllerRef = useRef<AbortController | null>(null)

  // Use toast
  const { toast } = useToast()

  // Validate URL when it changes
  useEffect(() => {
    try {
      const urlObj = new URL(url)
      setIsValidUrl(urlObj.protocol === "http:" || urlObj.protocol === "https:")
    } catch (e) {
      setIsValidUrl(false)
    }
  }, [url])

  // Function to start the audit process
  const startAudit = async () => {
    if (!isValidUrl) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      })
      return
    }

    // Reset previous results
    setSeoResults(null)
    setTechnicalResults(null)
    setMobileResults(null)
    setPerformanceResults(null)
    setLinksResults(null)
    setContentResults(null)

    setIsAuditing(true)
    setAuditComplete(false)
    setAuditProgress(0)

    // Create a new AbortController for this audit
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    // Count how many audits we're running
    const auditCount = Object.values(auditOptions).filter(Boolean).length
    let completedAudits = 0

    // Helper function to run an audit with error handling
    const runAudit = async <T extends () => Promise<AuditResult | null>>(
      auditFunction: T,
      stepMessage: string,
    ): Promise<AuditResult | null> => {
      setCurrentAuditStep(stepMessage)
      try {
        const result = await auditFunction()
        completedAudits++
        setAuditProgress((completedAudits / auditCount) * 100)
        return result
      } catch (error) {
        // Handle abort errors and other errors
        console.error(`${stepMessage} failed:`, error)
        toast({
          title: "Audit Error",
          description: `An error occurred during the ${stepMessage.toLowerCase()}`,
          variant: "destructive",
        })
        return null // Return null to indicate failure
      }
    }

    // Run each selected audit
    if (auditOptions.seo) {
      const result = await runAudit(() => generateSeoAuditResults(url, signal), "Analyzing SEO factors...")
      setSeoResults(result)
    }

    if (auditOptions.technical) {
      const result = await runAudit(() => generateTechnicalAuditResults(url, signal), "Checking technical aspects...")
      setTechnicalResults(result)
    }

    if (auditOptions.mobile) {
      const result = await runAudit(() => generateMobileAuditResults(url, signal), "Testing mobile responsiveness...")
      setMobileResults(result)
    }

    if (auditOptions.performance) {
      const result = await runAudit(
        () => generatePerformanceAuditResults(url, signal),
        "Measuring performance metrics...",
      )
      setPerformanceResults(result)
    }

    if (auditOptions.links) {
      const result = await runAudit(() => generateLinksAuditResults(url, signal), "Checking for broken links...")
      setLinksResults(result)
    }

    if (auditOptions.content) {
      const result = await runAudit(() => generateContentAuditResults(url, signal), "Analyzing content uniqueness...")
      setContentResults(result)
    }

    setIsAuditing(false)
    setAuditComplete(true)
    setCurrentAuditStep("")
  }

  // Function to cancel the audit
  const cancelAudit = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsAuditing(false)
      setCurrentAuditStep("")
      toast({
        title: "Audit cancelled",
        description: "The audit process was cancelled.",
      })
    }
  }

  // Simulate a network request with abort signal
  const simulateNetworkRequest = (signal: AbortSignal) => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        resolve()
      }, 1500)

      signal.addEventListener("abort", () => {
        clearTimeout(timeout)
        reject(new Error("Request aborted"))
      })
    })
  }

  // Generate mock SEO audit results (would be replaced with actual analysis)
  const generateSeoAuditResults = async (url: string, signal: AbortSignal): Promise<AuditResult | null> => {
    try {
      // Simulate a network request with abort signal
      await simulateNetworkRequest(signal)

      // Mock SEO analysis
      return {
        score: 78,
        issues: [
          {
            type: "warning",
            message: `Meta descriptions are missing on some pages of ${url}`,
            details: "Pages without meta descriptions: /about, /contact, /tools/formatters",
            impact: "medium",
          },
          {
            type: "error",
            message: `H1 tags missing on some pages of ${url}`,
            details: "Pages without H1 tags: /privacy-policy, /terms-of-service",
            impact: "high",
          },
          {
            type: "info",
            message: `Some image alt texts on ${url} could be more descriptive`,
            impact: "low",
          },
        ],
        recommendations: [
          "Add unique meta descriptions to all pages",
          "Ensure each page has exactly one H1 tag",
          "Improve image alt text descriptions for better accessibility and SEO",
          "Consider adding structured data to enhance rich snippets in search results",
        ],
        passed: [
          "Title tags are well-optimized",
          "URL structure is clean and SEO-friendly",
          "XML sitemap is properly configured",
          "robots.txt is properly set up",
        ],
      }
    } catch (error) {
      // Handle abort errors and other errors
      if ((error as Error).name === "AbortError") {
        // Request was aborted
        return null
      }
      console.error("SEO Audit Error:", error)
      return {
        score: 0,
        issues: [{ type: "error", message: "Failed to perform SEO analysis", impact: "high" }],
        recommendations: [],
        passed: [],
      }
    }
  }

  // Generate mock technical audit results
  const generateTechnicalAuditResults = async (url: string, signal: AbortSignal): Promise<AuditResult | null> => {
    try {
      await simulateNetworkRequest(signal)
      return {
        score: 85,
        issues: [
          {
            type: "warning",
            message: `HTTPS implementation has mixed content issues on ${url}`,
            details: "Some resources are loaded over HTTP on HTTPS pages",
            impact: "medium",
          },
          {
            type: "info",
            message: `Consider implementing HTTP/2 for improved performance on ${url}`,
            impact: "low",
          },
        ],
        recommendations: [
          "Fix mixed content issues by ensuring all resources load over HTTPS",
          "Implement HTTP/2 to improve loading performance",
          "Add security headers like Content-Security-Policy",
          "Consider implementing HSTS for improved security",
        ],
        passed: [
          "SSL certificate is valid and properly configured",
          "Server response time is good",
          "No 404 errors found on main pages",
          "Proper caching headers are implemented",
        ],
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return null
      }
      console.error("Technical Audit Error:", error)
      return {
        score: 0,
        issues: [{ type: "error", message: "Failed to perform technical analysis", impact: "high" }],
        recommendations: [],
        passed: [],
      }
    }
  }

  // Generate mock mobile audit results
  const generateMobileAuditResults = async (url: string, signal: AbortSignal): Promise<AuditResult | null> => {
    try {
      await simulateNetworkRequest(signal)
      return {
        score: 92,
        issues: [
          {
            type: "warning",
            message: `Touch targets are too small on some elements on ${url}`,
            details: "Some buttons and links are smaller than the recommended 48x48px touch target size",
            impact: "medium",
          },
        ],
        recommendations: [
          "Increase the size of touch targets to at least 48x48px",
          "Ensure font sizes are readable on mobile without zooming",
          "Test on various mobile devices and screen sizes",
        ],
        passed: [
          "Viewport meta tag is properly configured",
          "Content is properly sized to the viewport",
          "Text is readable without zooming",
          "Site passes Google's Mobile-Friendly Test",
        ],
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return null
      }
      console.error("Mobile Audit Error:", error)
      return {
        score: 0,
        issues: [{ type: "error", message: "Failed to perform mobile analysis", impact: "high" }],
        recommendations: [],
        passed: [],
      }
    }
  }

  // Generate mock performance audit results
  const generatePerformanceAuditResults = async (url: string, signal: AbortSignal): Promise<AuditResult | null> => {
    try {
      await simulateNetworkRequest(signal)
      return {
        score: 68,
        issues: [
          {
            type: "error",
            message: `Large JavaScript bundles impacting load time on ${url}`,
            details: "Main bundle size is 1.2MB which is above the recommended size",
            impact: "high",
          },
          {
            type: "warning",
            message: `Images are not properly sized on ${url}`,
            details: "Several images are being scaled down in the browser",
            impact: "medium",
          },
          {
            type: "warning",
            message: `Render-blocking resources detected on ${url}`,
            details: "3 CSS files and 2 JavaScript files are blocking rendering",
            impact: "medium",
          },
        ],
        recommendations: [
          "Implement code splitting to reduce JavaScript bundle sizes",
          "Optimize and properly size images",
          "Defer non-critical JavaScript and CSS",
          "Implement lazy loading for below-the-fold images",
          "Consider using a CDN for static assets",
        ],
        passed: ["Gzip compression is enabled", "Browser caching is properly configured", "Critical CSS is inlined"],
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return null
      }
      console.error("Performance Audit Error:", error)
      return {
        score: 0,
        issues: [{ type: "error", message: "Failed to perform performance analysis", impact: "high" }],
        recommendations: [],
        passed: [],
      }
    }
  }

  // Generate mock broken links audit results
  const generateLinksAuditResults = async (url: string, signal: AbortSignal): Promise<AuditResult | null> => {
    try {
      await simulateNetworkRequest(signal)
      return {
        score: 95,
        issues: [
          {
            type: "error",
            message: `2 broken internal links detected on ${url}`,
            details: "Broken links found on: /tools pointing to /tools/old-formatter, /about pointing to /team",
            impact: "high",
          },
        ],
        recommendations: [
          "Fix or remove broken internal links",
          "Set up proper redirects for changed URLs",
          "Implement a 404 page that guides users back to working content",
        ],
        passed: [
          "All external links are working correctly",
          "No redirect chains detected",
          "Anchor texts are descriptive and relevant",
        ],
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return null
      }
      console.error("Links Audit Error:", error)
      return {
        score: 0,
        issues: [{ type: "error", message: "Failed to perform broken links analysis", impact: "high" }],
        recommendations: [],
        passed: [],
      }
    }
  }

  // Generate mock content uniqueness audit results
  const generateContentAuditResults = async (url: string, signal: AbortSignal): Promise<AuditResult | null> => {
    try {
      await simulateNetworkRequest(signal)
      return {
        score: 88,
        issues: [
          {
            type: "warning",
            message: `Some content sections on ${url} show similarity to other websites`,
            details: "About page content shows 30% similarity to competitor sites",
            impact: "medium",
          },
          {
            type: "info",
            message: `Consider adding more unique value to tool descriptions on ${url}`,
            impact: "low",
          },
        ],
        recommendations: [
          "Rewrite similar content sections to be more unique",
          "Add original insights, examples, or use cases to tool descriptions",
          "Create unique, valuable content that differentiates from competitors",
          "Consider adding case studies or tutorials that showcase your expertise",
        ],
        passed: [
          "Most content is original and unique",
          "Blog posts pass plagiarism checks",
          "Technical documentation is well-written and original",
        ],
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return null
      }
      console.error("Content Audit Error:", error)
      return {
        score: 0,
        issues: [{ type: "error", message: "Failed to perform content analysis", impact: "high" }],
        recommendations: [],
        passed: [],
      }
    }
  }

  // Calculate overall score based on all completed audits
  const calculateOverallScore = () => {
    const results = [seoResults, technicalResults, mobileResults, performanceResults, linksResults, contentResults]
    const completedResults = results.filter(Boolean) as AuditResult[]

    if (completedResults.length === 0) return 0

    const totalScore = completedResults.reduce((sum, result) => sum + result.score, 0)
    return Math.round(totalScore / completedResults.length)
  }

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  // Get badge color based on issue type
  const getIssueBadgeColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get impact text based on impact level
  const getImpactText = (impact: string) => {
    switch (impact) {
      case "high":
        return "High Impact"
      case "medium":
        return "Medium Impact"
      case "low":
        return "Low Impact"
      default:
        return "Unknown Impact"
    }
  }

  // FAQ data
  const faqs = [
    {
      question: "Why is website auditing important for AdSense approval?",
      answer:
        "Google AdSense has strict quality guidelines that websites must meet before being approved. A comprehensive audit helps identify issues that could prevent approval, such as poor user experience, technical problems, mobile compatibility issues, and content uniqueness concerns.",
    },
    {
      question: "How often should I audit my website?",
      answer:
        "For websites actively seeking AdSense approval or maintaining compliance, quarterly audits are recommended. For established sites, conducting an audit every 6 months helps ensure continued compliance and optimal performance.",
    },
    {
      question: "What are the most common issues that prevent AdSense approval?",
      answer:
        "Common issues include insufficient original content, poor navigation, broken functionality, policy-violating content, poor mobile experience, and technical issues that affect user experience. Our audit tool helps identify these issues before you apply.",
    },
    {
      question: "How can I fix content uniqueness issues?",
      answer:
        "To fix content uniqueness issues, rewrite similar content in your own words, add original insights or examples, create unique media like images or videos, and focus on providing value that differentiates your content from competitors.",
    },
    {
      question: "Does mobile responsiveness affect AdSense approval?",
      answer:
        "Yes, Google places high importance on mobile user experience. Sites that aren't mobile-friendly or have poor mobile performance are less likely to be approved for AdSense, as Google prioritizes good user experience across all devices.",
    },
  ]

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Website Audit Tool</h1>
        <p className="text-muted-foreground">
          Comprehensive website analysis for SEO, performance, mobile responsiveness, and AdSense compliance
        </p>
      </div>

      <AdBanner className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Audit Your Website</CardTitle>
          <CardDescription>
            Enter your website URL to analyze SEO, technical aspects, mobile responsiveness, performance, broken links,
            and content uniqueness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={startAudit} disabled={!isValidUrl || isAuditing} className="sm:w-auto">
                {isAuditing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Auditing...
                  </>
                ) : (
                  <>
                    Start Audit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {isAuditing && (
                <Button variant="destructive" onClick={cancelAudit} className="sm:w-auto">
                  Cancel
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="seo"
                  checked={auditOptions.seo}
                  onCheckedChange={(checked) => setAuditOptions({ ...auditOptions, seo: checked === true })}
                />
                <Label htmlFor="seo" className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  SEO Analysis
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="technical"
                  checked={auditOptions.technical}
                  onCheckedChange={(checked) => setAuditOptions({ ...auditOptions, technical: checked === true })}
                />
                <Label htmlFor="technical" className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Technical Audit
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mobile"
                  checked={auditOptions.mobile}
                  onCheckedChange={(checked) => setAuditOptions({ ...auditOptions, mobile: checked === true })}
                />
                <Label htmlFor="mobile" className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile Responsiveness
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="performance"
                  checked={auditOptions.performance}
                  onCheckedChange={(checked) => setAuditOptions({ ...auditOptions, performance: checked === true })}
                />
                <Label htmlFor="performance" className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Performance Check
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="links"
                  checked={auditOptions.links}
                  onCheckedChange={(checked) => setAuditOptions({ ...auditOptions, links: checked === true })}
                />
                <Label htmlFor="links" className="flex items-center">
                  <Link2 className="h-4 w-4 mr-2" />
                  Broken Links
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="content"
                  checked={auditOptions.content}
                  onCheckedChange={(checked) => setAuditOptions({ ...auditOptions, content: checked === true })}
                />
                <Label htmlFor="content" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Content Uniqueness
                </Label>
              </div>
            </div>
          </div>

          {isAuditing && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentAuditStep}</span>
                <span>{Math.round(auditProgress)}%</span>
              </div>
              <Progress value={auditProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {auditComplete && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Audit Results for {url}</span>
                <span className={`text-2xl font-bold ${getScoreColor(calculateOverallScore())}`}>
                  {calculateOverallScore()}/100
                </span>
              </CardTitle>
              <CardDescription>Overall assessment of your website based on selected audit criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  {seoResults && <TabsTrigger value="seo">SEO</TabsTrigger>}
                  {technicalResults && <TabsTrigger value="technical">Technical</TabsTrigger>}
                  {mobileResults && <TabsTrigger value="mobile">Mobile</TabsTrigger>}
                  {performanceResults && <TabsTrigger value="performance">Performance</TabsTrigger>}
                  {linksResults && <TabsTrigger value="links">Links</TabsTrigger>}
                  {contentResults && <TabsTrigger value="content">Content</TabsTrigger>}
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {seoResults && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex justify-between">
                            <span className="flex items-center">
                              <Search className="h-4 w-4 mr-2" />
                              SEO
                            </span>
                            <span className={getScoreColor(seoResults.score)}>{seoResults.score}/100</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{seoResults.issues.length} issues found</p>
                        </CardContent>
                      </Card>
                    )}

                    {technicalResults && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex justify-between">
                            <span className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              Technical
                            </span>
                            <span className={getScoreColor(technicalResults.score)}>{technicalResults.score}/100</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{technicalResults.issues.length} issues found</p>
                        </CardContent>
                      </Card>
                    )}

                    {mobileResults && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex justify-between">
                            <span className="flex items-center">
                              <Smartphone className="h-4 w-4 mr-2" />
                              Mobile
                            </span>
                            <span className={getScoreColor(mobileResults.score)}>{mobileResults.score}/100</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{mobileResults.issues.length} issues found</p>
                        </CardContent>
                      </Card>
                    )}

                    {performanceResults && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex justify-between">
                            <span className="flex items-center">
                              <Zap className="h-4 w-4 mr-2" />
                              Performance
                            </span>
                            <span className={getScoreColor(performanceResults.score)}>
                              {performanceResults.score}/100
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {performanceResults.issues.length} issues found
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {linksResults && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex justify-between">
                            <span className="flex items-center">
                              <Link2 className="h-4 w-4 mr-2" />
                              Links
                            </span>
                            <span className={getScoreColor(linksResults.score)}>{linksResults.score}/100</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{linksResults.issues.length} issues found</p>
                        </CardContent>
                      </Card>
                    )}

                    {contentResults && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex justify-between">
                            <span className="flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              Content
                            </span>
                            <span className={getScoreColor(contentResults.score)}>{contentResults.score}/100</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{contentResults.issues.length} issues found</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Critical Issues</h3>
                    <div className="space-y-2">
                      {[seoResults, technicalResults, mobileResults, performanceResults, linksResults, contentResults]
                        .filter(Boolean)
                        .flatMap((result) => result!.issues.filter((issue) => issue.impact === "high"))
                        .map((issue, index) => (
                          <Alert key={index} variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="ml-2">{issue.message}</AlertTitle>
                            {issue.details && <AlertDescription className="ml-2">{issue.details}</AlertDescription>}
                          </Alert>
                        ))}

                      {[seoResults, technicalResults, mobileResults, performanceResults, linksResults, contentResults]
                        .filter(Boolean)
                        .flatMap((result) => result!.issues.filter((issue) => issue.impact === "high")).length ===
                        0 && (
                        <p className="text-green-500 flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          No critical issues found
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">AdSense Compliance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                          <div
                            className={`h-2.5 rounded-full ${
                              calculateOverallScore() >= 80
                                ? "bg-green-500"
                                : calculateOverallScore() >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${calculateOverallScore()}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{calculateOverallScore()}%</span>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle className="ml-2">AdSense Compliance Status</AlertTitle>
                        <AlertDescription className="ml-2">
                          {calculateOverallScore() >= 80 ? (
                            <span className="text-green-500">
                              Your website is likely ready for AdSense approval. Address any remaining issues to improve
                              your chances.
                            </span>
                          ) : calculateOverallScore() >= 60 ? (
                            <span className="text-yellow-500">
                              Your website needs some improvements before applying for AdSense. Focus on fixing the
                              critical issues first.
                            </span>
                          ) : (
                            <span className="text-red-500">
                              Your website requires significant improvements before it's ready for AdSense. Address all
                              critical and high-impact issues.
                            </span>
                          )}
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </TabsContent>

                {seoResults && (
                  <TabsContent value="seo" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">SEO Analysis</h3>
                      <span className={`text-xl font-bold ${getScoreColor(seoResults.score)}`}>
                        {seoResults.score}/100
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Issues Found</h4>
                      <div className="space-y-3">
                        {seoResults.issues.map((issue, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <Badge className={`${getIssueBadgeColor(issue.type)} mr-2`}>
                                  {issue.type.toUpperCase()}
                                </Badge>
                                <div>
                                  <p className="font-medium">{issue.message}</p>
                                  {issue.details && (
                                    <p className="text-sm text-muted-foreground mt-1">{issue.details}</p>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline">{getImpactText(issue.impact)}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Recommendations</h4>
                      <ul className="space-y-2 list-disc pl-5">
                        {seoResults.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Passed Checks</h4>
                      <ul className="space-y-2">
                        {seoResults.passed.map((pass, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            {pass}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                )}

                {technicalResults && (
                  <TabsContent value="technical" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Technical Audit</h3>
                      <span className={`text-xl font-bold ${getScoreColor(technicalResults.score)}`}>
                        {technicalResults.score}/100
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Issues Found</h4>
                      <div className="space-y-3">
                        {technicalResults.issues.map((issue, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <Badge className={`${getIssueBadgeColor(issue.type)} mr-2`}>
                                  {issue.type.toUpperCase()}
                                </Badge>
                                <div>
                                  <p className="font-medium">{issue.message}</p>
                                  {issue.details && (
                                    <p className="text-sm text-muted-foreground mt-1">{issue.details}</p>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline">{getImpactText(issue.impact)}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Recommendations</h4>
                      <ul className="space-y-2 list-disc pl-5">
                        {technicalResults.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Passed Checks</h4>
                      <ul className="space-y-2">
                        {technicalResults.passed.map((pass, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            {pass}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                )}

                {mobileResults && (
                  <TabsContent value="mobile" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Mobile Responsiveness</h3>
                      <span className={`text-xl font-bold ${getScoreColor(mobileResults.score)}`}>
                        {mobileResults.score}/100
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Issues Found</h4>
                      <div className="space-y-3">
                        {mobileResults.issues.map((issue, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <Badge className={`${getIssueBadgeColor(issue.type)} mr-2`}>
                                  {issue.type.toUpperCase()}
                                </Badge>
                                <div>
                                  <p className="font-medium">{issue.message}</p>
                                  {issue.details && (
                                    <p className="text-sm text-muted-foreground mt-1">{issue.details}</p>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline">{getImpactText(issue.impact)}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Recommendations</h4>
                      <ul className="space-y-2 list-disc pl-5">
                        {mobileResults.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Passed Checks</h4>
                      <ul className="space-y-2">
                        {mobileResults.passed.map((pass, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            {pass}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                )}

                {performanceResults && (
                  <TabsContent value="performance" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Performance Analysis</h3>
                      <span className={`text-xl font-bold ${getScoreColor(performanceResults.score)}`}>
                        {performanceResults.score}/100
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Issues Found</h4>
                      <div className="space-y-3">
                        {performanceResults.issues.map((issue, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <Badge className={`${getIssueBadgeColor(issue.type)} mr-2`}>
                                  {issue.type.toUpperCase()}
                                </Badge>
                                <div>
                                  <p className="font-medium">{issue.message}</p>
                                  {issue.details && (
                                    <p className="text-sm text-muted-foreground mt-1">{issue.details}</p>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline">{getImpactText(issue.impact)}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Recommendations</h4>
                      <ul className="space-y-2 list-disc pl-5">
                        {performanceResults.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Passed Checks</h4>
                      <ul className="space-y-2">
                        {performanceResults.passed.map((pass, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            {pass}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                )}

                {linksResults && (
                  <TabsContent value="links" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Broken Links Check</h3>
                      <span className={`text-xl font-bold ${getScoreColor(linksResults.score)}`}>
                        {linksResults.score}/100
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Issues Found</h4>
                      <div className="space-y-3">
                        {linksResults.issues.map((issue, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <Badge className={`${getIssueBadgeColor(issue.type)} mr-2`}>
                                  {issue.type.toUpperCase()}
                                </Badge>
                                <div>
                                  <p className="font-medium">{issue.message}</p>
                                  {issue.details && (
                                    <p className="text-sm text-muted-foreground mt-1">{issue.details}</p>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline">{getImpactText(issue.impact)}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Recommendations</h4>
                      <ul className="space-y-2 list-disc pl-5">
                        {linksResults.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Passed Checks</h4>
                      <ul className="space-y-2">
                        {linksResults.passed.map((pass, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            {pass}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                )}

                {contentResults && (
                  <TabsContent value="content" className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Content Uniqueness</h3>
                      <span className={`text-xl font-bold ${getScoreColor(contentResults.score)}`}>
                        {contentResults.score}/100
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Issues Found</h4>
                      <div className="space-y-3">
                        {contentResults.issues.map((issue, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start">
                                <Badge className={`${getIssueBadgeColor(issue.type)} mr-2`}>
                                  {issue.type.toUpperCase()}
                                </Badge>
                                <div>
                                  <p className="font-medium">{issue.message}</p>
                                  {issue.details && (
                                    <p className="text-sm text-muted-foreground mt-1">{issue.details}</p>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline">{getImpactText(issue.impact)}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Recommendations</h4>
                      <ul className="space-y-2 list-disc pl-5">
                        {contentResults.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Passed Checks</h4>
                      <ul className="space-y-2">
                        {contentResults.passed.map((pass, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            {pass}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => window.print()}>
                <Copy className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button onClick={startAudit} disabled={isAuditing}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Run Audit Again
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AdSense Compliance Checklist</CardTitle>
              <CardDescription>Key requirements your website must meet for AdSense approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div
                    className={`mt-0.5 mr-2 ${calculateOverallScore() >= 80 ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {calculateOverallScore() >= 80 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">Overall Website Quality</h4>
                    <p className="text-sm text-muted-foreground">
                      Your website should provide value to users with a good user experience, clear navigation, and
                      professional design.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`mt-0.5 mr-2 ${contentResults && contentResults.score >= 80 ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {contentResults && contentResults.score >= 80 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">Original Content</h4>
                    <p className="text-sm text-muted-foreground">
                      Your website must have unique, valuable content that isn't copied from other sources.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`mt-0.5 mr-2 ${mobileResults && mobileResults.score >= 80 ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {mobileResults && mobileResults.score >= 80 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">Mobile Compatibility</h4>
                    <p className="text-sm text-muted-foreground">
                      Your website must be mobile-friendly and provide a good experience on all devices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`mt-0.5 mr-2 ${performanceResults && performanceResults.score >= 70 ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {performanceResults && performanceResults.score >= 70 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">Page Loading Speed</h4>
                    <p className="text-sm text-muted-foreground">
                      Your website should load quickly to provide a good user experience.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className={`mt-0.5 mr-2 ${linksResults && linksResults.score >= 90 ? "text-green-500" : "text-yellow-500"}`}
                  >
                    {linksResults && linksResults.score >= 90 ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">Working Navigation</h4>
                    <p className="text-sm text-muted-foreground">
                      All links on your website should work properly without broken links or errors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-0.5 mr-2 text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Privacy Policy</h4>
                    <p className="text-sm text-muted-foreground">
                      Your website must have a clear privacy policy page that explains how user data is collected and
                      used.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-0.5 mr-2 text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Terms of Service</h4>
                    <p className="text-sm text-muted-foreground">
                      Your website should have terms of service that outline the rules for using your website.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <a
                  href="https://support.google.com/adsense/answer/9724?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  AdSense Program Policies
                </a>
              </Button>
            </CardFooter>
          </Card>
        </>
      )}

      <AdBanner className="my-6" />

      <FAQSection faqs={faqs} />
    </div>
  )
}
