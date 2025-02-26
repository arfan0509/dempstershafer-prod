export const isAuthenticated = () => {
    const token = localStorage.getItem("accessToken");
    return !!token; // Mengembalikan true jika token ada, false jika tidak
};
export const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};
export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};
