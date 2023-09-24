import axios from 'axios';
import TokenService from './token.service';


var remove_sub_domain=function(v:string){
  var is_co=v.match(/\.co\./)
  var v1=v.split('.')
  v1=v1.slice(is_co ? -3: -2)
  v=v1.join('.')
  return v
}



const hostname = remove_sub_domain(window.location.hostname);
var baseUrl = location.protocol + "//mmapi." + hostname;
baseUrl = location.port ? location.protocol + "//mmapi." + hostname + ":" + (parseInt(location.port) - 1) : location.protocol + "//mmapi." + hostname;
export { baseUrl }
//console.log(location.protocol ? "" : location.port);

console.log(baseUrl)
const instance = axios.create({
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  baseURL: baseUrl + "/api",
  headers: {
    'Content-Type': 'application/json',
  },
});
/* eslint-disable  @typescript-eslint/no-explicit-any */
instance.interceptors.request.use(
  (config: any) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== '/auth/signin' && originalConfig.url !== '/auth/refresh-token' && err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await instance.post('/auth/refresh-token', {
            refreshToken: TokenService.getLocalRefreshToken(),
          });

          const { token } = rs.data.data;
          TokenService.updateLocalAccessToken(token);

          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    } else if (originalConfig.url === '/auth/refresh-token' && err.response) {
      if (err.response.status === 400) {
        window.location.href = `login?expired_auth&next=${encodeURIComponent(window.location.pathname)}`;
      }
    } else if (err.code === 'ERR_NETWORK' && originalConfig.url !== '/auth/signin') {
      window.location.href = `login`;
    }

    return Promise.reject(err);
  },
);

export default instance;
