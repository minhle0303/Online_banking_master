import React, { useEffect, useState } from 'react'; // Import thư viện React và các hook useEffect, useState
import CurrencySelect from './CurrencySelect'; // Import component CurrencySelect từ file CurrencySelect.js

function ConverterForm() {
  // Khởi tạo state với giá trị mặc định và các hàm cập nhật state
  const [amount, setAmount] = useState(100); // Số tiền nhập vào
  const [fromCurrency, setFromCurrency] = useState("USD"); // Loại tiền tệ gốc
  const [toCurrency, setToCurrency] = useState("INR"); // Loại tiền tệ mục tiêu
  const [result, setResult] = useState(""); // Kết quả chuyển đổi tiền tệ
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải dữ liệu từ API
  const [topCurrencies, setTopCurrencies] = useState([]); // Dữ liệu tỷ giá của các loại tiền tệ hàng đầu

  const API_KEY = process.env.REACT_APP_API_KEY; // Lấy API key từ biến môi trường
  const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`; // Địa chỉ API với API key

  // Hàm để hoán đổi loại tiền tệ gốc và mục tiêu
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency); // Đặt loại tiền tệ gốc thành loại tiền tệ mục tiêu
    setToCurrency(fromCurrency); // Đặt loại tiền tệ mục tiêu thành loại tiền tệ gốc
  }

  // Hàm để lấy tỷ giá chuyển đổi từ API
  const getExchangeRate = async () => {
    if (!API_KEY) {
      console.error("API key is not defined"); // Kiểm tra API key có tồn tại không
      return;
    }

    const API_URL = `${BASE_URL}/pair/${fromCurrency}/${toCurrency}`; // Địa chỉ API để lấy tỷ giá giữa hai loại tiền tệ
    setIsLoading(true); // Bắt đầu trạng thái tải
    try {
      const response = await fetch(API_URL); // Gửi yêu cầu API
      if (!response.ok) throw new Error("Something went wrong!"); // Kiểm tra lỗi phản hồi

      const data = await response.json(); // Chuyển đổi phản hồi thành JSON
      const rate = (data.conversion_rate * amount).toFixed(2); // Tính toán tỷ giá và định dạng kết quả
      setResult(`${amount} ${fromCurrency} = ${rate} ${toCurrency}`); // Cập nhật kết quả
    } catch (error) {
      console.log(error); // Ghi lỗi nếu có
    } finally {
      setIsLoading(false); // Kết thúc trạng thái tải
    }
  }

  // Hàm để lấy dữ liệu tỷ giá của các loại tiền tệ hàng đầu so với INR
  const getTopCurrencies = async () => {
    if (!API_KEY) {
      console.error("API key is not defined"); // Kiểm tra API key có tồn tại không
      return;
    }

    const currencies = ["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "SGD", "CNY", "OMR"]; // Danh sách các loại tiền tệ hàng đầu
    const promises = currencies.map(currency => 
      fetch(`${BASE_URL}/pair/${currency}/INR`) // Gửi yêu cầu API cho mỗi loại tiền tệ
    );

    try {
      const responses = await Promise.all(promises); // Đợi tất cả các yêu cầu API hoàn tất
      const data = await Promise.all(responses.map(response => response.json())); // Chuyển đổi tất cả các phản hồi thành JSON
      const topCurrenciesData = data.map((result, index) => {
        return {
          currency: currencies[index], // Tên loại tiền tệ
          buyPrice: result.conversion_rate.toFixed(2), // Giá mua (tỷ giá hiện tại)
          // Giả định rằng giá bán cao hơn giá mua khoảng 1% để thể hiện chi phí giao dịch
          sellPrice: (result.conversion_rate * 1.01).toFixed(2) 
        };
      });
      setTopCurrencies(topCurrenciesData); // Cập nhật dữ liệu tỷ giá của các loại tiền tệ hàng đầu
    } catch (error) {
      console.log(error); // Ghi lỗi nếu có
    }
  }

  // useEffect để gọi hàm getExchangeRate và getTopCurrencies mỗi khi fromCurrency, toCurrency, hoặc amount thay đổi
  useEffect(() => {
    getExchangeRate();
    getTopCurrencies();
  }, [fromCurrency, toCurrency, amount]);

  // JSX để hiển thị giao diện người dùng
  return (
    <div className='main-content-user'>
      <div className='currency-container'>
        <div className='currency-row'>
          <div className="currency-conveter">
            <h2 className='converter-title'>Currency Converter</h2>
            <form className='converter-form' onSubmit={(e) => { e.preventDefault(); getExchangeRate(); }}>
              <div className='form-group'>
                <label className='form-label'>Enter Amount</label>
                <input 
                  type="number" 
                  className='form-input' 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  required 
                />
              </div>
              <div className='form-group form-currency-group'>
                <div className='form-section'>
                  <label className='form-label'>From</label>
                  <CurrencySelect
                    SelectedCurrency={fromCurrency} // Loại tiền tệ gốc
                    handleCurrency={e => setFromCurrency(e.target.value)} // Cập nhật loại tiền tệ gốc
                  />
                </div>
                <div className='swap-icon' onClick={handleSwapCurrencies}>
                  <svg width="16" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
                      fill="#fff"
                    />
                  </svg>
                </div>
                <div className='form-section'>
                  <label className='form-label'>To</label>
                  <CurrencySelect
                    SelectedCurrency={toCurrency} // Loại tiền tệ mục tiêu
                    handleCurrency={e => setToCurrency(e.target.value)} // Cập nhật loại tiền tệ mục tiêu
                  />
                </div>
              </div>

              <button 
                type='submit' 
                className={`${isLoading ? "loading" : ""} submit-button`}
              >
                Get Exchange Rate
              </button>
              <p className="exchange-rate-result">
                {isLoading ? "Getting exchange rate ...." : result} {/* Hiển thị kết quả hoặc thông báo đang tải */}
              </p>
            </form>
          </div>

          <div className="top-currencies-table">
            <h2>Top 10 Traded Currencies Compared to INR</h2>
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Buy Price</th>
                  <th>Sell Price</th>
                </tr>
              </thead>
              <tbody>
                {topCurrencies.length === 0 ? (
                  <tr>
                    <td colSpan="3">Loading...</td> {/* Hiển thị thông báo đang tải khi dữ liệu chưa có */}
                  </tr>
                ) : (
                  topCurrencies.map((currency, index) => (
                    <tr key={index}>
                      <td >{currency.currency}</td>
                      <td className="buy-price">{currency.buyPrice}</td>
                      <td className="buy-price">{currency.sellPrice}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConverterForm; // Xuất component ConverterForm để sử dụng ở các file khác












// import React, { useEffect, useState } from 'react';
// import CurrencySelect from './CurrencySelect';

// function ConverterForm() {
//   const [amount, setAmount] = useState(100);
//   const [fromCurrency, setFromCurrency] = useState("USD");
//   const [toCurrency, setToCurrency] = useState("INR");
//   const [result, setResult] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Xử lý đổi chỗ các loại tiền tệ
//   const handleSwapCurrencies = () => {
//     setFromCurrency(toCurrency);
//     setToCurrency(fromCurrency);
//   }

//   // Lấy tỷ giá từ API
//   const getExchangeRate = async () => {
//     const API_KEY = process.env.REACT_APP_API_KEY;
//     if (!API_KEY) {
//       console.error("API key is not defined");
//       return;
//     }

//     const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;
//     setIsLoading(true);
//     try {
//       const response = await fetch(API_URL);
//       if (!response.ok) throw new Error("Something went wrong!");


//       const data = await response.json();
//       const rate = (data.conversion_rate * amount).toFixed(2);
//       setResult(`${amount} ${fromCurrency} = ${rate} ${toCurrency}`);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   // Xử lý khi gửi form
//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     getExchangeRate();
//   }

//   // Lấy tỷ giá khi trang được render lần đầu
//   useEffect(() => {
//     getExchangeRate();
//   }, [fromCurrency, toCurrency, amount]);

//   return (
//     <div className='main-content-user'>
//       <div className='currency-container'>

//         {/* them 2 dong de hop voi css */}
//         <div className="currency-conveter">
//           <h2 className='converter-title'>Curryency Conveter</h2>

//           <form className='converter-form' onSubmit={handleFormSubmit} >
//             <div className='form-group'>
//               <label className='form-label'>Enter Amount</label>
//               <input type="number" className='form-input' value={amount} onChange={e => setAmount(e.target.value)} required />
//             </div>

//             <div className='form-group form-currency-group'>
//               <div className='form-section'>
//                 <label className='form-label'>From</label>
//                 <CurrencySelect
//                   SelectedCurrency={fromCurrency}
//                   handleCurrency={e => setFromCurrency(e.target.value)}
//                 />
//               </div>

//               {/* Icon chuyển đổi */}
//               <div className='swap-icon' onClick={handleSwapCurrencies}>
//                 <svg width="16" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
//                   <path
//                     d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
//                     fill="#fff"
//                   />
//                 </svg>
//               </div>

//               <div className='form-section'>
//                 <label className='form-label'>To</label>
//                 <CurrencySelect
//                   SelectedCurrency={toCurrency}
//                   handleCurrency={e => setToCurrency(e.target.value)}
//                 />
//               </div>
//             </div>

//             <button type='submit' className={`${isLoading ? "loading" : ""} submit-button`}>Get Exchange Rate</button>
//             <p className="exchange-rate-result">
//               {isLoading ? "Getting exchange rate ...." : result}
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>


//   );
// }

// export default ConverterForm;