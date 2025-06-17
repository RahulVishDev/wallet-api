import ratelimitInstance from "../config/upstash.js";

const rateLimit =  async(req, res, next) => {
    try{
        //here we just kept it simple.
        //In a real world app you hade like to put the userid or ipAddress as your key 
        const { success } = await ratelimitInstance.limit("my-rate-limit");
        if(!success){
            return res.status(429).json({
                message:"To many request, Please try again later.",
            });
        }
        next();

    }catch(error){
        console.log("Rate Limit Error",error)
    }

};
export default rateLimit;