import mongoose from "mongoose"
import { Video } from "../models/video.models.js"
import { Subscription } from "../models/subscription.models.js"
import { Like } from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // get channel id from user
    const channelId = req.user?._id;

    const stats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" }
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
                totalVideos: { $count: {} },
                totalLikes: { $sum: "$likesCount" }
            }
        }
    ]);

    // get total subscribers
    const subscribersCount = await Subscription.countDocuments({
        channel: channelId
    });

    const channelStats = {
        totalViews: stats[0]?.totalViews || 0,
        totalVideos: stats[0]?.totalVideos || 0,
        totalLikes: stats[0]?.totalLikes || 0,
        totalSubscribers: subscribersCount || 0
    };

    return res
        .status(200)
        .json(new ApiResponse(200, channelStats, "Channel stats fetched successfully"));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // get channel id
    const channelId = req.user?._id;

    const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
})

export {
    getChannelStats,
    getChannelVideos
}
