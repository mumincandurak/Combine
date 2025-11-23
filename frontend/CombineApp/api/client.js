import axios from 'axios';

// Backend'inizin çalıştığı IP adresi ve port.
// Eğer telefonunuzdan test ediyorsanız 'localhost' yerine bilgisayarınızın IP adresini yazmalısınız.
// Örn: http://192.168.1.10:3001/api
const apiClient = axios.create({
  baseURL: 'http://172.20.10.4:5000', // Backend'deki portunuza göre düzenleyin
});

export default apiClient;
