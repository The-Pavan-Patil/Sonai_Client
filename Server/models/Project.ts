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
    duration : {
        type: Number,
        min: 0,
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

    },
    images: [{
        type : String, required : true
    }],
    services: [{
        type : String , required : true 
    }],
}, { timestamps: true });