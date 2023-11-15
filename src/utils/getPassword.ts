export function getPassword() {
    try {
        return localStorage.getItem("password") || ""
    } catch {
        return ""
    }
}
