// ==============================
// ZERO TRACE ANALYTICS
// SIMPLE USER DASHBOARD
// ==============================

const token = localStorage.getItem("token");

const welcomeUser = document.getElementById("welcomeUser");

const userEmail = document.getElementById("userEmail");

const userRole = document.getElementById("userRole");

const vipStatus = document.getElementById("vipStatus");

const vipPlans = document.getElementById("vipPlans");

const totalPredictions = document.getElementById("totalPredictions");

const wonPredictions = document.getElementById("wonPredictions");

const lostPredictions = document.getElementById("lostPredictions");

const pendingPredictions = document.getElementById("pendingPredictions");

const predictionWinRate = document.getElementById("predictionWinRate");

const logoutBtn = document.getElementById("logoutBtn");

// ==============================
// CHECK LOGIN
// ==============================

if (!token) {
  window.location.href = "login.html";
}

// ==============================
// LOAD USER DATA
// ==============================

async function loadDashboard() {
  try {
    const response = await fetch(`${API_URL}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    const user = data.user;

    // USER NAME

    welcomeUser.innerHTML = `
Welcome, ${user.name} 👋
`;

    // USER EMAIL

    userEmail.textContent = user.email;

    // USER ROLE

    userRole.textContent = user.role.toUpperCase();

    // VIP STATUS

    vipStatus.textContent = user.vip_status.toUpperCase();

    // VIP PLANS

    if (user.vip_sections && user.vip_sections.length > 0) {
      vipPlans.innerHTML = "";

      user.vip_sections.forEach((vip) => {
        const card = document.createElement("div");

        card.className = "vip-plan-item";

        card.innerHTML = `

<h4>
👑 ${vip.name}
</h4>

<p>
Status:
<span>
${vip.status.toUpperCase()}
</span>
</p>


<p>
Expires:
${new Date(vip.expiry_date).toDateString()}
</p>

`;

        vipPlans.appendChild(card);
      });
    } else {
      vipPlans.innerHTML = `

<p>
No Active VIP Plan
</p>

`;
    }

    // ==============================
    // PREDICTION PERFORMANCE
    // ==============================

    const predictions = data.predictions || [];

    const total = predictions.length;

    const won = predictions.filter(
      (prediction) => prediction.status === "won",
    ).length;

    const lost = predictions.filter(
      (prediction) => prediction.status === "lost",
    ).length;

    const pending = predictions.filter(
      (prediction) => prediction.status === "pending",
    ).length;

    const rate = total > 0 ? Math.round((won / total) * 100) : 0;

    totalPredictions.textContent = total;

    wonPredictions.textContent = won;

    lostPredictions.textContent = lost;

    pendingPredictions.textContent = pending;

    predictionWinRate.textContent = rate + "%";
  } catch (error) {
    console.log(error);

    welcomeUser.innerHTML = `
Unable to load user
`;
  }
}

loadDashboard();

// ==============================
// LOGOUT
// ==============================

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "index.html";
  });
}
