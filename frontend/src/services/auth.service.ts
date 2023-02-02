import api from './api';
import TokenService from './token.service';

const register = (login: string, password: string) => {
  return api.post('/auth/signup', {
    login: login,
    password: password,
  });
};

const login = (login: string, password: string) => {
  return api
    .post('/auth/signin', {
      login: login,
      password: password,
    })
    .then((response) => {
      if (response.data.token) {
        TokenService.setUser(response.data);
      }

      return response.data;
    });
};

const logout = () => {
  TokenService.removeUser();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || '');
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
