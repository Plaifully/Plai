import type { ComponentProps } from "react"
import wretch from "wretch"
import { AnalyticsChart, type AnalyticsChartData } from "~/app/admin/_components/analytics-chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/admin/ui/card"
import { env } from "~/env"
import { cache } from "~/lib/cache"

type AnalyticsData = {
  results: AnalyticsChartData[]
  totalVisitors: number
  averageVisitors: number
}

const getAnalytics = cache(
  async (): Promise<AnalyticsData | null> => {
    const host = env.NEXT_PUBLIC_PLAUSIBLE_HOST
    const apiKey = env.PLAUSIBLE_API_KEY
    const domain = env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

    if (!host || !apiKey || !domain) {
      return null
    }

    const api = wretch(`${host}/api/v1`)
      .auth(`Bearer ${apiKey}`)
      .options({ cache: "no-store" })
      .errorType("json")

    const queryOptions = new URLSearchParams({
      metrics: "visitors",
      period: "30d",
      site_id: domain,
    })

    const { results } = await api
      .get(`/stats/timeseries?${queryOptions.toString()}`)
      .json<{ results: AnalyticsChartData[] }>()
    
    const totalVisitors = results.reduce((acc, curr) => acc + curr.visitors, 0)
    const averageVisitors = Math.round(totalVisitors / results.length)

    return { results, totalVisitors, averageVisitors }
  },
  ["analytics"],
  { revalidate: 60 * 60 },
)

const AnalyticsCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const analytics = await getAnalytics()

  if (!analytics) {
    return <Card {...props}>
      <CardHeader>
        <CardDescription>Analytics not configured</CardDescription>
      </CardHeader>
    </Card>
  }

  const { results, totalVisitors, averageVisitors } = analytics

  return (
    <Card {...props}>
      <CardHeader>
        <CardDescription>Visitors</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{totalVisitors.toLocaleString()}</CardTitle>
      </CardHeader>

      <CardContent>
        <AnalyticsChart data={results} average={averageVisitors} className="h-56 w-full" />
      </CardContent>
    </Card>
  )
}

export { AnalyticsCard }
