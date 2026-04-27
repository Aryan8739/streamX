import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { OTP } from "../models/otp.models.js";



const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()


    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }





  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens ")


  }
}

const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Cap on resends (e.g., max 3 OTPs per email in the 5-min window)
  const otpCount = await OTP.countDocuments({ email });
  if (otpCount >= 3) {
    throw new ApiError(429, "Too many OTP requests. Please wait a few minutes before trying again.");
  }

  // Generate OTP
  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // Check uniqueness of OTP (optional but good)
  let result = await OTP.findOne({ otp: otp });
  while (result) {
    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
    });
    result = await OTP.findOne({ otp: otp });
  }

  const otpPayload = { email, otp };
  const otpBody = await OTP.create(otpPayload);

  return res.status(200).json(
    new ApiResponse(200, { email }, "OTP sent successfully")
  );
});

const registerUser = asyncHandler(async (req, res) => {

  const { fullName, email, username, password, otp } = req.body || {};
  console.log("email:", email);

  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  // Verify OTP
  const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
  if (response.length === 0 || otp !== response[0].otp) {
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    if (avatarLocalPath) fs.unlinkSync(avatarLocalPath);
    if (coverImageLocalPath) fs.unlinkSync(coverImageLocalPath);
    throw new ApiError(400, "Invalid OTP");
  }

  // Validation (Move file paths up for cleanup)
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if (
    [fullName, email, username, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    if (avatarLocalPath) fs.unlinkSync(avatarLocalPath);
    if (coverImageLocalPath) fs.unlinkSync(coverImageLocalPath);
    throw new ApiError(400, "All fields are required");
  }

  //  Check existing user
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    if (avatarLocalPath) fs.unlinkSync(avatarLocalPath);
    if (coverImageLocalPath) fs.unlinkSync(coverImageLocalPath);
    throw new ApiError(409, "User with email or username already exists");
  }


  //  Safe file access


  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  console.log("Avatar path:", avatarLocalPath);
  //  Upload to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  //  Create user (FIXED secure_url)
  const user = await User.create({
    fullname: fullName,
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //  Remove sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering user!!"
    );
  }

  //  Response
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully!!")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //pass check
  //access nd refresh token
  //send cookie
  //send response

  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User doesnot Exist")
  }

  const isPasswordValid = await user.isPasswordValid(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password Incorrect")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

  const loggedinUser = await User.findById(user._id).
    select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinUser, accessToken, refreshToken
        },
        "User Loged in Successfully"
      )
    )


})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }
  return res

    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, "User Logged Out")
    )





})


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  )

  const user = await User.findById(decodedToken?._id)

  if (!user) {
    throw new ApiError(401, "invalid refreshToken")
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token expired or used")

  }
  const options = {
    httpOnly: true,
    secure: true
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "accessToken Refreshed Successfully"
      )
    )

})



const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user?._id)
  const isPasswordValid = await user.isPasswordValid(oldPassword)

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"))
})



const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched Successfully"))

})

const updateAccountDetails = asyncHandler(async (req, res) => {
  // update fields
  const { fullName, email } = req.body

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required")

  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email
      }

    },
    { new: true }

  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "AccountDetails updated Successfully"))


})

const updateUserAvatar = asyncHandler(async (req, res) => {

  // get file path
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is missing")

  }

  // upload new avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar.url) {


    throw new ApiError(400, "Error while uploading avatar file")

  }

  // update in db
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    { new: true }

  ).select("-password")

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Avatar Updated")
    )





})





const updateUserCoverImage = asyncHandler(async (req, res) => {

  // get file path
  const coverImageLocalPath = req.file?.path

  if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage File is missing")

  }

  // upload to cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!coverImage.url) {


    throw new ApiError(400, "Error while uploading coverImage file")

  }

  // update cover image in db
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    { new: true }

  ).select("-password")

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Cover image Updated")
    )
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
  // get username from params
  const { username } = req.params

  if (!username?.trim()) {
    throw new ApiError(400, "Username missing")

  }

  // aggregate channel data
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase()
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers"
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo"
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1
      }

    }
  ])

  if (!channel?.length) {
    throw new ApiError(400, "channel doesnt exist")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User Channel fetched Successfully")
    )
})

const getWatchHistory = asyncHandler(async (req, res) => {
  // watch history aggregation
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              owner: {
                $first: "$owner"
              }
            }
          }
        ]
      }
    }
  ])

  return res
    .status(200)
    .json(
      new ApiResponse(200,
        (user[0]?.watchHistory || []).reverse(),
        "watchHistory fetched Successfully")
    )
})

const clearWatchHistory = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        watchHistory: []
      }
    },
    { new: true }
  )

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Watch history cleared successfully"))
})

const getWatchLater = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "watchLater",
    populate: {
      path: "owner",
      select: "username fullname avatar"
    }
  })

  return res
    .status(200)
    .json(new ApiResponse(200, user.watchLater || [], "Watch later videos fetched"))
})

const toggleWatchLater = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  
  const user = await User.findById(req.user._id)
  const index = user.watchLater.indexOf(videoId)

  if (index === -1) {
    user.watchLater.push(videoId)
  } else {
    user.watchLater.splice(index, 1)
  }

  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, { isWatchLater: index === -1 }, "Watch later toggled"))
})

export {
  registerUser,
  sendOTP,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  clearWatchHistory,
  getWatchLater,
  toggleWatchLater
};
