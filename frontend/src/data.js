import axios from 'axios';
// import { cryptoData } from './data.js';
// Функция для получения данных о криптовалютах с CoinGecko
export async function fetchCryptoData() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20, // Количество монет
        page: 1,
        sparkline: false
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении данных о криптовалютах:', error);
    return [];
  }
}

// Функция для маппинга данных, как было в исходном файле
export function mapCryptoData(data) {
  return data.map(coin => ({
    id: coin.id,
    icon: coin.image,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    rank: coin.market_cap_rank,
    price: coin.current_price || 'N/A',
    btc_price: coin.current_price / (coin.btc_price || 1), // Avoid division by zero
    marketCap: coin.market_cap || 'N/A',
    priceChange1h: coin.price_change_percentage_1h_in_currency || 'N/A',
    priceChange1d: coin.price_change_percentage_24h || 'N/A',
    priceChange1w: coin.price_change_percentage_7d || 'N/A',
  }));
}



// Пример использования переменной cryptoData
export async function getCryptoData() {
  const data = await fetchCryptoData();
  const cryptoData = mapCryptoData(data);
  console.log('Полученные данные:', cryptoData);
  return cryptoData;
}

// Пример твоих активов (они могут не меняться, если это пользовательский ввод)
export const cryptoAssets = [
  {
    id: 'bitcoin',
    amount: 0.02,
    price: 26244,
    date: new Date(),
  },
  {
    id: 'ethereum',
    amount: 5,
    price: 2400,
    date: new Date(),
  }
];

// Вызываем функцию для получения данных
getCryptoData().then(cryptoData => {
  console.log('Обновленные данные о криптовалютах:', cryptoData);
});
