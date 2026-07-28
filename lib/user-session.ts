
/**
 * Show badge for user role to display on UI
 * @param user User object from auth
 * @returns string: "Admin" or "" for regular users
 */
export const userRole = (user: any) => {
    return user?.isAdmin ? "Admin" : "";
}
