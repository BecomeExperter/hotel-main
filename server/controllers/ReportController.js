import moment from 'moment';
import Bill from '../models/Bill';
import Report from '../models/Report';

const createReportsModal = async (req, res) => {
    const { month, year } = req.params;

    try {
        if (!month || !year) throw new Error('Missing month or year parameter');

        // Tạo chuỗi date để so sánh với ngày bắt đầu và ngày kết thúc của tháng
        const targetMonthYear = moment(`${year}-${month}`, 'YYYY-MM'); // Chuyển thành đối tượng moment

        const startOfMonth = targetMonthYear.startOf('month'); // Ngày đầu tháng
        const endOfMonth = targetMonthYear.endOf('month'); // Ngày cuối tháng

        // Lấy các Bill trong khoảng thời gian cần báo cáo
        const bills = await Bill.find({
            dateOfPayment: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() },
        });

        let totalRevenue = 0;

        // Cộng dồn tổng tiền từ các Bill
        bills.forEach((bill) => {
            totalRevenue += parseFloat(bill.totalAmount);
        });

        // Kiểm tra nếu báo cáo cho tháng và năm này đã tồn tại
        const existingReport = await Report.findOne({ month, year });

        if (existingReport) {
            existingReport.totalRevenue = totalRevenue;
            await existingReport.save();

            return res.status(200).json({
                success: true,
                message: 'Update report successfully',
                data: existingReport,
            });
        }

        // Nếu báo cáo chưa tồn tại, tạo mới
        const newReport = new Report({
            month,
            year,
            totalRevenue,
        });

        await newReport.save();

        return res.status(200).json({
            success: true,
            message: 'Create report successfully',
            data: newReport,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

export { createReportsModal };
