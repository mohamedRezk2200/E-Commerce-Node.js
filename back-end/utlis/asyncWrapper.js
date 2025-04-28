export default function asyncWrapper(request){
    return async(req,res,next)=>{
        try{
        await request(req,res,next)}
        catch(err){
           return next(err)
        }
    }
}