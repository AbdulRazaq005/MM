import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function verifyPassword(enteredPassword, passwordHash){
    return await bcrypt.compare(enteredPassword, passwordHash);
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const generateToken = (res, userId, { role }) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
      expiresIn: '10d', // TODO: move to env variable
    });
    res.cookie('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });
};

export { verifyPassword, hashPassword, generateToken };