export const logoutUser = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};
