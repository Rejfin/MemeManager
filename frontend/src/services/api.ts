import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_ADDRESS,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config: any) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/auth/signin" && originalConfig.url !== "/auth/refresh-token" && err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        
        try {
          const rs = await instance.post("/auth/refresh-token", {
            refreshToken: TokenService.getLocalRefreshToken(),
          });

          const { token } = rs.data;
          TokenService.updateLocalAccessToken(token);
          
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }else if(originalConfig.url === "/auth/refresh-token" && err.response){
      if(err.response.status === 400){
        window.location.href = `login?expired_auth&next=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    return Promise.reject(err);
  }
);

export default instance;