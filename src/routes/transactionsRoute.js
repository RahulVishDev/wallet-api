import express from "express"
//import {sql} from "../config/db.js";
import {createTransaction, getTransactionByUserId, transactionSummary,deleteTransaction} from "../controlers/transactionController.js"
const router = express.Router()
router.get("/:userId",getTransactionByUserId);
router.post("/", createTransaction)

router.delete("/:id",deleteTransaction)

router.get("/summary/:userId", transactionSummary)
export default router