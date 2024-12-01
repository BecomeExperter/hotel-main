import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllService, deleteService } from '../../../../services/apiServices';

function ServiceApproval() {
    const [serviceRequests, setServiceRequests] = useState([]);

    useEffect(() => {
        fetchServiceRequests();
    }, []);

    // Hàm để lấy dữ liệu từ API
    const fetchServiceRequests = async () => {
        try {
            const res = await getAllService();
            console.log('Response từ API:', res.data); // Log dữ liệu trả về để kiểm tra

            if (res && res.data) {
                setServiceRequests(res.data); // Cập nhật đúng dữ liệu từ API
            } else {
                toast.error('Không thể tải danh sách dịch vụ');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error); // Log lỗi nếu có
            toast.error('Đã xảy ra lỗi khi tải dữ liệu');
        }
    };

    // Hàm xử lý khi nhấn nút "Xóa"
    const handleDeleteService = async (RoomID) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
            try {
                const response = await deleteService(RoomID);
                console.log('Response từ API khi xóa:', response); // Log phản hồi để kiểm tra
                if (response.status === 200) {
                    toast.success(`Đã xóa dịch vụ với ID: ${RoomID}`);
                    fetchServiceRequests(); // Cập nhật lại danh sách sau khi xóa
                } else {
                    toast.error('Đã xảy ra lỗi khi xóa dịch vụ');
                }
            } catch (error) {
                console.error('Lỗi khi xóa dịch vụ:', error);
                toast.error('Đã xảy ra lỗi khi xóa dịch vụ');
            }
        }
    };

    // Hàm để định dạng thời gian
    const formatTime = (timeString) => {
        if (!timeString) return 'N/A'; // Trả về N/A nếu không có thời gian
        const date = new Date(`1970-01-01T${timeString}`); // Giả sử timeString là 'HH:mm:ss'
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="admin-service-approval-container">
            <h3 className="text-center">Duyệt Dịch Vụ</h3>
            <hr />
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">ID Phòng</th>
                        <th scope="col">Loại Dịch Vụ</th>
                        <th scope="col">Ngày Đặt</th>
                        <th scope="col">Giờ Đặt</th> {/* Cột giờ */}
                        <th scope="col">Hành Động</th> {/* Cột hành động */}
                    </tr>
                </thead>
                <tbody>
                    {serviceRequests.length > 0 ? (
                        serviceRequests.map((request) => (
                            <tr key={request._id}>
                                <td>{request.RoomBook}</td> {/* Hiển thị RoomBook */}
                                <td>{request.LoaiService}</td> {/* Hiển thị LoaiService */}
                                <td>{request.dateOfBook}</td> {/* Hiển thị dateOfBook */}
                                <td>{formatTime(request.timeOfBook)}</td> {/* Hiển thị giờ đã đặt dịch vụ */}
                                <td>
                                    <button onClick={() => handleDeleteService(request._id)} className="btn btn-danger">
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                Không có yêu cầu dịch vụ nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ServiceApproval;
