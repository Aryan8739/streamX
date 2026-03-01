import {asyncHandler} from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req,res)=> {
  //get user detail from frontend
  //validation - not empty
  //check if already exist username,email
  //check for images , for avtar
  //upload them to cloudinary
  //check in cloudinary
  //create user object - create entry in db
  //remove pass and refresh token from res
  //check for user
  //return res



  const{fullName,email,username,password}= req.body
  console.log("email",email);
}) 

export {registerUser}
