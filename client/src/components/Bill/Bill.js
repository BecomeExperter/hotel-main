import { useEffect, useRef, useState } from 'react';
import FormatPrice from '../FormatPrice/FormatPrice';
import './Bill.scss';
import { putUpdateBooking } from '../../services/apiServices';

function Bill({ billData, setBillData }) {
    const ref = useRef();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const padTo2Digits = (num) => num.toString().padStart(2, '0');

    const formatDate = (date) => {
        return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join('/');
    };

    const calcDateDiff = (startDate, endDate) => (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;

    const handlePayment = async () => {
        setLoading(true);
        try {
            const amount = billData.totalAmount;
            const response = await fetch('http://localhost:5000/api/payment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    orderId: billData.booking._id,
                    orderInfo: `Thanh toán hóa đơn cho phòng ${billData.roomNumber}`,
                    redirectUrl: 'http://localhost:3000/payment-success', // URL người dùng được chuyển đến sau khi thanh toán thành công
                    ipnUrl: 'http://localhost:5000/api/payment/callback', // URL callback khi thanh toán xong
                }),
            });

            const data = await response.json();
            if (data.paymentUrl) {
                // Mở URL thanh toán trên tab mới
                window.open(data.paymentUrl, '_blank');
            } else {
                console.error('Thanh toán không thành công');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API MoMo:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handlePaymentCallback = (event) => {
            console.log('Dữ liệu callback từ MoMo:', event.data);

            const allowedOrigins = ['https://test-payment.momo.vn', 'http://localhost:3000'];
            if (!allowedOrigins.includes(event.origin)) {
                console.log('Không phải từ MoMo hoặc localhost', event.origin);
                return;
            }

            const { resultCode, orderId, message } = event.data.payload || event.data;

            console.log('ResultCode:', resultCode);

            if (resultCode === '0') {
                setBillData((prev) => ({
                    ...prev,
                    booking: {
                        ...prev.booking,
                        status: 'Paid',
                    },
                }));

                const dataBooking = {
                    status: 'Paid',
                };

                putUpdateBooking(orderId, dataBooking)
                    .then((response) => {
                        if (response.data.success) {
                            console.log('Cập nhật trạng thái thanh toán thành công');
                        } else {
                            console.error('Không thể cập nhật trạng thái thanh toán');
                        }
                    })
                    .catch((error) => {
                        console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
                    });
            } else {
                console.error('Thanh toán thất bại', message);
            }
        };

        window.addEventListener('message', handlePaymentCallback);

        return () => {
            window.removeEventListener('message', handlePaymentCallback);
        };
    }, []);

    return (
        <div ref={ref} className="booking-bill-container">
            <table className="table table-bordered table-hover">
                <thead>
                    <tr className="table-dark">
                        <th scope="col" colSpan="6" className="text-center">
                            Hóa đơn thanh toán
                        </th>
                    </tr>
                    <tr>
                        <th scope="col" colSpan="6">
                            <div className="d-flex table-row-header-custom">
                                <div className="w-50">
                                    Khách hàng/Cơ quan: {billData?.customer?.name || billData?.customer?.Name}
                                </div>
                                <div className="w-50">Địa chỉ: {billData?.address}</div>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th scope="col" colSpan="6">
                            <div className="d-flex table-row-header-custom">
                                <div className="w-50">
                                    Ngày thanh toán: {formatDate(new Date(billData?.dateOfPayment))}
                                </div>
                                <div className="w-50">
                                    Trị giá: <FormatPrice>{billData?.totalAmount}</FormatPrice> VND
                                </div>
                            </div>
                        </th>
                    </tr>
                    <tr className="table-dark">
                        <th scope="col" className="text-center">STT</th>
                        <th scope="col" className="text-center">Phòng</th>
                        <th scope="col" className="text-center">Số ngày thuê</th>
                        <th scope="col" className="text-center">Đơn giá</th>
                        <th scope="col" className="text-center">Thành tiền</th>
                        <th scope="col" className="text-center">Thanh toán</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th className="text-center" scope="row">1</th>
                        <th className="text-center">{billData?.roomNumber}</th>
                        <th className="text-center">
                            {billData?.checkInDate && billData?.checkOutDate
                                ? calcDateDiff(new Date(billData.checkInDate), new Date(billData.checkOutDate))
                                : ''}
                        </th>
                        <th className="text-center">
                            <FormatPrice>{billData?.roomPrice}</FormatPrice>
                        </th>
                        <th className="text-center">
                            <FormatPrice>{billData?.totalAmount}</FormatPrice>
                        </th>
                        <th className="text-center">
                            <button className="btn btn-primary" onClick={handlePayment} disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Thanh toán'}
                            </button>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Bill;
