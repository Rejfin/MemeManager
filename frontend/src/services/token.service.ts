const getLocalRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.refreshToken;
  };
  
  const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.token;
  };
  
  const updateLocalAccessToken = (token:string) => {
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    user.token = token;
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  const getUser = () => {
    return JSON.parse(localStorage.getItem("user") || "{}");
  };
  
  const setUser = (user: string) => {
    localStorage.setItem("user", JSON.stringify(user));
  };
  
  const removeUser = () => {
    localStorage.removeItem("user");
  };
  
  const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    setUser,
    removeUser,
  };
  
  export default TokenService;