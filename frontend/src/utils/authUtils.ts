export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("accessToken");
    return !!token; // Mengembalikan true jika token ada, false jika tidak
  };
  
  export const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };
  
  export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };
  