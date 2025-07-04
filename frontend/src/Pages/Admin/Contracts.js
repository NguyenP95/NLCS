import React, { useEffect, useState } from 'react';
import { Table, Container, Badge, Row, Col, Card } from 'react-bootstrap';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    completed: 0,
    cancelled: 0
  });

  // Lấy danh sách hợp đồng
  useEffect(() => {
    fetch('http://localhost:3000/admin/contract/getAllContract', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setContracts(data))
      .catch(err => console.error(err));
  }, []);

  // Lấy thống kê hợp đồng
  useEffect(() => {
    fetch('http://localhost:3000/rental/admin/getAllContractStats', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Lỗi thống kê:', err));
  }, []);

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Quản lý hợp đồng</h3>

      {/* THỐNG KÊ */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Tổng số hợp đồng</h6>
              <h4 className="text-primary">{stats.total}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Chờ duyệt</h6>
              <h4 className="text-warning">{stats.pending}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Đã duyệt</h6>
              <h4 className="text-success">{stats.active}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Đã thanh toán</h6>
              <h4 className="text-secondary">{stats.completed}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mt-3">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Đã từ chối</h6>
              <h4 className="text-danger">{stats.cancelled}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* DANH SÁCH HỢP ĐỒNG */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Người thuê</th>
            <th>Tên xe</th>
            <th>Chủ xe</th>
            <th>Thời gian</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(contract => (
            <tr key={contract.contractID}>
              <td>{contract.contractID}</td>
              <td>{contract.fullname}</td>
              <td>{contract.carname}</td>
              <td>{contract.owner}</td>
              <td>
                {new Date(contract.rental_start_date).toLocaleDateString()} -{' '}
                {new Date(contract.rental_end_date).toLocaleDateString()}
              </td>
              <td>{contract.total_price.toLocaleString()}</td>
              <td>
                {contract.contract_status === 'pending' && (
                  <Badge bg="warning" text="dark">Chờ duyệt</Badge>
                )}
                {contract.contract_status === 'active' && (
                  <Badge bg="success">Đã duyệt</Badge>
                )}
                {contract.contract_status === 'completed' && (
                  <Badge bg="secondary">Đã thanh toán</Badge>
                )}
                {contract.contract_status === 'cancelled' && (
                  <Badge bg="danger">Đã từ chối</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Contracts;
