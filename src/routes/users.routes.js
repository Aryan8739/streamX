import { Router } from "express";
import {registerUser  } from "../controllers/users.controllers.js";
import {loginUser  } from "../controllers/users.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js";
import { logoutUser } from "../controllers/users.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {refreshAccessToken } from "../controllers/users.controllers.js";
import {changeCurrentPassword  } from "../controllers/users.controllers.js";
import {getCurrentUser } from "../controllers/users.controllers.js";
import {updateAccountDetails } from "../controllers/users.controllers.js";
import {updateUserAvatar } from "../controllers/users.controllers.js";
import {updateUserCoverImage } from "../controllers/users.controllers.js";
import {getUserChannelProfile } from "../controllers/users.controllers.js";
import {getWatchHistory } from "../controllers/users.controllers.js";


const router = Router()


router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
)

router.route("/login").post(loginUser)


//Secure Routes
router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.router("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile )
router.route("/history").get(verifyJWT,getWatchHistory)


export default router
