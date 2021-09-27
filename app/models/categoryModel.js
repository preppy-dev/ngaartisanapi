import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    link: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model('Category', categorySchema);

export default Category;

/* prestations: [
  { 
    type: mongoose.Schema.Types.ObjectID, ref: 'Prestation' 
  }
], */