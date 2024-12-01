import mongoose from 'mongoose';

const ServiceBookSchema = mongoose.Schema(
    {
        RoomBook: {
            type: String, // Mã phòng
            required: true, // Bắt buộc
        },
        dateOfBook: {
            type: String, // Ngày đặt, có thể giữ nguyên
            required: true,
        },
        LoaiService: {
            type: String,
            enum: ['Nha Hang', 'Spa'],
            required: true,
        },
        timeOfBook: {
            type: String, // Thêm trường thời gian đặt
            required: true, // Bắt buộc
        },
        status: {
            type: String,
            enum: ['Accept', 'UnAccept'],
            default: 'Accept',
        },
    },
    {
        timestamps: true, // Thêm timestamp để quản lý thời gian
    },
);

const ServiceBook = mongoose.model('ServiceBook', ServiceBookSchema);
export default ServiceBook;