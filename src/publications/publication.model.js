import { Schema, model } from "mongoose";

const PublicationSchema = Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxLength: [50, 'cant be overcome 50 characters']
    },
    descriptionoftheactivity: {
        type: String,
        required: [true, "Description of the activity is required"],
        maxLength: [150, 'cant be overcome 150 characters']
    },
    associatedcourse: {
        type: Schema.Types.ObjectId,
        required: [true, "Associated course is required"],
        ref: "courses"
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

export default model('publications', PublicationSchema);