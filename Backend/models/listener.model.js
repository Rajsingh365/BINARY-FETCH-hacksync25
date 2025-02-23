import mongoose from "mongoose";

const listenerSchema = new mongoose.Schema({}, { timestamps: true });

export default mongoose.model("Listener", listenerSchema);
