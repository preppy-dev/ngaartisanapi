import mongoose from 'mongoose';


const orderSchema = new mongoose.Schema(
  {
    orderItem: {
        name: { type: String, required: true },
        type: { type: String, required: false },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        prestation: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Prestation',
          required: true,
        },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
          required: true,
        },
      },
    
    interventionAddress: {
      adresse: { type: String, required: true },
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: Number, required: true },
      details: { type: String, required: false },
    },
    interventionDate: { type: Date },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemPrice: { type: Number, required: true },
    interventionPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDone: { type: Boolean, default: false },
    isDoneAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model('Order', orderSchema);

export default Order;
