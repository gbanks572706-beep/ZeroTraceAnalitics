// ==============================
// ZERO TRACE NOTIFICATION
// ==============================

function showNotification(message, type) {
  const notification = document.getElementById("notification");

  notification.innerHTML = message;

  notification.className = "";

  notification.classList.add(type);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// ==============================
// PASSWORD VISIBILITY TOGGLE
// ==============================

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.textContent = isPassword ? "🙈" : "👁";

    togglePassword.classList.toggle("active");
  });
}

// ==============================
// LOGIN SYSTEM
// ==============================

const loginForm = document.getElementById("loginForm");

if (!loginForm) {
  throw new Error("Login form not found");
}

const loginButton = loginForm.querySelector("button");

if (!loginButton) {
  throw new Error("Login button not found");
}

// ==============================
// LOGIN SUBMIT
// ==============================

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Button loading

  loginButton.disabled = true;

  loginButton.innerHTML = "⏳ Logging in...";

  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,

        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      showNotification("Login successful", "success");

      loginButton.disabled = false;

      loginButton.innerHTML = "Login";

      setTimeout(() => {
        if (data.user.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "dashboard.html";
        }
      }, 1500);
    } else {
      showNotification(data.message, "error");

      loginButton.disabled = false;

      loginButton.innerHTML = "Login";
    }
  } catch (error) {
    console.log(error);

    showNotification("Server connection failed", "error");

    loginButton.disabled = false;

    loginButton.innerHTML = "Login";
  }
});
