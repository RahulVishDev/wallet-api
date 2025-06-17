import {neon} from "@neondatabase/serverless"
import "dotenv/config";

// Cerates a SqL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL)