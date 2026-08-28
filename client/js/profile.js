// ==============================
// ZERO TRACE ANALYTICS
// USER PROFILE SYSTEM
// ==============================

const token = localStorage.getItem("token");

// ==============================
// CHECK LOGIN
// ==============================

if (!token) {
  window.location.href = "login.html";
}

// ==============================
// ELEMENTS
// ==============================

const profileName = document.getElementById("profileName");

const profileEmail = document.getElementById("profileEmail");

const profileRole = document.getElementById("profileRole");

const profileVipStatus = document.getElementById("profileVipStatus");

// ==============================
// LOAD PROFILE DATA
// ==============================

async function loadProfile() {
  try {
    const response = await fetch(`${API_URL}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    const user = data.user;

    // BASIC INFORMATION

    profileName.textContent = user.name;

    profileEmail.textContent = user.email;

    profileRole.textContent = user.role.toUpperCase();

    profileVipStatus.textContent = user.vip_status.toUpperCase();
  } catch (error) {
    console.log(error);

    profileName.textContent = "Unable to load profile";
  }
}

loadProfile();
