import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  message,
  Avatar,
  Tooltip,
  Select, // 👈 THÊM DÒNG NÀY
  Input,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import userService from "../../../services/Admin/userServices";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import { useNavigate } from "react-router-dom";

// Import file CSS vừa tạo
import "../../../styles/Admin/UserManagement.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate();

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");

  const [searchName, setSearchName] = useState("");

  // LOGIC GIỮ NGUYÊN
  const fetchUsers = async () => {
    try {
      const res = await userService.getAll();
      setUsers(res.data);
    } catch {
      message.error("Không lấy được danh sách người dùng");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    if (!id) {
      message.error("ID không hợp lệ");
      return;
    }
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa nhân sự này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        await userService.delete(id);
        message.success("Đã xóa");
        fetchUsers();
      },
    });
  };

  // --- PHẦN CHỈNH SỬA GIAO DIỆN CỘT ---
  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => (
        <div className="user-info-cell">
          {/* Tạo Avatar từ chữ cái đầu */}
          <Avatar
            style={{ backgroundColor: "#1890ff", verticalAlign: "middle" }}
            size="large"
          >
            {text ? text.charAt(0).toUpperCase() : <UserOutlined />}
          </Avatar>
          <span className="user-name-text">{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span style={{ color: "#64748b" }}>{text}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text) => (
        <span style={{ fontFamily: "monospace", fontSize: "14px" }}>
          {text || "---"}
        </span>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        // Logic màu sắc: Admin màu đỏ, Staff màu xanh, User màu lá
        let color =
          role === "admin"
            ? "volcano"
            : role === "staff"
            ? "geekblue"
            : "green";
        return (
          <Tag
            color={color}
            key={role}
            style={{
              padding: "4px 12px",
              borderRadius: "4px",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <div className="action-buttons" style={{ justifyContent: "center" }}>
          <Tooltip title="Chỉnh sửa">
            <Button
              className="btn-edit"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedUser(record);
                setOpenEdit(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Button
              className="btn-delete"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  // 🔽 USER SAU KHI LỌC THEO ROLE
  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchName =
      !searchName ||
      u.fullName?.toLowerCase().includes(searchName.toLowerCase());

    return matchRole && matchName;
  });

  return (
    <div className="user-page-container">
      {/* Header đẹp hơn */}
      <div className="user-page-header">
        <h2 className="page-title">Quản lý Nhân sự</h2>

        <Space>
          {/* 🔽 THÊM MỚI: SELECT LỌC ROLE */}
          <Input
            placeholder="Tìm theo tên..."
            allowClear
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 220, height: 44 }}
          />

          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 180, height: 44 }}
          >
            <Select.Option value="all">Tất cả vai trò</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="staff">Staff</Select.Option>
            <Select.Option value="customer">Customer</Select.Option>
          </Select>

          {/* ⛔ GIỮ NGUYÊN NÚT CŨ */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{ height: "44px", padding: "0 24px", borderRadius: "8px" }}
            onClick={() => setOpenCreate(true)}
          >
            Thêm nhân sự
          </Button>
        </Space>
      </div>

      {/* Bảng nằm trong Card bóng mờ */}
      <div className="table-card">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredUsers} // 👈 QUAN TRỌNG NHẤT
          pagination={{ pageSize: 8 }}
        />
      </div>

      {/* Modals giữ nguyên */}
      <CreateUserModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={fetchUsers}
      />
      <EditUserModal
        open={openEdit}
        user={selectedUser}
        onClose={() => setOpenEdit(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
