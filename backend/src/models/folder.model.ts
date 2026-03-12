import mongoose, { Schema, Document } from "mongoose";

export interface IFolder extends Document {
    name: string;
    userId: mongoose.Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date | null;
}

const folderSchema = new Schema<IFolder>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Folder = mongoose.model<IFolder>("Folder", folderSchema);

export default Folder;