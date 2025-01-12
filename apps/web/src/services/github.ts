import { createGithubClient } from "@plai/github"
import { env } from "~/env"

export const githubClient = createGithubClient(env.GITHUB_TOKEN)
