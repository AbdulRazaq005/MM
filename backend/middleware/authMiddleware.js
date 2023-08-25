import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler'; // Simple middleware for handling exceptions inside of async express routes 
 // and passing them to your express error handlers. Avoiding .then.catch and try-catch blocks.

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.auth;

  if (token) {
    try {
      const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decodedObj.userId).select('-password');
      next();
    } 
    catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Unauthorized, token authentication failed.');
    }
  } else {
    res.status(401);
    throw new Error('Unauthorized, please login.');
  }
});

export { protect };
