import { fetchCryptoData, cryptoAssets } from './data'; // Импортируем новую функцию для API запросов

// Функция для эмуляции получения данных о криптовалютах (fakeFetchCrypto) теперь заменена на реальный запрос
export async function fetchCryptoFromAPI() {
  try {
    const cryptoData = await fetchCryptoData(); // Динамический запрос через CoinGecko API
    return cryptoData;
  } catch (error) {
    console.error('Ошибка при получении данных о криптовалютах:', error);
    return [];
  }
}

// Функция для эмуляции получения активов пользователя (оставляем без изменений)
export function fetchAssets() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cryptoAssets); // Используем пользовательские данные о его активах
    }, 1);
  });
}
