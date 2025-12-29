import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import './ConcessionsPage.css'; // Bạn tự tạo file CSS nhé

const ConcessionsPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận dữ liệu từ trang Chọn Ghế
  const { selectedSeatIds, seatsPrice } = location.state || {};

  const [foods, setFoods] = useState([]); // Danh sách món từ DB
  const [cart, setCart] = useState({}); // Giỏ hàng: { foodId: quantity }
  const [loading, setLoading] = useState(true);

  // 1. Tải danh sách Combo từ Server
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

  // 2. Xử lý tăng giảm số lượng
  const updateQuantity = (foodId, delta) => {
    setCart(prev => {
      const currentQty = prev[foodId] || 0;
      const newQty = Math.max(0, currentQty + delta); // Không cho âm
      return { ...prev, [foodId]: newQty };
    });
  };

  // 3. Tính tổng tiền (Ghế + Đồ ăn)
  const calculateFoodTotal = () => {
    return foods.reduce((total, food) => {
      const qty = cart[food.id] || 0;
      return total + (food.price * qty);
    }, 0);
  };

  const foodTotal = calculateFoodTotal();
  const finalTotal = (seatsPrice || 0) + foodTotal;

  // 4. Chuyển sang trang Thanh Toán
  const handleNext = () => {
    // Chuyển danh sách món đã chọn thành mảng để gửi đi
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
        selectedFoods // Truyền thêm đồ ăn sang trang thanh toán
      }
    });
  };

  if (!location.state) {
    return <div className="p-10 text-center">Vui lòng chọn ghế trước!</div>;
  }

  return (
    <div className="concessions-page">
      <h2>Chọn Bắp & Nước</h2>
      
      {loading ? <p>Đang tải menu...</p> : (
        <div className="food-list">
          {foods.map(item => (
            <div key={item.id} className="food-item">
              <div className="food-info">
                <h3>{item.name}</h3>
                <p>{item.items}</p> {/* Mô tả: 1 Bắp + 1 Nước... */}
                <span className="price">{item.price.toLocaleString()} đ</span>
              </div>
              
              <div className="quantity-control">
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{cart[item.id] || 0}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="booking-footer">
        <div className="total-info">
          <p>Ghế: {seatsPrice?.toLocaleString()} đ</p>
          <p>Bắp nước: {foodTotal.toLocaleString()} đ</p>
          <h3>Tổng cộng: {finalTotal.toLocaleString()} đ</h3>
        </div>
        <button onClick={handleNext} className="btn-continue">
          Thanh Toán
        </button>
      </div>
    </div>
  );
};

export default ConcessionsPage;