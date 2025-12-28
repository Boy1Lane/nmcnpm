import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ConcessionsPage.css';

const ConcessionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ trang BookingPage gửi sang
  const state = location.state || {};
  const { selectedSeats = [], ticketPrice = 0, scheduleId } = state;

  // Dữ liệu Combo giả lập
  const [combos, setCombos] = useState([
    { id: 1, name: "Combo Solo (1 Bắp + 1 Nước)", price: 89000, quantity: 0, img: "https://cdn-icons-png.flaticon.com/512/3063/3063065.png" },
    { id: 2, name: "Combo Couple (1 Bắp + 2 Nước)", price: 109000, quantity: 0, img: "https://cdn-icons-png.flaticon.com/512/5783/5783068.png" },
    { id: 3, name: "Combo Party (2 Bắp + 4 Nước)", price: 199000, quantity: 0, img: "https://cdn-icons-png.flaticon.com/512/2553/2553691.png" },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Hàm tăng giảm số lượng
  const updateQuantity = (id, delta) => {
    setCombos(combos.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  // Hàm kiểm tra mã giảm giá
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "GIAM10K") {
      setDiscount(10000);
      alert("✅ Áp dụng mã GIAM10K thành công!");
    } else {
      setDiscount(0);
      alert("❌ Mã giảm giá không hợp lệ.");
    }
  };

  // Tính toán tổng tiền
  const totalCombos = combos.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalPrice = Math.max(0, ticketPrice + totalCombos - discount);

  const handlePayment = () => {
    // Chuyển sang trang Thanh Toán (PaymentPage)
    // Gửi kèm tất cả thông tin để in hóa đơn
    const selectedCombos = combos.filter(c => c.quantity > 0);
    
    navigate('/payment', { 
      state: { 
        selectedSeats, 
        selectedCombos, 
        totalTickets: ticketPrice, 
        totalCombos,
        discount,
        finalPrice,
        scheduleId
      } 
    });
  };

  return (
    <div className="concessions-container">
      <div className="concessions-content">
        <h2>🍿 Chọn Bắp Nước & Ưu Đãi</h2>
        
        {/* Danh sách Combo */}
        <div className="combo-list">
          {combos.map(item => (
            <div key={item.id} className="combo-item">
              <img src={item.img} alt={item.name} className="combo-img" />
              <div className="combo-info">
                <h3>{item.name}</h3>
                <p className="combo-price">{item.price.toLocaleString()} đ</p>
              </div>
              <div className="quantity-control">
                <button className="btn-qty" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity === 0}>-</button>
                <span style={{fontWeight:'bold', fontSize:'1.2rem'}}>{item.quantity}</span>
                <button className="btn-qty" onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Nhập mã giảm giá */}
        <div className="promo-section">
          <input 
            type="text" 
            className="promo-input" 
            placeholder="Nhập mã giảm giá (Thử: GIAM10K)" 
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button className="btn-apply" onClick={handleApplyPromo}>Áp dụng</button>
        </div>
      </div>

      {/* Thanh tổng tiền & Tiếp tục */}
      <div className="booking-summary">
        <div className="info">
          <p>Ghế: {selectedSeats.length}</p>
          <p>Bắp nước: {combos.reduce((acc,c) => acc + c.quantity, 0)}</p>
          {discount > 0 && <p style={{color: '#2ecc71'}}>Voucher: -{discount.toLocaleString()} đ</p>}
          <p style={{marginTop: '5px'}}>Tổng: <strong style={{color: '#f1c40f', fontSize: '22px'}}>
            {finalPrice.toLocaleString()} đ
          </strong></p>
        </div>
        <button className="btn-next" onClick={handlePayment}>
          THANH TOÁN ➔
        </button>
      </div>
    </div>
  );
};

export default ConcessionsPage;