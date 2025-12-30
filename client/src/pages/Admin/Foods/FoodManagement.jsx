import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Popconfirm,
  Image,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import foodService from "../../../services/Admin/foodService";
import FoodFormModal from "./FoodFormModal";

const { Title } = Typography;

export default function FoodManagement() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await foodService.getAll();
      setFoods(res.data);
    } catch {
      message.error("Không tải được danh sách combo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleDelete = async (id) => {
    await foodService.delete(id);
    message.success("Đã xóa combo");
    fetchFoods();
  };

  const columns = [
    {
      title: "Ảnh",
      render: (_, record) => (
        <Image
          width={60}
          src={record.pictureUrl}
          fallback="https://via.placeholder.com/60x60?text=🍿"
        />
      ),
    },

    {
      title: "Tên combo",
      dataIndex: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "items",
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (v) => `${Number(v).toLocaleString()} ₫`,
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingFood(record);
              setOpenModal(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa combo này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={3}>🍿 Quản lý Thức ăn / Combo</Title>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingFood(null);
          setOpenModal(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Thêm combo
      </Button>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={foods}
      />

      <FoodFormModal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          fetchFoods();
        }}
        initialData={editingFood}
      />
    </>
  );
}
