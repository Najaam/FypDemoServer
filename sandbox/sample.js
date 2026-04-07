function login(username, password) {
    const correctUsername = "admin";
    const correctPassword = "1234";

    if (username === correctUsername && password === correctPassword) {
        return "Login Successful";
    } else {
        return "Invalid Username or Password";
    }
}

module.exports = { login };