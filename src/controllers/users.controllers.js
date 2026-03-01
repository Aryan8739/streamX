import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from '../models/user.models.js';
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

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

  if (
    [fullName,email,username,password].some((field)=>
    field?.trim()=="") 
  ) {
    throw new ApiError(400,"All fields are required")
  }

  const exisedUser = User.findOne({
    $or: [{ username }, { email }]
  }) 
  
  if (exisedUser){
    throw new ApiError(409, "User with email or username")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file is required")  
  }

  
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if(!avatar){
    throw new ApiError(400,"Avatar file required")

  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username : username.toLowerCase();
    
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering user!!")
 
  }
  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Sucessfully!!")
  )

}) 


 /*if(fullName === ""){
    throw new ApiError(400,"fullName is required")
  } 
*/ 


export {registerUser}
