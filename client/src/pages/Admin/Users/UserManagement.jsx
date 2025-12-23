import { useEffect, useState } from "react";
import { Table, Button, Tag, Space, Modal, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import userService from "../../../services/Admin/userServices";
import CreateUserModal from "./CreateUserModal";
import { useNavigate } from "react-router-dom";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate();

  //   // 🔐 CHECK ADMIN
  //   useEffect(() => {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //     if (!user || user.role !== "Admin") {
  //       navigate("/admin/dashboard");
  //     }
  //   }, []);

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
      onOk: async () => {
        await userService.delete(id);
        message.success("Đã xóa");
        fetchUsers();
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "blue" : "green"}>{role}</Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <EditOutlined />
          <DeleteOutlined
            style={{ color: "red" }}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>Danh sách Nhân sự</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenCreate(true)}
        >
          Thêm nhân sự mới
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={users} />

      <CreateUserModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={fetchUsers}
      />
    </>
  );
}
