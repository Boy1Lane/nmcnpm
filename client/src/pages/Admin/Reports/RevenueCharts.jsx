import { Column } from "@ant-design/charts";
import dayjs from "dayjs";

export default function RevenueChart({ bookings = [] }) {
  // 1️⃣ Gộp doanh thu theo ngày
  const map = {};

  bookings.forEach((b) => {
    if (!b?.createdAt || !b?.totalPrice) return;
    const key = dayjs(b.createdAt).format("YYYY-MM-DD");
    map[key] = (map[key] || 0) + Number(b.totalPrice);
  });

  // 2️⃣ Sort theo ngày thật
  const data = Object.keys(map)
    .sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf())
    .map((key) => ({
      date: dayjs(key).format("DD/MM"),
      revenue: map[key],
    }));

  const config = {
    data,
    xField: "date",
    yField: "revenue",
    height: 260,
    color: "#6366f1",

    // ✅ LABEL AN TOÀN – KHÔNG BAO GIỜ CRASH
    label: {
      position: "top",
      offset: 6,
      formatter: (value) => {
        const num = Number(value);
        if (Number.isNaN(num) || num <= 0) return "";

        return num >= 1_000_000
          ? `${(num / 1_000_000).toFixed(1)}M`
          : num.toLocaleString();
      },
      style: {
        fontSize: 12,
        fontWeight: 600,
        fill: "#333",
      },
    },

    // ❌ TẮT TOOLTIP (không dùng nữa)
    tooltip: false,

    columnStyle: {
      radius: [6, 6, 0, 0],
    },
  };

  return <Column {...config} />;
}
