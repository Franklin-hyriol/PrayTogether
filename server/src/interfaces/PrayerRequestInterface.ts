import { Document, Types } from "mongoose";

export default interface IPrayerRequest extends Document {
    authorId: Types.ObjectId; // Référence à l'utilisateur
    text: string;
    isUrgent: boolean;

    likedBy: Types.ObjectId[]; // Utilisateurs qui ont mis un "j'aime"
    prayedBy: Types.ObjectId[]; // Utilisateurs qui prient pour cette demande

    createdAt: Date;
    updatedAt: Date;
}