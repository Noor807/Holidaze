// src/utils/auth.ts
export const logoutUser = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };