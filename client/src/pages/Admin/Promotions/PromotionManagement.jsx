// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Space,
//   Tag,
//   Popconfirm,
//   message,
//   Typography,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

// import promotionService from "../../../services/Admin/promotionService";
// import CreatePromotionModal from "./CreatePromotionModal";
// import EditPromotionModal from "./EditPromotionModal";
// const { Title } = Typography;

// export default function PromotionManagement() {
//   const [promotions, setPromotions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [openCreate, setOpenCreate] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [selectedPromotion, setSelectedPromotion] = useState(null);

//   const fetchPromotions = async () => {
//     try {
//       setLoading(true);
//       const res = await promotionService.getAll();
//       setPromotions(res.data);
//     } catch (err) {
//       message.error("Không thể tải danh sách khuyến mãi");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPromotions();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await promotionService.delete(id);
//       message.success("Xóa khuyến mãi thành công");
//       fetchPromotions();
//     } catch {
//       message.error("Xóa thất bại");
//     }
//   };

//   const columns = [
//     {
//       title: "Mã",
//       dataIndex: "code",
//       key: "code",
//     },
//     {
//       title: "Mô tả",
//       dataIndex: "description",
//     },
//     {
//       title: "Giảm (%)",
//       dataIndex: "discountPercentage",
//       render: (v) => <Tag color="green">{v}%</Tag>,
//     },
//     {
//       title: "Thời gian",
//       render: (_, r) =>
//         `${new Date(r.validFrom).toLocaleDateString()} → ${new Date(
//           r.validTo
//         ).toLocaleDateString()}`,
//     },
//     // ⭐ 2 CỘT MỚI
//     {
//       title: "Đã dùng",
//       dataIndex: "timesUsed",
//       align: "center",
//       render: (v) => <Tag color="blue">{v ?? 0}</Tag>,
//     },
//     {
//       title: "Giới hạn",
//       dataIndex: "usageLimit",
//       align: "center",
//       render: (v) =>
//         v === null ? (
//           <Tag color="green">Không giới hạn</Tag>
//         ) : (
//           <Tag color="volcano">{v}</Tag>
//         ),
//     },

//     {
//       title: "Hành động",
//       render: (_, record) => (
//         <Space>
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => {
//               setSelectedPromotion(record);
//               setOpenEdit(true);
//             }}
//           />
//           <Popconfirm
//             title="Xóa mã khuyến mãi?"
//             onConfirm={() => handleDelete(record.id)}
//           >
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Title level={3}>Quản lý mã khuyến mãi</Title>

//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         style={{ marginBottom: 16 }}
//         onClick={() => setOpenCreate(true)}
//       >
//         Thêm mã
//       </Button>

//       <Table
//         rowKey="id"
//         loading={loading}
//         columns={columns}
//         dataSource={promotions}
//       />

//       <CreatePromotionModal
//         open={openCreate}
//         onClose={() => setOpenCreate(false)}
//         onSuccess={fetchPromotions}
//       />

//       <EditPromotionModal
//         open={openEdit}
//         promotion={selectedPromotion}
//         onClose={() => setOpenEdit(false)}
//         onSuccess={fetchPromotions}
//       />
//     </>
//   );
// }

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Typography,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PercentageOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import promotionService from "../../../services/Admin/promotionService";
import CreatePromotionModal from "./CreatePromotionModal";
import EditPromotionModal from "./EditPromotionModal";

// 1. IMPORT FILE CSS THUẦN (Không dùng SCSS)
import "../../../styles/Admin/PromotionManagement.css";

const { Title, Text } = Typography;

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
      message.error("Không thể tải danh sách khuyến mãi");
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
      message.success("Xóa khuyến mãi thành công");
      fetchPromotions();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const columns = [
    {
      title: "Mã Code",
      dataIndex: "code",
      key: "code",
      render: (text) => (
        <Text strong style={{ fontSize: "15px", color: "#3e79f7" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Giảm (%)",
      dataIndex: "discountPercentage",
      align: "center",
      render: (v) => (
        <Tag color="success" style={{ fontWeight: 600 }}>
          <PercentageOutlined style={{ marginRight: 4 }} />
          {v}%
        </Tag>
      ),
    },
    {
      title: "Thời gian áp dụng",
      width: 250,
      render: (_, r) => (
        <div className="date-cell">
          <div className="date-row">
            <CalendarOutlined style={{ color: "#52c41a", marginRight: 6 }} />
            <span>{new Date(r.validFrom).toLocaleDateString()}</span>
          </div>
          <div className="date-row">
            <CalendarOutlined style={{ color: "#ff4d4f", marginRight: 6 }} />
            <span>{new Date(r.validTo).toLocaleDateString()}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Đã dùng",
      dataIndex: "timesUsed",
      align: "center",
      render: (v) => (
        <Tag color="processing" style={{ borderRadius: "10px" }}>
          {v ?? 0} lần
        </Tag>
      ),
    },
    {
      title: "Giới hạn",
      dataIndex: "usageLimit",
      align: "center",
      render: (v) =>
        v === null ? (
          <Tag color="default">Không giới hạn</Tag>
        ) : (
          <Tag color="warning">{v}</Tag>
        ),
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              className="btn-edit"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedPromotion(record);
                setOpenEdit(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa mã khuyến mãi?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Xóa">
              <Button danger className="btn-delete" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    // Wrapper class đồng nhất với trang Báo cáo
    <div className="page-wrapper">
      {/* Header Section */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Quản lý mã khuyến mãi</h2>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="btn-primary-custom"
          onClick={() => setOpenCreate(true)}
        >
          Thêm mã mới
        </Button>
      </div>

      {/* Table Section: Dùng card trắng bo góc giống hệt Report */}
      <div className="content-card">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={promotions}
          pagination={{ pageSize: 8, showSizeChanger: false }}
        />
      </div>

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
