const login = require("./sample").login;

test('should return Login Successful for correct username and password', () => {
    expect(login("admin", "1234")).toBe("Login Successful");
});

test('should return Invalid Username or Password for incorrect username', () => {
    expect(login("user", "1234")).toBe("Invalid Username or Password");
});

test('should return Invalid Username or Password for incorrect password', () => {
    expect(login("admin", "pass")).toBe("Invalid Username or Password");
});

test('should return Invalid Username or Password for both incorrect username and password', () => {
    expect(login("user", "pass")).toBe("Invalid Username or Password");
});

test('should handle empty strings as invalid input', () => {
    expect(login("", "")).toBe("Invalid Username or Password");
});