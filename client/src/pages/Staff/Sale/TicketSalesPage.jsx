import { useEffect, useState } from "react";
import { message, Modal } from "antd"; // Import Ant Design
import ticketSaleService from "../../../services/Admin/ticketSaleService";
import "../../../styles/Admin/TicketsSale.css";

const TicketSalesPage = () => {
  // ================= STATE (GIỮ NGUYÊN) =================
  const [step, setStep] = useState(1);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [showtimeSeats, setShowtimeSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState({});
  const [bookingId, setBookingId] = useState(null);
  const [seatTotal, setSeatTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  // ===== PROMOTION =====
  const [promoCode, setPromoCode] = useState("");
  const [promotionId, setPromotionId] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isAddingFoods, setIsAddingFoods] = useState(false);

  const foodTotal = Object.values(selectedFoods).reduce(
    (sum, f) => sum + f.price * f.qty,
    0
  );

  const grandTotal = Math.max(0, seatTotal + foodTotal - discountAmount);
  // ===== VIETQR CONFIG =====
  const BANK_ID = "MB";
  const ACCOUNT_NO = "0389523487";
  const ACCOUNT_NAME = "CINEMA ADMIN";

  const qrUrl =
    bookingId && paymentMethod === "BANKING"
      ? `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact.png?amount=${grandTotal}&addInfo=BOOKING-${bookingId}`
      : null;

  // ================= LOAD DATA (GIỮ NGUYÊN) =================

  const loadMovies = async () => {
    try {
      const res = await ticketSaleService.getMovies();
      const showingMovies = res.data.filter(
        (m) => m.status === "showing" || m.status === "coming_soon"
      );
      setMovies(showingMovies);
    } catch (err) {
      console.error("Load movies error", err);
      message.error("Lỗi khi tải danh sách phim!");
    }
  };

  const loadShowtimesByMovie = async (movieId) => {
    try {
      const res = await ticketSaleService.getShowtimes();
      const filtered = res.data.filter((st) => st.Movie?.id === movieId);
      setShowtimes(filtered);
    } catch (err) {
      console.error("Load showtimes error", err);
    }
  };

  const loadCinemas = async () => {
    try {
      const res = await ticketSaleService.getCinemas();
      setCinemas(res.data);
    } catch (err) {
      console.error("Load cinemas error", err);
    }
  };

  const loadSeatsByShowtime = async (showtime) => {
    try {
      const showtimeSeatRes = await ticketSaleService.getShowtimeSeats(
        showtime.id
      );
      const roomSeatRes = await ticketSaleService.getRoomSeats(
        showtime.Room.id
      );

      const roomSeatsMap = {};
      roomSeatRes.data.forEach((seat) => {
        roomSeatsMap[seat.id] = seat;
      });

      const merged = showtimeSeatRes.data.map((sts) => ({
        ...sts,
        Seat: roomSeatsMap[sts.seatId],
      }));

      setShowtimeSeats(merged);
      setSelectedSeats([]);
      setSeatTotal(0);
    } catch (err) {
      console.error("Load seats error", err);
      message.error("Lỗi tải sơ đồ ghế!");
    }
  };

  const loadFoods = async () => {
    try {
      const res = await ticketSaleService.getFoods();
      setFoods(res.data);
    } catch (err) {
      console.error("Load foods error", err);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const toggleSeat = (seat) => {
    if (seat.status !== "AVAILABLE") return;

    const exists = selectedSeats.find((s) => s.id === seat.id);

    const updated = exists
      ? selectedSeats.filter((s) => s.id !== seat.id)
      : [...selectedSeats, seat];

    setSelectedSeats(updated);
    setSeatTotal(updated.reduce((sum, s) => sum + s.price, 0));
  };

  const handleCreateBooking = async () => {
    if (!selectedShowtime || !selectedShowtime.id) {
      message.error("Suất chiếu chưa hợp lệ, vui lòng chọn lại!");
      return;
    }
    if (selectedSeats.length === 0) {
      return message.warning("Vui lòng chọn ghế trước khi tiếp tục!");
    }

    try {
      const staffId = JSON.parse(localStorage.getItem("user"))?.id;
      const res = await ticketSaleService.createBooking({
        userId: staffId,
        showtimeId: selectedShowtime.id,
        seatIds: selectedSeats.map((s) => s.id),
      });

      const newBookingId =
        res.data?.booking?.id || res.data?.data?.id || res.data?.id;
      setBookingId(newBookingId);

      message.success("Giữ ghế thành công!");

      loadFoods();
      setStep(4);
    } catch (err) {
      console.error(err);
      message.error("Không thể giữ ghế. Vui lòng thử lại!");
    }
  };

  const changeFoodQty = (food, delta) => {
    setSelectedFoods((prev) => {
      const current = prev[food.id] || { ...food, qty: 0 };
      const qty = Math.max(0, current.qty + delta);

      if (qty === 0) {
        const clone = { ...prev };
        delete clone[food.id];
        return clone;
      }
      return { ...prev, [food.id]: { ...food, qty } };
    });
  };

  const applyPromotion = async () => {
    if (!promoCode) {
      return message.warning("Vui lòng nhập mã khuyến mãi!");
    }

    try {
      setIsApplyingPromo(true);
      const res = await ticketSaleService.applyPromotion({
        code: promoCode,
        totalAmount: seatTotal + foodTotal,
      });

      setPromotionId(res.data.promotionId);
      setDiscountAmount(res.data.discountAmount);
      message.success(
        `Áp mã thành công, giảm ${res.data.discountAmount.toLocaleString()}đ`
      );
    } catch (err) {
      message.error(
        err.response?.data?.message || "Mã khuyến mãi không hợp lệ"
      );
      setPromotionId(null);
      setDiscountAmount(0);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!bookingId) {
      return message.error(
        "Chưa có thông tin booking. Vui lòng thực hiện bước giữ ghế trước."
      );
    }

    try {
      setIsConfirming(true);
      const foodItems = Object.values(selectedFoods).map((f) => ({
        foodComboId: f.id,
        quantity: f.qty,
      }));

      // Xử lý thêm món ăn (nếu có)
      if (foodItems.length > 0) {
        setIsAddingFoods(true);
        await ticketSaleService.addFoods(bookingId, foodItems);
        setIsAddingFoods(false);
      }

      // Xác nhận thanh toán
      await ticketSaleService.confirmBooking(bookingId, {
        promotionId,
        discountAmount,
        finalAmount: grandTotal,
        paymentMethod: paymentMethod,
      });

      message.success("Thanh toán thành công!");
      // Delay reload một chút để người dùng kịp đọc thông báo
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Confirm payment error", err);
      message.error(err.response?.data?.message || "Thanh toán thất bại!");
    } finally {
      setIsConfirming(false);
    }
  };

  // Sử dụng Modal.confirm thay cho window.confirm
  const handleCancel = () => {
    Modal.confirm({
      title: "Xác nhận hủy",
      content: "Bạn có chắc chắn muốn hủy booking này không?",
      okText: "Đồng ý hủy",
      okType: "danger",
      cancelText: "Quay lại",
      onOk: async () => {
        try {
          await ticketSaleService.cancelBooking(bookingId);
          message.success("Đã huỷ booking thành công");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (err) {
          message.error("Lỗi khi hủy booking");
          console.error(err);
        }
      },
    });
  };

  // ================= UI HELPERS =================
  const renderStepper = () => (
    <div className="stepper">
      {[
        { num: 1, label: "Phim" },
        { num: 2, label: "Suất chiếu" },
        { num: 3, label: "Ghế" },
        { num: 4, label: "Dịch vụ" },
        { num: 5, label: "Thanh toán" },
      ].map((s) => (
        <div
          key={s.num}
          className={`step-item ${step === s.num ? "active" : ""}`}
        >
          <div className="step-number">{s.num}</div>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );

  // ================= RENDER MAIN =================
  return (
    <div className="ticket-sales-wrapper">
      <h2 className="page-title">Quầy Bán Vé</h2>

      {renderStepper()}

      <div className="main-card">
        {/* STEP 1: CHỌN PHIM */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="section-header">Chọn phim đang chiếu</h3>
            <div className="movie-grid">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="movie-card"
                  onClick={() => {
                    setSelectedMovie(movie);
                    loadShowtimesByMovie(movie.id);
                    loadCinemas();
                    setSelectedCinema(null);
                    setStep(2);
                  }}
                >
                  <img
                    src={movie.posterUrl}
                    className="movie-poster"
                    alt={movie.title}
                  />
                  <div className="movie-title">{movie.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: CHỌN SUẤT CHIẾU */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 className="section-header">
              <span>Chọn suất chiếu</span>
              <span style={{ color: "var(--primary)", fontSize: "0.9em" }}>
                {selectedMovie?.title}
              </span>
            </h3>

            <div className="filter-bar">
              <label style={{ fontWeight: 600, color: "var(--text-sub)" }}>
                Lọc theo rạp:
              </label>
              <select
                className="custom-select"
                value={selectedCinema?.id || ""}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null;
                  const c = cinemas.find((x) => x.id === id) || null;
                  setSelectedCinema(c);
                }}
              >
                <option value="">-- Tất cả các rạp --</option>
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCinema ? (
              <div className="showtime-grid">
                {showtimes
                  .filter((st) => {
                    const cinemaId =
                      st.Room?.Cinema?.id ||
                      st.Room?.cinemaId ||
                      st.Room?.cinema?.id;
                    return cinemaId === selectedCinema.id;
                  })
                  .map((st) => (
                    <div
                      key={st.id}
                      className="showtime-pill"
                      onClick={() => {
                        if (!st?.id) {
                          message.error("Suất chiếu không hợp lệ!");
                          return;
                        }
                        setSelectedShowtime(st);
                        loadSeatsByShowtime(st);
                        setStep(3);
                      }}
                    >
                      <div className="st-time">
                        {new Date(st.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="st-room">Phòng {st.Room?.name}</div>
                    </div>
                  ))}
                {showtimes.filter(
                  (st) =>
                    (st.Room?.Cinema?.id || st.Room?.cinemaId) ===
                    selectedCinema.id
                ).length === 0 && (
                  <p
                    style={{
                      color: "var(--text-sub)",
                      width: "100%",
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    Không có suất chiếu tại rạp này.
                  </p>
                )}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  color: "var(--text-sub)",
                  background: "#f8fafc",
                  borderRadius: 12,
                  border: "1px dashed #cbd5e1",
                }}
              >
                👈 Vui lòng chọn một rạp để xem giờ chiếu.
              </div>
            )}

            <div className="action-bar">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                ⬅ Quay lại
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CHỌN GHẾ */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h3 className="section-header">Sơ đồ ghế</h3>

            <div className="screen-display"></div>

            <div className="seat-map-container">
              {(() => {
                const seatsByRow = {};
                showtimeSeats.forEach((seat) => {
                  // if (seat.Seat?.type === "COUPLE") return;
                  const row = seat.Seat?.row;
                  if (!seatsByRow[row]) {
                    seatsByRow[row] = [];
                  }
                  seatsByRow[row].push(seat);
                });
                const sortedRows = Object.keys(seatsByRow).sort();

                return sortedRows.map((rowLabel) => (
                  <div key={rowLabel} className="seat-row">
                    <div className="row-label">{rowLabel}</div>
                    <div className="row-seats-group">
                      {seatsByRow[rowLabel]
                        .sort((a, b) => a.Seat.number - b.Seat.number)
                        .map((seat) => {
                          const vip = seat.Seat?.type === "VIP";
                          const selected = selectedSeats.some(
                            (s) => s.id === seat.id
                          );
                          const isAvailable = seat.status === "AVAILABLE";

                          let seatClass = "seat-btn";
                          if (!isAvailable) seatClass += " s-sold";
                          else if (selected) seatClass += " s-selected";
                          else if (vip) seatClass += " s-vip";
                          else seatClass += " s-avail";

                          return (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat)}
                              disabled={!isAvailable}
                              className={seatClass}
                              title={`Hàng: ${seat.Seat?.row} - Số: ${seat.Seat?.number}`}
                            >
                              {seat.Seat?.number}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 24,
                marginBottom: 32,
                fontSize: "14px",
                color: "var(--text-sub)",
                background: "#f8fafc",
                padding: "12px",
                borderRadius: "8px",
                width: "fit-content",
                margin: "0 auto 32px auto",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    background: "white",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                  }}
                ></span>
                Thường
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    background: "white",
                    border: "2px solid var(--warning)",
                    borderRadius: 6,
                  }}
                ></span>
                VIP
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    background: "var(--primary-gradient)",
                    borderRadius: 6,
                  }}
                ></span>
                Đang chọn
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    background: "#e2e8f0",
                    borderRadius: 6,
                  }}
                ></span>
                Đã bán
              </div>
            </div>

            <div className="total-bar">
              Tạm tính:{" "}
              <span style={{ color: "var(--primary)", fontSize: "24px" }}>
                {seatTotal.toLocaleString()} đ
              </span>
            </div>

            <div className="action-bar">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                ⬅ Quay lại
              </button>
              <button className="btn btn-primary" onClick={handleCreateBooking}>
                Giữ ghế ➡
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: BẮP NƯỚC & KHUYẾN MÃI */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h3 className="section-header">Dịch vụ & khuyến mãi</h3>
            <div
              style={{
                marginBottom: 24,
                background: "#eff6ff",
                color: "#1d4ed8",
                padding: "10px 16px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              <span>Booking ID:</span>
              <span style={{ fontFamily: "monospace", fontSize: "16px" }}>
                {bookingId || "—"}
              </span>
            </div>

            <div className="food-list">
              {foods.map((f) => (
                <div key={f.id} className="food-item">
                  <div className="food-info">
                    <img src={f.pictureUrl} className="food-img" alt={f.name} />
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "15px",
                          color: "var(--text-main)",
                        }}
                      >
                        {f.name}
                      </div>
                      <div
                        style={{
                          color: "var(--primary)",
                          fontWeight: 600,
                          marginTop: 4,
                        }}
                      >
                        {f.price.toLocaleString()} đ
                      </div>
                    </div>
                  </div>

                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => changeFoodQty(f, -1)}
                      disabled={isAddingFoods}
                    >
                      -
                    </button>
                    <span
                      style={{
                        width: 30,
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      {selectedFoods[f.id]?.qty || 0}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={() => changeFoodQty(f, 1)}
                      disabled={isAddingFoods}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="promo-section"
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <h4
                style={{
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "15px",
                  color: "var(--text-main)",
                }}
              >
                Mã khuyến mãi
              </h4>
              <div className="input-group">
                <input
                  className="custom-input"
                  placeholder="Nhập mã khuyến mãi..."
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={applyPromotion}
                  disabled={isApplyingPromo}
                >
                  Áp dụng
                </button>
              </div>
              {discountAmount > 0 && (
                <p
                  style={{
                    color: "var(--success)",
                    marginTop: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  ✅ Đã giảm: -{discountAmount.toLocaleString()}đ
                </p>
              )}
            </div>

            <div className="total-bar" style={{ marginTop: 24 }}>
              Tổng cộng:{" "}
              <span style={{ color: "var(--primary)", fontSize: "24px" }}>
                {grandTotal.toLocaleString()} đ
              </span>
            </div>

            <div className="action-bar">
              <button className="btn btn-primary" onClick={() => setStep(5)}>
                Đến bước thanh toán ➡
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: THANH TOÁN */}
        {step === 5 && (
          <div
            className="animate-fade-in"
            style={{ maxWidth: 600, margin: "0 auto" }}
          >
            <h3
              className="section-header"
              style={{ justifyContent: "center", borderBottom: "none" }}
            >
              XÁC NHẬN THANH TOÁN
            </h3>

            <div className="payment-summary">
              <div className="payment-row">
                <span>Vé ghế ({selectedSeats.length}):</span>
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                  {seatTotal.toLocaleString()} đ
                </span>
              </div>
              <div className="payment-row">
                <span>Bắp nước:</span>
                <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                  {foodTotal.toLocaleString()} đ
                </span>
              </div>
              <div className="payment-row">
                <span>Giảm giá:</span>
                <span style={{ color: "var(--danger)", fontWeight: 600 }}>
                  -{discountAmount.toLocaleString()} đ
                </span>
              </div>
              <div className="payment-row total">
                <span>THÀNH TIỀN</span>
                <span>{grandTotal.toLocaleString()} VND</span>
              </div>
            </div>

            <h4
              style={{
                marginBottom: 16,
                fontWeight: 700,
                fontSize: "14px",
                color: "var(--text-sub)",
              }}
            >
              Phương thức thanh toán
            </h4>
            <div className="payment-methods">
              <div
                className={`method-card ${
                  paymentMethod === "CASH" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("CASH")}
              >
                <span
                  style={{
                    fontSize: "24px",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  💵
                </span>
                Tiền mặt
              </div>
              <div
                className={`method-card ${
                  paymentMethod === "BANKING" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("BANKING")}
              >
                <span
                  style={{
                    fontSize: "24px",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  💳
                </span>
                Chuyển khoản / Thẻ
              </div>
            </div>

            {paymentMethod === "BANKING" && qrUrl && (
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 24,
                  animation: "fadeIn 0.5s",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    background: "white",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={qrUrl}
                    width={200}
                    alt="VietQR"
                    style={{ borderRadius: "8px" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/200?text=QR+Error";
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-sub)",
                    marginTop: 12,
                    lineHeight: "1.5",
                  }}
                >
                  Quét mã để thanh toán
                  <br />
                  <span
                    style={{
                      background: "#eef2ff",
                      color: "var(--primary)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "700",
                    }}
                  >
                    Nội dung: BOOKING-{bookingId}
                  </span>
                </p>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginTop: 32,
              }}
            >
              <button
                className="btn btn-primary"
                onClick={handleConfirmPayment}
                disabled={!bookingId || isConfirming}
                style={{ width: "100%", padding: "16px", fontSize: "16px" }}
              >
                {isConfirming ? "Đang xử lý..." : "XÁC NHẬN THANH TOÁN"}
              </button>

              <button
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={!bookingId || isConfirming}
                style={{ width: "100%", padding: "16px", fontSize: "16px" }}
              >
                HỦY
              </button>
            </div>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <button
                className="btn"
                style={{
                  background: "none",
                  color: "var(--text-sub)",
                  textDecoration: "underline",
                }}
                onClick={() => setStep(4)}
              >
                ⬅ Quay lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketSalesPage;
