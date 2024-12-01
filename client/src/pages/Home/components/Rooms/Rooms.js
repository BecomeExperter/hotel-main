import React, { useEffect, useState } from 'react';
import SlickSlider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { TiTick } from 'react-icons/ti';
import './Rooms.scss';
import Button from '../../../../components/Button/Button';
import SlideNextArrow from './SlideNextArrow';
import SlidePrevArrow from './SlidePrevArrow';
import { getAllRoomTypes } from '../../../../services/apiServices';
import FormatPrice from '../../../../components/FormatPrice/FormatPrice';

// Component Error Boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Error caught by Error Boundary:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Có gì đó không đúng.</h1>;
        }
        return this.props.children;
    }
}

// Component Rooms
function Rooms() {
    const settings = {
        dots: false,
        infinite: true,
        arrows: true,
        speed: 1800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        nextArrow: <SlideNextArrow />,
        prevArrow: <SlidePrevArrow />,
    };

    const [listTypes, setListTypes] = useState([]);

    useEffect(() => {
        fetchAllRoomTypes();
    }, []);

    const fetchAllRoomTypes = async () => {
        try {
            const res = await getAllRoomTypes();
            if (res && res.data && res.data.success === true) {
                setListTypes(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching room types:", error);
        }
    };

    return (
        <ErrorBoundary>
            <div className="home-rooms-container">
                <SlickSlider {...settings}>
                    {listTypes.map((type) => (
                        <div key={type._id}>
                            <div className="single-room">
                                <div className="thumbnail">
                                    {type.imageUrls && type.imageUrls.length > 0 && type.imageUrls[0].filePath ? (
                                        <img
                                            src={`${process.env.REACT_APP_SERVER_URL}${type.imageUrls[0].filePath}`}
                                            alt={`Phòng loại ${type.typeOfRooms}`}
                                        />
                                    ) : (
                                        <div className="placeholder">Hình ảnh không có sẵn</div>
                                    )}
                                </div>
                                <div className="content">
                                    <h2>Phòng loại {type.typeOfRooms}</h2>
                                    <h3>
                                        <FormatPrice>{type.price}</FormatPrice> VND
                                        <span> / Ngày</span>
                                    </h3>
                                    <ul className="features">
                                        <li>
                                            <span>
                                                <TiTick />
                                                Sức chứa
                                            </span>
                                            <span>: Tối đa 3 người</span>
                                        </li>
                                        <li>
                                            <span>
                                                <TiTick />
                                                Giường
                                            </span>
                                            <span>: King Beds</span>
                                        </li>
                                        <li>
                                            <span>
                                                <TiTick />
                                                Dịch vụ
                                            </span>
                                            <span>: Wifi, Tivi, Điều hòa, Bồn tắm</span>
                                        </li>
                                    </ul>
                                    <div>
                                        <Button to="/rooms/1" primary className="view-btn">
                                            Xem chi tiết
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </SlickSlider>
            </div>
        </ErrorBoundary>
    );
}

export default Rooms;