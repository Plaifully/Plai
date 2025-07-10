import { describe, expect, it } from "bun:test"
import { getRepository, getRepositoryString, calculateHealthScore } from "../src/utils"

describe("getRepository", () => {
  it("parses owner and repo from full url", () => {
    expect(getRepository("https://github.com/foo/bar")).toEqual({
      owner: "foo",
      name: "bar",
    })
  })

  it("returns null for invalid url", () => {
    expect(getRepository("not a url")).toBeNull()
  })
})

describe("getRepositoryString", () => {
  it("returns owner/name for valid url", () => {
    expect(getRepositoryString("github.com/foo/bar")).toBe("foo/bar")
  })

  it("returns null for invalid input", () => {
    expect(getRepositoryString("invalid")).toBeNull()
  })
})

describe("calculateHealthScore", () => {
  it("calculates a consistent score", () => {
    const now = new Date()
    const score = calculateHealthScore({
      stars: 10,
      forks: 5,
      contributors: 2,
      watchers: 4,
      createdAt: now,
      pushedAt: now,
    })
    expect(score).toBe(6)
  })
})
