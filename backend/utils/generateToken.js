// import jwt from 'jsonwebtoken';

// const generateToken = (res, userId, { role }) => {
//   const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
//     expiresIn: '10d', // TODO: move to env variable
//   });
//   res.cookie('auth', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
//     sameSite: 'strict', // Prevent CSRF attacks
//     maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
//   });
// };

// export default generateToken;
