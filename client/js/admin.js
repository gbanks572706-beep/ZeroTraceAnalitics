// ==============================
// UPDATE PREDICTION STATUS
// ==============================

async function updatePredictionStatus(id) {
  const status = document.getElementById(`status-${id}`).value;

  try {
    const response = await fetch(`${API_URL}/api/predictions/${id}/status`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        status,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Status updated successfully");

      loadPredictions();

      loadAdminDashboard();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    alert("Status update failed");
  }
}

// ==============================
// TIP SECTION SELECTOR
// LOAD FROM DATABASE
// ==============================

const tipCategory = document.getElementById("tip_category");

const tipSection = document.getElementById("tip_section");

// ==============================
// LOAD SECTIONS BY CATEGORY
// ==============================

async function loadSections() {
  try {
    tipSection.innerHTML = `
      <option value="">
        Select Tip Section
      </option>
    `;

    const category = tipCategory.value;

    if (!category) {
      return;
    }

    const response = await fetch(`${API_URL}/api/sections/${category}`);

    const sections = await response.json();

    if (!response.ok) {
      console.log(sections.message);

      return;
    }

    sections.forEach((section) => {
      const option = document.createElement("option");

      option.value = section.id;

      option.textContent = section.name;

      tipSection.appendChild(option);
    });
  } catch (error) {
    console.log("Failed loading sections:", error);
  }
}

// ==============================
// ADMIN ACCESS CHECK
// ==============================

const storedUser = localStorage.getItem("user");

if (!storedUser) {
  window.location.href = "login.html";
} else {
  const user = JSON.parse(storedUser);

  if (user.role !== "admin") {
    window.location.href = "dashboard.html";
  }
}

// ==============================
// ZERO TRACE ANALYTICS
// ADMIN DASHBOARD
// ==============================

const token = localStorage.getItem("token");

// ==============================
// CATEGORY CHANGE EVENT
// ==============================

tipCategory.addEventListener("change", loadSections);

// ==============================
// INITIAL LOAD
// ==============================

loadSections();

const totalUsers = document.getElementById("totalUsers");

const vipUsers = document.getElementById("vipUsers");

const totalPredictions = document.getElementById("totalPredictions");

const adminLogout = document.getElementById("adminLogout");

// CHECK LOGIN

if (!token) {
  window.location.href = "login.html";
}

// LOAD ADMIN DATA

async function loadAdminDashboard() {
  try {
    const response = await fetch(`${API_URL}/api/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    totalUsers.innerHTML = data.stats.totalUsers;

    vipUsers.innerHTML = data.stats.vipMembers;

    totalPredictions.innerHTML = data.stats.totalPredictions;
  } catch (error) {
    console.log(error);
  }
}

loadAdminDashboard();

// LOGOUT

adminLogout.addEventListener("click", () => {
  localStorage.removeItem("token");

  localStorage.removeItem("user");

  window.location.href = "login.html";
});

// ==============================
// ADD NEW PREDICTION
// ==============================

const predictionForm = document.getElementById("predictionForm");

predictionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!document.getElementById("tip_section").value) {
    alert("Please select a tip section");

    return;
  }

  const predictionData = {
    home_team: document.getElementById("home_team").value,

    away_team: document.getElementById("away_team").value,

    league: document.getElementById("league").value,

    prediction_type: document.getElementById("prediction_type").value,

    prediction: document.getElementById("prediction").value,

    odds: document.getElementById("odds").value,

    confidence: document.getElementById("confidence").value,

    tip_category: document.getElementById("tip_category").value,

    section_id: document.getElementById("tip_section").value,

    match_date: document.getElementById("match_date").value,
  };

  try {
    const response = await fetch(`${API_URL}/api/predictions`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(predictionData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Prediction added successfully");

      predictionForm.reset();

      loadSections();

      loadAdminDashboard();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    alert("Failed to add prediction");
  }
});

// ==============================
// LOAD ALL PREDICTIONS
// ==============================

const predictionList = document.getElementById("predictionList");

async function loadPredictions() {
  try {
    const response = await fetch(`${API_URL}/api/predictions`);

    const predictions = await response.json();

    predictionList.innerHTML = "";

    predictions.forEach((item) => {
      const card = document.createElement("div");

      card.className = "prediction-card";

      card.innerHTML = `

<h3>
${item.home_team}
vs
${item.away_team}
</h3>


<p>
League:
${item.league}
</p>


<p>
Prediction:
${item.prediction}
</p>


<p>
Odds:
${item.odds}
</p>


<p>
Confidence:
${item.confidence}%
</p>


<p>
Category:
${item.tip_category}
</p>


<p>
Status:
${item.status}
</p>


<select id="status-${item.id}">

<option value="pending" ${item.status === "pending" ? "selected" : ""}>
Pending
</option>


<option value="won" ${item.status === "won" ? "selected" : ""}>
Won
</option>


<option value="lost" ${item.status === "lost" ? "selected" : ""}>
Lost
</option>


<option value="void" ${item.status === "void" ? "selected" : ""}>
Void
</option>

</select>


<button onclick="updatePredictionStatus(${item.id})">
Update Status
</button>


<button onclick="deletePrediction(${item.id})">
Delete
</button>


`;
      predictionList.appendChild(card);
    });
  } catch (error) {
    console.log(error);
  }
}

loadPredictions();
// ==============================
// DELETE PREDICTION
// ==============================

async function deletePrediction(id) {
  const confirmDelete = confirm("Delete this prediction?");

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/predictions/${id}`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert("Prediction deleted successfully");

      loadPredictions();

      loadAdminDashboard();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    alert("Delete failed");
  }
}

// ==============================
// ADMIN SIDEBAR NAVIGATION
// ==============================

const menuButtons = document.querySelectorAll(".menu-btn");

const adminSections = document.querySelectorAll(".admin-section");

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetSection = button.dataset.section;

    // Remove active button

    menuButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Hide all sections

    adminSections.forEach((section) => {
      section.classList.remove("active-section");
    });

    // Activate clicked button

    button.classList.add("active");

    // Show selected section

    document.getElementById(targetSection).classList.add("active-section");
  });
});

/// ==============================
// MOBILE SIDEBAR
// ==============================

const sidebarToggle = document.getElementById("sidebarToggle");

const sidebar = document.querySelector(".sidebar");

const overlay = document.getElementById("sidebarOverlay");

// OPEN

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.add("active");

  overlay.classList.add("active");
});

// CLOSE WHEN CLICKING MENU

document.querySelectorAll(".menu-btn").forEach((button) => {
  button.addEventListener("click", () => {
    sidebar.classList.remove("active");

    overlay.classList.remove("active");
  });
});

// CLOSE WHEN CLICKING OUTSIDE

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");

  overlay.classList.remove("active");
});
