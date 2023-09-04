import mongoose from 'mongoose';
import { UserRole } from '../utils/enums';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole)
    },
    email: {
      type: String,
      unique: true,
    },
    contact: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
// userSchema.methods.hashPassword = async function (password) {
//   const salt = await bcrypt.genSalt(10);
//   return await bcrypt.hash(password, salt);
// };

// Match user entered password to hashed password in database
// userSchema.methods.verifyPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Encrypt password using bcrypt
// userSchema.pre('save', async function (next) { // schema.Pre is a middleware
//   if (!this.isModified('password')) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = bcrypt.hash(this.password, salt);
// });

const User = mongoose.model('User', userSchema);

export default User;
