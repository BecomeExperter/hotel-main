import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllService, updateServiceStatus } from '../../../../services/apiServices'; // Đảm bảo đã nhập API cập nhật
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import ModalDeleteService from './ModalDeleteDichVu';

function ServiceApproval() {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;
    const [paginatedServices, setPaginatedServices] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        fetchServiceRequests();
    }, []);

    const fetchServiceRequests = async () => {
        try {
            const res = await getAllService();
            if (res && res.data) {
                setServiceRequests(res.data);
            } else {
                toast.error('Không thể tải danh sách dịch vụ');
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            toast.error('Đã xảy ra lỗi khi tải dữ liệu');
        }
    };

    useEffect(() => {
        if (serviceRequests && serviceRequests.length > 0) {
            const totalPages = Math.ceil(serviceRequests.length / ITEMS_PER_PAGE);
            setPageCount(totalPages);
            const paginated = _.chunk(serviceRequests, ITEMS_PER_PAGE);
            setPaginatedServices(paginated);
        }
    }, [serviceRequests]);

    // Hàm xử lý khi nhấn nút "Accept"
    const handleAcceptService = async (requestId) => {
        try {
            // Cập nhật trạng thái của dịch vụ
            const updatedServices = serviceRequests.map((service) => {
                if (service._id === requestId) {
                    return { ...service, status: 'Accept' }; // Cập nhật trạng thái
                }
                return service;
            });

            setServiceRequests(updatedServices); // Cập nhật danh sách dịch vụ
            await updateServiceStatus(requestId, 'Accept'); // Cập nhật trên server
            toast.success(`Đã chấp nhận dịch vụ với ID: ${requestId}`);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái dịch vụ:', error);
            toast.error('Đã xảy ra lỗi khi cập nhật trạng thái dịch vụ');
        }
    };

    const handleDeleteClick = (service) => {
        setSelectedService(service);
        setShowDeleteModal(true);
    };

    return (
        <>
            <h3 className="text-center">Duyệt Dịch Vụ</h3>
            <hr />
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">ID Dịch Vụ</th>
                        <th scope="col">ID Phòng</th>
                        <th scope="col">Loại Dịch Vụ</th>
                        <th scope="col">Ngày Đặt</th>
                        <th scope="col">Trạng Thái</th>
                        <th scope="col">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedServices && paginatedServices.length > 0 ? (
                        paginatedServices[currentPage - 1].map((request) => (
                            <tr key={request._id}>
                                <td>{request._id}</td>
                                <td>{request.RoomBook}</td>
                                <td>{request.LoaiService}</td>
                                <td>{request.dateOfBook}</td>
                                <td>{request.status || 'UnAccept'}</td> {/* Hiển thị "UnAccept" nếu không có trạng thái */}
                                <td>
                                    <button
                                        onClick={() => handleAcceptService(request._id)}
                                        className="btn btn-success"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(request)}
                                        className="btn btn-danger"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                Không có yêu cầu dịch vụ nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="d-flex justify-content-center">
                {paginatedServices && paginatedServices.length > 0 && (
                    <ReactPaginate
                        className="pagination"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                        breakLabel="..."
                        nextLabel={'Sau >'}
                        onPageChange={(event) => setCurrentPage(event.selected + 1)} 
                        pageRangeDisplayed={3}
                        pageCount={pageCount}
                        previousLabel={'< Trước'}
                        renderOnZeroPageCount={null}
                        forcePage={currentPage - 1}
                    />
                )}
            </div>

            {showDeleteModal && (
                <ModalDeleteService
                    show={showDeleteModal}
                    setShow={setShowDeleteModal}
                    dataService={selectedService}
                    fetchServiceRequests={fetchServiceRequests}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </>
    );
}

export default ServiceApproval;
