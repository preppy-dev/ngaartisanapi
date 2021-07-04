import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profil: { type: String, required: false },
    username:{ type: String, required: false },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isModerator: { type: Boolean, default: false, required: true },
    isArtisan: { type: Boolean, default: false, required: true },
    artisan: {
      name: String,
      logo: String,
      description: String,
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model('User', userSchema);
export default User;
