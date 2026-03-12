import mongoose, { Schema, Document } from "mongoose";

export interface IPage extends Document {
    title: string;
    slug: string;
    content: any;
    status: "draft" | "published";
    icon?: string;
    coverImage?: string;
    userId: mongoose.Types.ObjectId;
    folderId?: mongoose.Types.ObjectId | null;
    isDeleted: boolean;
    deletedAt?: Date | null;
}

const pageSchema = new Schema<IPage>(
    {
        title: {
            type: String,
            default: "Untitled",
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: Schema.Types.Mixed,
            default: {},
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },

        icon: {
            type: String,
        },

        coverImage: {
            type: String,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        folderId: {
            type: Schema.Types.ObjectId,
            ref: "Folder",
            default: null,
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

pageSchema.index({ userId: 1, slug: 1 }, { unique: true });

const Page = mongoose.model<IPage>("Page", pageSchema);

export default Page;