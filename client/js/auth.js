// =================================
// ZERO TRACE ANALYTICS
// AUTH NAVIGATION SYSTEM
// =================================

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelector(".nav-links");

  if (!navLinks) return;

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Invalid stored user data:", error);

    localStorage.removeItem("user");
  }

  // GUEST NAVIGATION

  if (!token || !user) {
    navLinks.innerHTML = `

<a href="index.html">
Home
</a>


<a href="free.html">
Free Tips
</a>


<a href="vip.html">
VIP
</a>


<a href="login.html">
Login
</a>


<a href="register.html" class="register-btn">
Register
</a>


`;

    return;
  }

  // ADMIN NAVIGATION

  if (user.role === "admin") {
    navLinks.innerHTML = `


<a href="index.html">
Home
</a>


<a href="admin.html">
Admin Dashboard
</a>


<a href="#" id="logoutLink">
Logout
</a>


`;
  }

  // NORMAL USER NAVIGATION
  else {
    navLinks.innerHTML = `


<a href="dashboard.html">
Dashboard
</a>


<a href="free.html">
Free Tips
</a>


<a href="vip.html">
VIP
</a>


<a href="history.html">
History
</a>


<a href="profile.html">
Profile
</a>


<a href="#" id="logoutLink">
Logout
</a>


`;
  }

  // ==============================
  // ACTIVE NAV LINK
  // ==============================

  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

  // LOGOUT FUNCTION

  const logout = document.getElementById("logoutLink");

  if (logout) {
    logout.addEventListener("click", (e) => {
      e.preventDefault();

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      window.location.href = "index.html";
    });
  }
});
