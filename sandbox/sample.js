function login(email, password) {
  const validEmail = "admin@test.com";
  const validPassword = "123456";

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required"
    };
  }

  if (email === validEmail && password === validPassword) {
    return {
      success: true,
      message: "Login successful"
    };
  }

  return {
    success: false,
    message: "Invalid credentials"
  };
}

module.exports = { login };