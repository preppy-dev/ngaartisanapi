import mongoose from 'mongoose';

const devisSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectID, ref: 'Category' },
    description: { type: String, required: true },
    date: { type: Date },
    adresse: { type: String, required: true },
    contact: { 
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: Number, required: true },
    },
    cniRecto: { type: String, required: false },
    cniVerso: { type: String, required: false },
    status: { type: Boolean, default: false},
  },
  {
    timestamps: true,
  }
);
const Devis = mongoose.model('Devis', devisSchema);

export default Devis;