import { Schema, model } from "mongoose";

const CoursesSchema = Schema({
    courseName: {
        type: String,
        required: [true, 'CourseName is required'],
        maxLength: [60, 'cant be overcome 60 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxLength: [80, 'cant be overcome 80 characters']

    },
    publications: [{
        type: Schema.Types.ObjectId,
        ref: 'publications'
    }],
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

export default model('courses', CoursesSchema);