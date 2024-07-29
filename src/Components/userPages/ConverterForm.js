import React, { useEffect, useState } from 'react';
import CurrencySelect from './CurrencySelect';

function ConverterForm() {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý đổi chỗ các loại tiền tệ
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  // Lấy tỷ giá từ API
  const getExchangeRate = async () => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    if (!API_KEY) {
      console.error("API key is not defined");
      return;
    }

    const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Something went wrong!");

      const data = await response.json();
      const rate = (data.conversion_rate * amount).toFixed(2);
      setResult(`${amount} ${fromCurrency} = ${rate} ${toCurrency}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Xử lý khi gửi form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    getExchangeRate();
  }

  // Lấy tỷ giá khi trang được render lần đầu
  useEffect(() => {
    getExchangeRate();
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className='main-content-user'>
      <div className='currency-container'>

        {/* them 2 dong de hop voi css */}
        <div className="currency-conveter">
          <h2 className='converter-title'>Curryency Conveter</h2>

          <form className='converter-form' onSubmit={handleFormSubmit} >
            <div className='form-group'>
              <label className='form-label'>Enter Amount</label>
              <input type="number" className='form-input' value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>

            <div className='form-group form-currency-group'>
              <div className='form-section'>
                <label className='form-label'>From</label>
                <CurrencySelect
                  SelectedCurrency={fromCurrency}
                  handleCurrency={e => setFromCurrency(e.target.value)}
                />
              </div>

              {/* Icon chuyển đổi */}
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
                  SelectedCurrency={toCurrency}
                  handleCurrency={e => setToCurrency(e.target.value)}
                />
              </div>
            </div>

            <button type='submit' className={`${isLoading ? "loading" : ""} submit-button`}>Get Exchange Rate</button>
            <p className="exchange-rate-result">
              {isLoading ? "Getting exchange rate ...." : result}
            </p>
          </form>
        </div>
      </div>
    </div>


  );
}

export default ConverterForm;