const login = require("./sample").login;

describe("login function", () => {
  test("should return success message for valid credentials", () => {
    const result = login("admin@test.com", "123456");
    expect(result).toEqual({
      success: true,
      message: "Login successful"
    });
  });

  test("should return error message for invalid email", () => {
    const result = login("invalid@test.com", "123456");
    expect(result).toEqual({
      success: false,
      message: "Invalid credentials"
    });
  });

  test("should return error message for invalid password", () => {
    const result = login("admin@test.com", "wrongPassword");
    expect(result).toEqual({
      success: false,
      message: "Invalid credentials"
    });
  });

  test("should return error message for missing email", () => {
    const result = login("", "123456");
    expect(result).toEqual({
      success: false,
      message: "Email and password are required"
    });
  });

  test("should return error message for missing password", () => {
    const result = login("admin@test.com", "");
    expect(result).toEqual({
      success: false,
      message: "Email and password are required"
    });
  });
});