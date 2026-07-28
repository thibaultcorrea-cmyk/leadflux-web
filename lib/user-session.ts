
/**
 * Show badge for user role to display on UI
 * @param user User object from auth
 * @returns string: "Admin" or "" for regular users
 */
export const showUserRoleLabel = (user: any) => {
    console.log(user);

    return user?.isAdmin ? "Admin" : "";
}



export const showUserInitials = (name: string) => {
    if (!name) return "U";
    const fullName = name.toLowerCase().split(" ");
    if (fullName.length <= 2) return fullName.join(" ").toUpperCase().slice(0, 2);
    return fullName.map(name => name[0]).join("").toUpperCase();

}

