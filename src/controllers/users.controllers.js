import {asyncHandler} from "../Backend/src/utils/asyncHandler.js"


const registerUser = asyncHandler(async (req,res)=> {
  res.status(200).json({
    message: "ok"
  })
}) 

export {registerUser}
