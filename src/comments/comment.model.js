import { Schema, model } from "mongoose";

const CommentsSchema = Schema({
    nameUser: {
        type: String,
        maxLength: [30, 'cant be overcome 30 characters'],
        set: function(name) {
            return !name || name.trim() === '' ? 'Anónimo' : name;
        }
    },
    comment: {
        type: String,
        required: [true, 'comment is required'],
        maxLength: [150, 'cant be overcome 150 characters']
    },
    publication: {
        type: Schema.Types.ObjectId,
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