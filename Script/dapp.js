// dapp.js
async function fetchCryptoData() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false'
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      const tickerContent = document.getElementById('crypto-ticker');
      tickerContent.innerHTML = ''; 
  
      data.forEach(coin => {
        const price = coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
        const change = coin.price_change_percentage_24h;
        const arrow = change >= 0 ? '<span class="arrow-up">▲</span>' : '<span class="arrow-down">▼</span>';
  
        const tickerItem = document.createElement('div');
        tickerItem.className = 'ticker-item';
        tickerItem.innerHTML = `
          <span class="coin-name">${coin.symbol.toUpperCase()}</span>
          <span class="coin-price">${price}</span>
          ${arrow}
        `;
        tickerContent.appendChild(tickerItem);
      });
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      document.getElementById('crypto-ticker').innerHTML = `
        <div class="ticker-item">
          <span class="coin-price">Check your internet connection</span>
          <span class="arrow-down">▼</span>
        </div>
        <div class="ticker-item">
          <span class="coin-price">Check your internet connection</span>
          <span class="arrow-down">▼</span>
        </div>
        <div class="ticker-item">
          <span class="coin-price">Check your internet connection</span>
          <span class="arrow-down">▼</span>
        </div>
        <div class="ticker-item">
          <span class="coin-price">Check your internet connection</span>
          <span class="arrow-down">▼</span>
        </div>
      `;
    }
  }
  
  fetchCryptoData();
  setInterval(fetchCryptoData, 30000);
