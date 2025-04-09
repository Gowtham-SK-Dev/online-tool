import { cn } from "@/lib/utils"

interface AdBannerProps {
  className?: string
  slot?: string
  format?: "auto" | "horizontal" | "vertical" | "rectangle"
}

export default function AdBanner({ className, slot = "default", format = "auto" }: AdBannerProps) {
  // Map format to AdSense format
  const formatMap = {
    auto: "auto",
    horizontal: "horizontal",
    vertical: "vertical",
    rectangle: "rectangle",
  }

  return (
    <div className={cn("ad-container text-center my-4", className)}>
      <p className="text-xs text-muted-foreground mb-1">Advertisement</p>
      <div
        className="bg-muted/30 border border-dashed border-muted-foreground/20 rounded-md p-4 flex items-center justify-center"
        style={{
          minHeight:
            format === "horizontal"
              ? "90px"
              : format === "vertical"
                ? "600px"
                : format === "rectangle"
                  ? "250px"
                  : "100px",
          width: "100%",
        }}
        aria-label="Advertisement"
        role="complementary"
      >
        <p className="text-sm text-muted-foreground">Advertisement - Your AdSense Ad Will Appear Here</p>

        {/* Uncomment this when your AdSense account is approved */}
        {/* 
        <ins 
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={formatMap[format]}
          data-full-width-responsive="true"
        ></ins>
        <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }} />
        */}
      </div>
    </div>
  )
}
