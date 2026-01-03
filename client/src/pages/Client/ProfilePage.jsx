import React, { useEffect, useState } from 'react';
import { Layout, Typography, Card, Descriptions, Spin, List, Tag, Row, Col, Avatar, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined, HistoryOutlined, MailOutlined, PhoneOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import authService from '../../services/authService';
import bookingService from '../../services/Client/bookingService';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text } = Typography;

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch User Info
                const userRes = await authService.getProfile();
                setUser(userRes.data);

                // Fetch Booking History
                const bookingRes = await bookingService.getMyBookings();
                // Need to ensure getMyBookings exists in bookingService, assuming yes or will add
                setBookings(bookingRes || []);

            } catch (error) {
                console.error("Lỗi tải thông tin:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUpdateProfile = async (values) => {
        try {
            const res = await authService.updateProfile(values);
            setUser(res.data.user); // Update local user state
            setIsEditModalOpen(false);
            message.success('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error("Update profile error:", error);
            message.error('Cập nhật thất bại. Vui lòng thử lại.');
        }
    };

    const handleCancelBooking = (bookingId) => {
        Modal.confirm({
            title: 'Xác nhận hủy vé',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn hủy đơn đặt vé này không?',
            okText: 'Hủy vé',
            okType: 'danger',
            cancelText: 'Quay lại',
            onOk: async () => {
                try {
                    await bookingService.cancelBooking(bookingId);
                    message.success('Đã hủy vé thành công');
                    // Refresh bookings
                    const updatedBookings = await bookingService.getMyBookings();
                    setBookings(updatedBookings);
                } catch (error) {
                    console.error("Cancel booking error:", error);
                    message.error(error.response?.data?.message || 'Lỗi khi hủy vé');
                }
            },
        });
    };

    if (loading) {
        return (
            <Layout style={{ minHeight: '100vh', background: '#001529', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Spin size="large" />
                <Text style={{ marginTop: 20, color: '#fff' }}>Đang tải thông tin...</Text>
            </Layout>
        );
    }

    if (!user) return null;

    return (
        <Layout style={{ minHeight: '100vh', background: '#001529' }}>
            <Content style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                <Title level={2} style={{ textAlign: 'center', color: '#e50914', marginBottom: '40px' }}>
                    THÔNG TIN TÀI KHOẢN
                </Title>

                <Row gutter={[24, 24]}>
                    {/* User Info Column */}
                    <Col xs={24} md={8}>
                        <Card
                            variant="borderless"
                            style={{ background: '#1f1f1f', borderRadius: '12px', textAlign: 'center' }}
                            styles={{ body: { padding: '40px 20px' } }}
                        >
                            <Avatar size={100} icon={<UserOutlined />} style={{ marginBottom: 20, backgroundColor: '#e50914' }} />
                            <Title level={4} style={{ color: '#fff', marginBottom: 5 }}>
                                {user.fullName}
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    style={{ color: '#1890ff', marginLeft: 8 }}
                                    onClick={() => {
                                        form.setFieldsValue({ fullName: user.fullName, phone: user.phone });
                                        setIsEditModalOpen(true);
                                    }}
                                />
                            </Title>
                            <Tag color="blue">{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng thân thiết'}</Tag>

                            <div style={{ marginTop: 30, textAlign: 'left' }}>
                                <div style={{ marginBottom: 15, display: 'flex', alignItems: 'center', color: '#bfbfbf' }}>
                                    <MailOutlined style={{ marginRight: 10, color: '#e50914' }} />
                                    <Text style={{ color: '#fff' }}>{user.email}</Text>
                                </div>
                                {user.phone && (
                                    <div style={{ marginBottom: 15, display: 'flex', alignItems: 'center', color: '#bfbfbf' }}>
                                        <PhoneOutlined style={{ marginRight: 10, color: '#e50914' }} />
                                        <Text style={{ color: '#fff' }}>{user.phone}</Text>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>

                    {/* Booking History Column */}
                    <Col xs={24} md={16}>
                        <Card
                            title={<span style={{ color: '#fff' }}><HistoryOutlined style={{ marginRight: 10 }} />Lịch sử đặt vé</span>}
                            variant="borderless"
                            style={{ background: '#1f1f1f', borderRadius: '12px' }}
                            styles={{
                                header: { borderBottom: '1px solid #333' },
                                body: { padding: '20px' }
                            }}
                        >
                            <List
                                itemLayout="vertical"
                                dataSource={bookings}
                                locale={{ emptyText: <Text style={{ color: '#bfbfbf' }}>Chưa có đơn hàng nào.</Text> }}
                                renderItem={(item) => (
                                    <List.Item style={{ borderBottom: '1px solid #333', padding: '20px 0' }}>
                                        <List.Item.Meta
                                            title={
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text style={{ color: '#e50914', fontSize: 18, fontWeight: 'bold' }}>
                                                        {item.Showtime?.Movie?.title || 'Phim đã xóa'}
                                                    </Text>
                                                    <div>
                                                        <Tag color={
                                                            item.status === 'CONFIRMED' || item.status === 'USED' ? 'green' :
                                                                item.status === 'PENDING' ? 'orange' : 'red'
                                                        }>
                                                            {item.status}
                                                        </Tag>
                                                        {item.status === 'PENDING' && (
                                                            <Button
                                                                size="small"
                                                                danger
                                                                onClick={() => handleCancelBooking(item.id)}
                                                                style={{ marginLeft: 8 }}
                                                            >
                                                                Hủy vé
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            }
                                            description={
                                                <div style={{ color: '#bfbfbf', marginTop: 10 }}>
                                                    <p>Rạp: {item.Showtime?.Room?.Cinema?.name} - {item.Showtime?.Room?.name}</p>
                                                    <p>Suất chiếu: {dayjs(item.Showtime?.startTime).format('HH:mm DD/MM/YYYY')}</p>
                                                    <p>Ghế: {item.BookingSeats?.map(bs => `${bs.ShowtimeSeat?.Seat?.row}${bs.ShowtimeSeat?.Seat?.number}`).join(', ')}</p>
                                                    <p style={{ marginTop: 10, color: '#fff', fontWeight: 'bold' }}>
                                                        Tổng tiền: {item.totalPrice.toLocaleString()} đ
                                                        <span style={{ fontSize: 12, fontWeight: 'normal', color: '#8c8c8c', marginLeft: 10 }}>
                                                            ({item.paymentMethod === 'BANKING' ? 'Chuyển khoản' : 'Tiền mặt'})
                                                        </span>
                                                    </p>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </Content>

            <Modal
                title="Cập nhật thông tin"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateProfile}
                >
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Button onClick={() => setIsEditModalOpen(false)} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout >
    );
};

export default ProfilePage;
