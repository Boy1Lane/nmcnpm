import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Popconfirm,
  message,
  Card,
  Empty,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShopOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import foodService from "../../../services/Admin/foodService";
import FoodFormModal from "./FoodFormModal";
import "../../../styles/Admin/FoodManagement.css";

const { Title, Text } = Typography;

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

  return (
    <div className="food-page-container">
      {/* Header */}
      <div className="page-header-wrapper">
        <h2 className="page-title">Quản lí thức ăn & đồ uống</h2>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingFood(null);
            setOpenModal(true);
          }}
          style={{
            height: 46,
            borderRadius: 8,
            background: "#2563eb",
            boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)",
          }}
        >
          Thêm Combo mới
        </Button>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          Đang tải dữ liệu...
        </div>
      ) : foods.length === 0 ? (
        <Empty
          description="Chưa có combo nào được tạo"
          style={{ marginTop: 50 }}
        />
      ) : (
        <div className="food-grid">
          {foods.map((food) => (
            <div key={food.id} className="food-card">
              {/* Image Area - Fixed 2:3 Ratio */}
              <div className="food-image-wrapper">
                {food.pictureUrl ? (
                  <img
                    src={food.pictureUrl}
                    alt={food.name}
                    className="food-image"
                  />
                ) : (
                  <div className="food-placeholder">
                    <CoffeeOutlined />
                  </div>
                )}
                {/* Badge giá nằm đè lên ảnh cho đẹp */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontWeight: "bold",
                    fontSize: 13,
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {Number(food.price).toLocaleString()} ₫
                </div>
              </div>

              {/* Content Area */}
              <div className="food-content">
                <Tooltip title={food.name}>
                  <div className="food-name">{food.name}</div>
                </Tooltip>

                <Tooltip title={food.items}>
                  <div className="food-desc">
                    {food.items || "Không có mô tả chi tiết"}
                  </div>
                </Tooltip>

                {/* Actions */}
                <div className="food-actions">
                  <Button
                    type="default"
                    icon={<EditOutlined />}
                    block
                    onClick={() => {
                      setEditingFood(food);
                      setOpenModal(true);
                    }}
                  >
                    Sửa
                  </Button>

                  <Popconfirm
                    title="Xóa combo này?"
                    description="Hành động này không thể hoàn tác"
                    onConfirm={() => handleDelete(food.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button danger icon={<DeleteOutlined />} block>
                      Xóa
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <FoodFormModal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onSuccess={() => {
          setOpenModal(false);
          fetchFoods();
        }}
        initialData={editingFood}
      />
    </div>
  );
}
