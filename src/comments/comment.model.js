import { Schema, model } from "mongoose";

const CommentsSchema = Schema({
    nameUser: {
        type: String,
        required: [true, 'the username is required'],
        maxLength: [30, 'cant be overcome 30 characters']
    },
    comment: {
        type: String,
        required: [true, 'comment is required'],
        maxLength: [150, 'cant be overcome 150 characters']
    },
    publication: {
        type: Schema.Types.ObjectId,
        required: [true, 'publication is required'],
        ref: "publications"
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('comments', CommentsSchema);