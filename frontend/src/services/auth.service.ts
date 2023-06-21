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
      if (response.data.isSuccess) {
        TokenService.setUser(response.data.data);
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

const removeAccount = (password: string) => {
  return api.delete('/auth/deleteme', { data: { password: password } });
};

const clearAccount = (password: string) => {
  return api.delete('/auth/clear', { data: { password: password } });
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  removeAccount,
  clearAccount,
};

export default AuthService;
