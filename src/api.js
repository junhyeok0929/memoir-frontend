// src/api.js (새로 만든 파일)

import axios from 'axios';

// 1. "baseURL"을 설정한 axios 인스턴스(instance)를 만듭니다.
//    이제 모든 요청은 'http://localhost:8080'에서 시작됩니다.
const api = axios.create({
  baseURL: 'http://127.0.0.1:8088',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. "요청 인터셉터(Request Interceptor)" 설정
//    모든 API 요청이 서버로 전송되기 '전에' 이 코드가 먼저 실행됩니다.
api.interceptors.request.use(
  (config) => {
    // 3. localStorage에서 'accessToken'을 꺼냅니다.
    const token = localStorage.getItem('accessToken');

    // 4. 만약 토큰이 존재한다면,
    if (token) {
      // 5. 요청 헤더(config.headers)에 'Authorization' 헤더를 추가합니다.
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 6. 모든 설정이 완료된 요청(config)을 반환합니다.
    return config;
  },
  (error) => {
    // 요청 설정 중 오류가 발생하면 여기서 처리합니다.
    return Promise.reject(error);
  }
);

// 3. 다른 파일(Login.js, SignUp.js 등)에서 이 'api' 인스턴스를 사용할 수 있도록 내보냅니다.
export default api;