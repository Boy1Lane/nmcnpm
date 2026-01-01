import { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Popconfirm, message, Tooltip } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import promotionService from "../../../services/Admin/promotionService";
import CreatePromotionModal from "./CreatePromotionModal";
import EditPromotionModal from "./EditPromotionModal";

// Import CSS
import "../../../styles/Admin/PromotionManagement.css";

export default function PromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await promotionService.getAll();
      setPromotions(res.data);
    } catch (err) {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await promotionService.delete(id);
      message.success("Đã xóa mã khuyến mãi");
      fetchPromotions();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  // --- CẤU HÌNH CỘT (Đã tối giản) ---
  const columns = [
    {
      title: "MÃ CODE",
      dataIndex: "code",
      key: "code",
      // Dùng class 'promo-code-text' từ CSS
      render: (text) => <span className="promo-code-text">{text}</span>,
    },
    {
      title: "MÔ TẢ",
      dataIndex: "description",
      ellipsis: true,
      render: (text) => <span style={{ color: "#64748b" }}>{text}</span>,
    },
    {
      title: "GIẢM GIÁ",
      dataIndex: "discountPercentage",
      align: "center",
      render: (v) => (
        // Dùng Tag borderless màu xanh nhẹ
        <Tag
          color="blue"
          bordered={false}
          style={{ fontWeight: 600, fontSize: 13 }}
        >
          {v}%
        </Tag>
      ),
    },
    {
      title: "THỜI GIAN HIỆU LỰC",
      width: 240,
      render: (_, r) => (
        <div className="date-cell">
          <div className="date-row">
            <CalendarOutlined style={{ fontSize: 12, color: "#2563eb" }} />
            <span>{new Date(r.validFrom).toLocaleDateString()}</span>
          </div>
          <div
            className="date-row"
            style={{ color: "#94a3b8", fontSize: 12, marginLeft: 20 }}
          >
            đến {new Date(r.validTo).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      title: "SỬ DỤNG / GIỚI HẠN",
      align: "center",
      render: (_, r) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ fontWeight: 600, color: "#334155" }}>
            {r.timesUsed || 0} lần
          </span>
          {r.usageLimit ? (
            <Tag bordered={false} color="orange">
              Tối đa: {r.usageLimit}
            </Tag>
          ) : (
            <Tag bordered={false} color="default">
              Không giới hạn
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "",
      align: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            {/* Dùng class 'btn-icon' */}
            <Button
              className="btn-icon"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedPromotion(record);
                setOpenEdit(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa mã này?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Xóa">
              <Button className="btn-icon delete" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lí mã khuyến mãi</h2>{" "}
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="btn-primary-custom"
          onClick={() => setOpenCreate(true)}
        >
          Tạo mã mới
        </Button>
      </div>

      {/* Table Card */}
      <div className="content-card">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={promotions}
          pagination={{ pageSize: 8, showSizeChanger: false }}
        />
      </div>

      {/* Modals */}
      <CreatePromotionModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={fetchPromotions}
      />

      <EditPromotionModal
        open={openEdit}
        promotion={selectedPromotion}
        onClose={() => setOpenEdit(false)}
        onSuccess={fetchPromotions}
      />
    </div>
  );
}
