import ServiceBook from "../models/ServiceBook.js"; // Đảm bảo đúng đường dẫn tới model

// Lấy toàn bộ danh sách service và sắp xếp theo thời gian (ngày đặt)
export const getService = async (req, res) => {
    try {
        const services = await ServiceBook.find().sort({ dateOfBook: -1 }); // Sắp xếp giảm dần theo ngày đặt
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy service theo id
export const getServiceById = async (req, res) => {
    try {
        const service = await ServiceBook.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteService = async (req, res) => {
    const { id } = req.params; // Lấy ID từ tham số URL

    try {
        const deletedService = await ServiceBook.findByIdAndDelete(id); // Tìm và xóa dịch vụ

        if (!deletedService) {
            return res.status(404).json({ message: 'Dịch vụ không tồn tại' });
        }

        res.status(200).json({ message: 'Dịch vụ đã được xóa' });
    } catch (error) {
        console.error('Lỗi khi xóa dịch vụ:', error); // Log lỗi ra console
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa dịch vụ' });
    }
};

// Lấy danh sách service theo userId và sắp xếp theo thời gian
export const getServiceByUserId = async (req, res) => {
    try {
        const services = await ServiceBook.find({ RoomBook: req.params.id }).sort({ dateOfBook: -1 });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tạo mới service
export const createService = async (req, res) => {
    const { RoomBook, dateOfBook, LoaiService, timeOfBook, status } = req.body; // Thêm timeOfBook

    const newService = new ServiceBook({
        RoomBook,
        dateOfBook,
        LoaiService,
        timeOfBook, // Thêm trường timeOfBook
        status
    });

    try {
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};