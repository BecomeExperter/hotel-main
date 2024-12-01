import { Fragment, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import './RoomScreen.scss';

function AllRoom(props) {
    const serverURL = process.env.REACT_APP_SERVER_URL;
    const params = useParams();
    const navigate = useNavigate();
    const pageRef = useRef();

    const numberOfPage = Math.ceil(props.roomData.lengthOfList / 5);

    useEffect(() => {
        document.querySelectorAll('.page').forEach((page) => {
            if (parseInt(page.childNodes[0].innerText) === props.curPage) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        const nextButton = document.getElementById('next-btn');
        const preButton = document.getElementById('pre-btn');

        if (props.curPage === numberOfPage) {
            nextButton.classList.add('disabled');
        } else {
            nextButton.classList.remove('disabled');
        }

        if (props.curPage === 1) {
            preButton.classList.add('disabled');
        } else {
            preButton.classList.remove('disabled');
        }
    }, [props.curPage, numberOfPage]);

    const listPage = Array.from({ length: numberOfPage }, (_, i) => i + 1);

    const handleChangePage = (e) => {
        const selectedPage = parseInt(e.target.innerText);
        props.handleChangePage(selectedPage);
        navigate(`/rooms/${selectedPage}`);
        document.documentElement.scrollTop = 500;
    };

    const handleNextPage = () => {
        if (props.curPage < numberOfPage) {
            props.handleChangePage(props.curPage + 1);
            navigate(`/rooms/${props.curPage + 1}`);
            document.documentElement.scrollTop = 500;
        }
    };

    const handlePrePage = () => {
        if (props.curPage > 1) {
            props.handleChangePage(props.curPage - 1);
            navigate(`/rooms/${props.curPage - 1}`);
            document.documentElement.scrollTop = 500;
        }
    };

    return (
        <div className="roberto-rooms-area mt-4" id="cc">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {props.roomData.results.results.map((room) => (
                            <Fragment key={room._id}>
                                <div
                                    className="single-room-area d-flex align-items-center mb-5 justify-content-center"
                                    data-aos="fade-up"
                                    data-aos-anchor-placement="center-bottom"
                                >
                                    <div className="room-thumbnail">
                                        {room.imageUrls && room.imageUrls.length > 0 ? (
                                            <img src={`${serverURL}${room.imageUrls[0].filePath}`} alt={`Phòng ${room.roomNumber}`} />
                                        ) : (
                                            <div className="placeholder">Hình ảnh không có sẵn</div>
                                        )}
                                    </div>

                                    <div className="room-content">
                                        <h2>Phòng #{room.roomNumber}</h2>
                                        <h4>
                                            {room.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ{' '}
                                            <span>/ Ngày</span>
                                        </h4>
                                        <div className="room-feature">
                                            <h6>
                                                Loại: <span>{room.type}</span>
                                            </h6>
                                            <h6>
                                                Sức chứa: <span>Tối đa {room.maxCount} người</span>
                                            </h6>
                                            <h6>
                                                Dịch vụ: <span>{room.note}</span>
                                            </h6>
                                        </div>
                                        <Link to={`/room/${room._id}`} className="btn view-detail-btn">
                                            Xem chi tiết
                                            <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
                                        </Link>
                                    </div>
                                </div>
                                <hr className="mt-0 mb-4" />
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <nav className="roberto-pagination d-flex justify-content-center" data-aos="fade-up" data-aos-anchor-placement="center-bottom">
                <ul className="pagination pagination-allroom" ref={pageRef}>
                    <li className="page-item" id="pre-btn">
                        <div className="page-link" onClick={handlePrePage}>
                            <i className="fa fa-angle-left"></i>Trước
                        </div>
                    </li>
                    {listPage.map((page) => (
                        <li className="page-item page" key={page}>
                            <NavLink to={`/rooms/${page}`} className="page-link" onClick={handleChangePage}>
                                {page}
                            </NavLink>
                        </li>
                    ))}
                    <li className="page-item" id="next-btn">
                        <div className="page-link" onClick={handleNextPage}>
                            Sau <i className="fa fa-angle-right"></i>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default AllRoom;