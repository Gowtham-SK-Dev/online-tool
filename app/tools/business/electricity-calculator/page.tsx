import type { Metadata } from "next"
import ElectricityCalculatorClientPage from "./ElectricityCalculatorClientPage"
import { Suspense } from "react"
import Loading from "@/app/loading"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import StructuredData from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Electricity Bill Calculator | Calculate Electricity Charges by Region",
  description:
    "Calculate your electricity bill based on region-specific slab rates, units consumed, and applicable charges with our free online electricity bill calculator.",
  keywords:
    "electricity bill calculator, electricity charges, power bill, utility bill calculator, electricity slab rates, electricity tariff, electricity consumption",
}

const faqs = [
  {
    question: "How does the electricity bill calculator work?",
    answer:
      "Our electricity bill calculator uses region-specific slab rates to calculate your bill. It breaks down your consumption into different slabs, applies the appropriate rate to each slab, adds fixed charges and applicable surcharges, and provides a detailed breakdown of your total bill.",
  },
  {
    question: "Are the electricity rates up-to-date?",
    answer:
      "We strive to keep our rates as current as possible, but electricity tariffs can change. The rates used in this calculator are representative and may not reflect the most recent changes by electricity boards. For the most accurate rates, please check with your local electricity provider.",
  },
  {
    question: "Why does my bill calculation differ from my actual bill?",
    answer:
      "Several factors could cause differences: 1) Our calculator may not include all special charges or subsidies that apply to your connection, 2) The rates might have been updated recently, 3) Your actual meter reading might differ from the units you entered, or 4) There might be additional taxes or arrears included in your actual bill.",
  },
  {
    question: "How are slab rates applied to electricity bills?",
    answer:
      "Slab rates are applied progressively. For example, if a region has slabs of 0-100 units at ₹1/unit and 101-200 units at ₹2/unit, and you consume 150 units, you'll be charged ₹1 for the first 100 units and ₹2 for the remaining 50 units.",
  },
  {
    question: "What are fixed charges in electricity bills?",
    answer:
      "Fixed charges are mandatory fees that you pay regardless of your electricity consumption. These charges typically cover the cost of maintaining the electricity infrastructure, meter reading, billing, and other administrative expenses.",
  },
]

export default function ElectricityCalculatorPage() {
  return (
    <div className="container mx-auto space-y-6">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Electricity Bill Calculator",
          description: "Calculate your electricity bill based on region-specific slab rates and units consumed",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />

      <div className="text-center mb-8">
        <AdBanner className="my-4" />
      </div>

      <Suspense fallback={<Loading />}>
        <ElectricityCalculatorClientPage />
      </Suspense>

      <FAQSection faqs={faqs} />

      <div className="text-center mt-8">
        <AdBanner className="my-4" />
      </div>
    </div>
  )
}
