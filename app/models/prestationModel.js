import mongoose from 'mongoose';

const typeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const prestationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectID, ref: 'Category' },
    description: { type: String, required: true },
    types: [typeSchema],
  },
  {
    timestamps: true,
  }
);
const Prestation = mongoose.model('Prestation', prestationSchema);

export default Prestation;
