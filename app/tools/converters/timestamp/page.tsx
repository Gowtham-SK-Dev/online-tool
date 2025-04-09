import type { Metadata } from "next"
import TimestampConverterClientPage from "./TimestampConverterClientPage"

export const metadata: Metadata = {
  title: "Unix Timestamp Converter - DevTools",
  description: "Convert between Unix timestamps and human-readable dates with this free online tool.",
  keywords: "unix timestamp, epoch time, timestamp converter, date to timestamp, timestamp to date, online converter",
}

export default function TimestampConverterPage() {
  return <TimestampConverterClientPage />
}
