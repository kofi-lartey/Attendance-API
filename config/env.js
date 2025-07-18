
import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 6587
export const MONGOURI = process.env.MONGO_URI