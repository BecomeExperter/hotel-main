import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    totalRevenue: {
        type: Number,
        required: true,
        default: 0,
    },
});

const Report = mongoose.model('report', ReportSchema);

export default Report;
