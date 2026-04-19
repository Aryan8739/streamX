import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
    // just a simple health check
    return res
        .status(200)
        .json(new ApiResponse(200, { status: "OK" }, "Health check passed"));
});

export { healthcheck };
