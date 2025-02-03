import { env } from "~/env"

/**
 * Check if the email is allowed to access the admin panel
 * @param email - The email to check
 * @returns - True if the email is allowed, false otherwise
 */
export const isAllowedEmail = (email?: string | null): boolean => {
  // If no email is provided, do not allow
  if (!email) return false

  // If no allowed emails are set, deny all
  if (!env.AUTH_ALLOWED_EMAILS) return false

  // Clean up the allowed emails
  const allowedEmails = env.AUTH_ALLOWED_EMAILS.split(",").map(e => e.trim())

  // Allow specified domains (starting with @) or exact email matches
  return allowedEmails.some(e => 
    e.startsWith("@") ? email.endsWith(e) : email === e
  )
}
