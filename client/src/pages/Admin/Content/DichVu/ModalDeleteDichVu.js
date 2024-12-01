import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { delService } from '../../../../services/apiServices';

function ModalDeleteService({ show, setShow, dataRoom = {}, fetchAllRoom, setCurrentPage }) {
    const handleClose = () => setShow(false);

    const handleDeleteService = async () => {
        try {
            const res = await delService(dataRoom._id);
            if (res && res.data && res.data.success) {
                toast.success(res.data.message);
                setCurrentPage(1);
                fetchAllRoom();
            } else {
                toast.error(res?.message || 'An error occurred while deleting the service.');
            }
        } catch (error) {
            toast.error('Failed to delete the service. Please try again.');
        } finally {
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete the Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this service?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteService}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalDeleteService;
