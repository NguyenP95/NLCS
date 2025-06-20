import React, { useEffect, useState } from "react";
import { Card, Button, Form, Tab, Tabs, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import EditUserModal from '../../components/Modal/EditUserModal'
import EditCarModal from "../../components/Modal/EditCarModal";

const Profile = () => {
    const [formData, setFormData] = useState({});
    const [cars, setCars] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showEditCarModal, setShowEditCarModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);

    const navigate = useNavigate();

    const fetchContracts = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/rental/getContractOwner`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setContracts(data);
            })
            .catch((err) => console.error('Lỗi khi gọi API:', err));
    };

    const fetchCars = () => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/car/getAllCarOfUser`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setCars(data);
            })
            .catch((err) => console.error('Lỗi khi gọi API:', err));
    };

    const fetchUser = () => {
        const token = localStorage.getItem('token');

        const decode = jwtDecode(token);
        const id = decode.id;

        fetch(`http://localhost:3000/user/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                const formattedData = {
                    ...data,
                    date_of_birth: data.date_of_birth?.split('T')[0] || '', // chỉ lấy yyyy-MM-dd
                };
                setFormData(formattedData);
            })
            .catch((err) => console.error('Lỗi khi gọi API:', err));

    };


    useEffect(() => {
        fetchCars();
        fetchContracts();
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:3000/user/update`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Chỉnh sửa thành công') {
                    alert('Cập nhật thành công');
                    setShowEditModal(false);
                } else {
                    alert('Cập nhật thất bại: ' + (data.message || 'Đã có lỗi xảy ra'));
                }
            })
            .catch(err => {
                console.error('Lỗi khi cập nhật:', err);
                alert('Lỗi khi cập nhật thông tin');
            });
    };


    const handleApprove = (id) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:3000/rental/confirm/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                fetchContracts();
            })
            .catch((err) => console.error('Lỗi khi gọi API:', err));

    }

    const handleReject = (id) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:3000/rental/reject/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                fetchContracts();
            })
            .catch((err) => console.error('Lỗi khi gọi API:', err));
    }

    // CAR

    const handleDelete = (carID) => {
        if (!window.confirm("Bạn có chắc muốn xóa xe này?")) return;

        const token = localStorage.getItem('token');

        fetch(`http://localhost:3000/car/${carID}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.message !== 'Xóa thành công')
                    alert(data.message);
                else {
                    setCars(prev => prev.filter(item => item.carID !== carID));
                }
                // fetchCars();
            })
            .catch(err => {
                console.error('Lỗi khi xóa xe:', err);
                alert('Lỗi khi xóa xe');
            });
    };


    return (
        <Card className="p-4 shadow-sm w-75 mx-auto mt-4">
            <h3 className="mb-4 text-center">Hồ sơ người dùng</h3>

            <Tabs defaultActiveKey="info" className="mb-3">
                <Tab eventKey="info" title="Thông tin cá nhân">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullname"
                                value={formData.fullname || ''}
                                onChange={handleChange}
                                readOnly={!showEditModal}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone_number"
                                value={formData.phone_number || ''}
                                onChange={handleChange}
                                readOnly={!showEditModal}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth || ''}
                                onChange={handleChange}
                                readOnly={!showEditModal}
                            />
                        </Form.Group>



                        <div className="text-center">
                            {!showEditModal ? (
                                <Button onClick={() => setShowEditModal(true)}>Chỉnh sửa</Button>
                            ) : (
                                <Button onClick={handleSave}>Lưu thay đổi</Button>
                            )}
                        </div>
                    </Form>
                </Tab>

                <Tab eventKey="cars" title="Xe của tôi">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Tên xe</th>
                                <th>Biển số</th>
                                <th>Số chỗ</th>
                                <th>Vị trí</th>
                                <th>Năm sản xuất</th>
                                <th>Loại nhiên liệu</th>
                                <th>Giá thuê</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map(car => (
                                <tr key={car.carID}>
                                    <td>{car.carname}</td>
                                    <td>{car.license_plate}</td>
                                    <td>{car.seats}</td>
                                    <td>{car.pickup_location}</td>
                                    <td>{car.year_manufacture}</td>
                                    <td>{car.fuel_type}</td>
                                    <td>{car.price_per_date}</td>
                                    <td>
                                        {car.car_status === 'available' ? 'Sẵn sàng' :
                                            car.car_status === 'rented' ? 'Đang thuê' :
                                                car.car_status}
                                    </td>
                                    <td>
                                        <Button className="m-1" variant="outline-primary" size="sm" onClick={() => {
                                            setSelectedCar(car);
                                            setShowEditCarModal(true);
                                        }}>Sửa</Button>

                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(car.carID)}
                                        >
                                            Xóa
                                        </Button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="text-center">
                        <Button onClick={() => navigate('/car/addCar')}>Thêm xe mới</Button>
                    </div>

                </Tab>

                <Tab eventKey="contracts" title="Hợp đồng thuê xe">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Người thuê</th>
                                <th>Liên hệ</th>
                                <th>Tên xe</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.map(contract => (
                                <tr key={contract.contractID}>
                                    <td>{contract.fullname}</td>
                                    <td>{contract.phone_number}</td>
                                    <td>{contract.carname}</td>
                                    <td>{new Date(contract.rental_start_date).toLocaleDateString()}</td>
                                    <td>{new Date(contract.rental_end_date).toLocaleDateString()}</td>
                                    <td>{contract.total_price.toLocaleString()}</td>
                                    <td>{contract.contract_status}</td>

                                    <td>
                                        {contract.contract_status === 'pending' ? (
                                            <>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleApprove(contract.contractID)}
                                                >
                                                    Duyệt
                                                </Button>{' '}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleReject(contract.contractID)}
                                                >
                                                    Từ chối
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                {contract.contract_status === 'active' && (
                                                    <span className="text-success">Đã duyệt</span>
                                                )}
                                                {contract.contract_status === 'cancelled' && (
                                                    <span className="text-danger">Đã từ chối</span>
                                                )}
                                                {contract.contract_status === 'completed' && (
                                                    <span className="text-secondary">Đã thanh toán</span>
                                                )}
                                            </>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>

                </Tab>
            </Tabs>

            <EditUserModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                formData={formData}
                handleChange={handleChange}
                handleSave={handleSave}
            />

            <EditCarModal
                show={showEditCarModal}
                handleClose={() => setShowEditCarModal(false)}
                carData={selectedCar}
                onSave={fetchCars}
            />


        </Card>


    );
};

export default Profile;
