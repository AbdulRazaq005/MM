import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import NodeCache from "node-cache";
export const cache = new NodeCache({ stdTTL: 900 });
// import { cache } from "../../index.js";

// Simple middleware for handling exceptions inside of async express routes
// and passing them to your express error handlers. Avoiding .then.catch and try-catch blocks.

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.auth;

  if (token) {
    try {
      const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
      let user = await fetchCachedUserById(decodedObj.userId);
      if (user) {
        req.user = user;
        next();
      } else {
        throw new Error("Unauthorized, invalid user.");
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Unauthorized, token authentication failed.");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized, please login.");
  }
});

async function fetchCachedUserById(userId) {
  // let user = cache.get(userId);
  // if (user) {
  //   // console.log("Found cached user: ", user.name);
  //   return user;
  // }
  // user = await User.findById(userId).select("-password");
  // if (user) {
  //   cache.set(userId, user);
  //   // console.log("Caching user for 900 seconds: ", user);
  // }
  // return user;

  return User.findById(userId).select("-password");
}

export { protect };
