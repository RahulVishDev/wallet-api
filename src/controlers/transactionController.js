import { sql } from '@vercel/postgres';


export async function getTransactionByUserId(req,res){
    
    try{
        const {userId} = req.params;

        const result = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;
        console.log(result.rows[0]);
        res.status(200).json(result.rows);
        }catch(error){
            console.log("Error getting the transactions", error);
            res.status(500).json({message:"Internal server error"});
    }
    
}

export async function createTransaction (req, res){
    try{
        const {title, amount,category,user_id} = req.body
        if(!title || !user_id ||!category || amount === undefined){
            return res.status(400).json({message:"All field are required"});
        }
        const result = await sql `
        INSERT INTO transactions(user_id,title,amount,category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *
        `;
        console.log(result.rows[0]);
        res.status(201).json(result.rows[0]);
    }catch(error){
        console.log("Error creating the transaction",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export async function deleteTransaction(req,res){
    try{
        const {id} = req.params;
        if(isNaN(parseInt(id))){
            return res.status(400).json({message:"Invalid Transaction Id"});
        }
        const result = await sql`
        DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;
        if(result.rows.length === 0){
            return res.status(404).json({message:"Transaction not found"});
        }
        res.status(200).json({message: "Transaction deleted successfully"});
    }catch(error){
        console.log("Error deleting in the transaction",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function transactionSummary(req,res){
    try{
        const {userId} = req.params;
        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
        `
        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) as income FROM transactions
        WHERE user_id = ${userId} AND amount >0
        `
        const expencesResult = await sql`
        SELECT COALESCE (SUM(amount),0) as expences FROM transactions
        WHERE user_id = ${userId} AND amount < 0
        `
        res.status(200).json({
            balance: balanceResult.rows[0].balance,
            income:incomeResult.rows[0].income,
            expences:expencesResult.rows[0].expences,
        })

    }catch(error){
        console.log("Error in getting the summary",error);
        res.status(500).json({message:"Internal server error"});
    }
}