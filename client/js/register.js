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
// REGISTER SYSTEM
// ==============================

const registerForm = document.getElementById("registerForm");

if (!registerForm) {
  throw new Error("Registration form not found");
}

const registerButton = registerForm.querySelector("button");

if (!registerButton) {
  throw new Error("Registration button not found");
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Button loading state

  registerButton.disabled = true;

  registerButton.innerHTML = "⏳ Creating Account...";

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const passwordValue = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,

        email,

        password: passwordValue,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      showNotification("Registration successful", "success");

      registerButton.disabled = false;

      registerButton.innerHTML = "Register";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      showNotification(data.message, "error");

      registerButton.disabled = false;

      registerButton.innerHTML = "Register";
    }
  } catch (error) {
    console.log(error);

    showNotification("Server connection failed", "error");

    registerButton.disabled = false;

    registerButton.innerHTML = "Register";
  }
});
