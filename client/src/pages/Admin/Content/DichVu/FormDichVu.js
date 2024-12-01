import React, { useState } from 'react';
import { postService } from '../../../../services/apiServices';
import './FormDichVu.scss';

function ServiceForm() {
    const [roomNumber, setRoomNumber] = useState(''); // Mã phòng
    const [dateOfBook, setDateOfBook] = useState(''); // Ngày đặt
    const [serviceType, setServiceType] = useState('Spa'); // Giá trị mặc định là "Spa"
    const [timeOfBook, setTimeOfBook] = useState(''); // Thời gian muốn đặt phòng
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tạo đối tượng dữ liệu để gửi
        const userForm = {
            RoomBook: roomNumber, // Mã phòng
            dateOfBook,           // Ngày đặt
            LoaiService: serviceType, // Loại dịch vụ
            timeOfBook            // Thêm thời gian đã đặt
        };

        try {
            const response = await postService(userForm);
            if (response.status === 200 || response.status === 201) {
                console.log('Dữ liệu được gửi:', response.data);
                setSuccess(true);

                // Reset form sau khi gửi
                setRoomNumber('');
                setDateOfBook('');
                setServiceType('Spa');
                setTimeOfBook(''); // Reset timeOfBook
                setError(null);
            } else {
                setError('Đã xảy ra lỗi khi gửi dữ liệu: ' + response.statusText);
            }
        } catch (error) {
            console.error('Lỗi:', error);
            if (error.response) {
                setError('Đã xảy ra lỗi khi gửi dữ liệu: ' + (error.response.data.message || error.response.statusText));
            } else {
                setError('Đã xảy ra lỗi khi gửi dữ liệu: ' + error.message);
            }
            setSuccess(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="roomNumber">Mã Phòng:</label>
                <input
                    type="text"
                    id="roomNumber"
                    className="form-control"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="dateOfBook">Ngày Đặt:</label>
                <input
                    type="date"
                    id="dateOfBook"
                    className="form-control"
                    value={dateOfBook}
                    onChange={(e) => setDateOfBook(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="timeOfBook">Thời Gian Đặt:</label>
                <input
                    type="time"
                    id="timeOfBook"
                    className="form-control"
                    value={timeOfBook}
                    onChange={(e) => setTimeOfBook(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="serviceType">Dịch Vụ:</label>
                <select
                    id="serviceType"
                    className="form-control"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                >
                    <option value="Spa">Spa</option>
                    <option value="Nha Hang">Nhà Hàng</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Submit</button>
            {success && <div className="alert alert-success mt-3">Dữ liệu đã được gửi thành công!</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
    );
}

export default ServiceForm;