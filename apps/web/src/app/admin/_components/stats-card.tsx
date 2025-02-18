import { prisma } from "@plai/db"
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/admin/ui/card"
import { cache } from "~/lib/cache"

const getStats = cache(async () => {
  try {
    return await prisma.$transaction([
      prisma.tool.count(),
      prisma.category.count(),
    ])
  } catch (error) {
    console.error('Error fetching stats:', error)
    return [0, 0]
  }
}, ["stats"])

export const StatsCard = async () => {
  const stats = await getStats()

  const statsLabels = {
    0: "Tools",
    1: "Categories",
  }

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardDescription>{statsLabels[index as keyof typeof statsLabels]}</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{stat.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
