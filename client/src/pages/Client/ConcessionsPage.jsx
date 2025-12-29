import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// Cập nhật đường dẫn đến service trong thư mục Client
import bookingService from '../../services/Client/bookingService'; 
// Cập nhật đường dẫn CSS
import './ConcessionsPage.css'; 

const ConcessionsPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận dữ liệu từ trang Chọn Ghế truyền sang qua state của react-router-dom
  const { selectedSeatIds, seatsPrice } = location.state || {};

  const [foods, setFoods] = useState([]); // Danh sách món từ Database
  const [cart, setCart] = useState({}); // Giỏ hàng lưu dưới dạng: { foodId: quantity }
  const [loading, setLoading] = useState(true);

  // 1. Tải danh sách Combo/Thức ăn từ Server
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getFoods();
        setFoods(data);
      } catch (error) {
        console.error("Lỗi tải combo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // 2. Hàm xử lý tăng/giảm số lượng món ăn
  const updateQuantity = (foodId, delta) => {
    setCart(prev => {
      const currentQty = prev[foodId] || 0;
      const newQty = Math.max(0, currentQty + delta); // Đảm bảo số lượng không âm
      return { ...prev, [foodId]: newQty };
    });
  };

  // 3. Tính toán tổng số tiền của riêng phần đồ ăn
  const calculateFoodTotal = () => {
    return foods.reduce((total, food) => {
      const qty = cart[food.id] || 0;
      return total + (food.price * qty);
    }, 0);
  };

  const foodTotal = calculateFoodTotal();
  const finalTotal = (seatsPrice || 0) + foodTotal;

  // 4. Chuyển tiếp sang trang Thanh Toán (PaymentPage)
  const handleNext = () => {
    // Lọc ra danh sách các món khách hàng thực sự chọn (số lượng > 0)
    const selectedFoods = foods
      .filter(food => cart[food.id] > 0)
      .map(food => ({
        id: food.id,
        name: food.name,
        price: food.price,
        quantity: cart[food.id]
      }));

    navigate(`/payment/${scheduleId}`, {
      state: {
        selectedSeatIds,
        seatsPrice,
        selectedFoods // Gửi thông tin đồ ăn kèm theo để thanh toán
      }
    });
  };

  // Bảo vệ route: Nếu người dùng truy cập trực tiếp mà chưa chọn ghế, yêu cầu quay lại trang trước
  if (!location.state) {
    return (
      <div className="p-10 text-center">
        <p>Vui lòng chọn ghế trước khi đặt bắp nước!</p>
        <button onClick={() => navigate(-1)} className="btn-back">Quay lại</button>
      </div>
    );
  }

  return (
    <div className="concessions-page">
      <h2 className="section-title">Chọn Bắp & Nước</h2>
      
      {loading ? (
        <div className="loading-spinner">Đang tải menu...</div>
      ) : (
        <div className="food-list">
          {foods.map(item => (
            <div key={item.id} className="food-item-card">
              <div className="food-info">
                <h3 className="food-name">{item.name}</h3>
                <p className="food-description">{item.items || 'Combo bắp nước hấp dẫn'}</p> 
                <span className="food-price">{item.price.toLocaleString()} đ</span>
              </div>
              
              <div className="quantity-control">
                <button 
                  className="btn-qty" 
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>
                <span className="qty-display">{cart[item.id] || 0}</span>
                <button 
                  className="btn-qty" 
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer chứa thông tin tổng hợp giá tiền */}
      <div className="booking-footer">
        <div className="total-summary">
          <div className="summary-line">
            <span>Tiền ghế:</span>
            <span>{seatsPrice?.toLocaleString()} đ</span>
          </div>
          <div className="summary-line">
            <span>Bắp nước:</span>
            <span>{foodTotal.toLocaleString()} đ</span>
          </div>
          <div className="final-line">
            <h3>Tổng cộng:</h3>
            <h3 className="final-price">{finalTotal.toLocaleString()} đ</h3>
          </div>
        </div>
        <button onClick={handleNext} className="btn-continue">
          Tiếp tục Thanh Toán
        </button>
      </div>
    </div>
  );
};

export default ConcessionsPage;