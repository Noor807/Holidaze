/**
 * Logs out the current user by clearing authentication data from localStorage.
 *
 * Removes:
 * - "accessToken": the JWT or session token
 * - "user": the stored user object
 */
export const logoutUser = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.clear();
};
