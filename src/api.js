import axios from 'axios';

// 1. axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://127.0.0.1:8088',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터: 모든 요청에 토큰을 강제로 주입
api.interceptors.request.use(
  (config) => {
    // localStorage에서 'token'을 꺼냅니다.
    const token = localStorage.getItem('token');
    
    // 토큰이 있다면 Authorization 헤더에 Bearer 토큰 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('토큰 주입 성공:', token.substring(0, 10) + '...');
    } else {
      console.warn('토큰이 없습니다! 로그인이 필요할 수 있습니다.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
