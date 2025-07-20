
import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 6587
export const MONGOURI = process.env.MONGO_URI

// Node Mailer configuration
export const SMTP_USER = process.env.SMTP_USER
export const SMTP_PASS = process.env.SMTP_PASS