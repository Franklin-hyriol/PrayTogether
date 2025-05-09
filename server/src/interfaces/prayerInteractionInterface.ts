import { Document, Types } from "mongoose";

export default interface IPrayerInteraction extends Document {
    prayerId: Types.ObjectId;
    userId: Types.ObjectId;
    type: "liked" | "prayed";
    createdAt: Date;
    updatedAt: Date;
}