import mongoose from "mongoose";

const orderSchema = mongoose.Schema({});

export default new mongoose.model("Order", orderSchema);
