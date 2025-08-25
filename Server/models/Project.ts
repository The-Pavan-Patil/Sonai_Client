import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: { 
        type: String,

     },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
        default: 'Not Started',
    },
    Workers: {
        type: Number,
    },
    budget: {
        type: Number,
        min: 0,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Company',
        required: true,
    },
    location: {
        type: String,

    }
}, { timestamps: true });