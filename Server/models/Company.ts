import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    description : {
        type: String,
        
    },
    address: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
    },
    website: {
        type: String,
    },
    testimonial: {
        type: String,
    },
})
const Company = mongoose.model('Company', companySchema)
export default Company;