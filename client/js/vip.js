// ==============================
// ZERO TRACE ANALYTICS
// VIP SECTION ACCESS SYSTEM
// ==============================

let selectedSection = null;

const savedSection = localStorage.getItem("selectedVipSection");

let selectedDate = "today";

const vipContainer = document.getElementById("vip-container");

const sectionButtons = document.getElementById("vip-sections-menu");

const savedVipSection = localStorage.getItem("selectedVipSection");

// ==============================
// AUTH CHECK
// ==============================

const vipToken = localStorage.getItem("token");

let user = null;

try {
  user = JSON.parse(localStorage.getItem("user"));
} catch (error) {
  user = null;
}

if (!vipToken || !user) {
  window.location.href = "login.html";
}

// ==============================
// LOAD VIP PROFILE
// ==============================

async function loadVipProfile() {
  try {
    const response = await fetch(
      `${API_URL}/api/vip-subscriptions/my-sections`,
      {
        headers: {
          Authorization: `Bearer ${vipToken}`,
        },
      },
    );

    const sections = await response.json();

    console.log("VIP PROFILE RESPONSE:", sections);

    if (!Array.isArray(sections) || sections.length === 0) {
      document.getElementById("vip-plan").textContent = "No Active Plan";

      document.getElementById("vip-status").textContent = "Inactive";

      document.getElementById("vip-expiry").textContent = "--";

      return;
    }

    document.getElementById("vip-plan").textContent = sections
      .map((section) => section.name)
      .join(", ");

    document.getElementById("vip-status").textContent = "ACTIVE";

    const latestExpiry = sections.reduce((latest, section) => {
      return new Date(section.expiry_date) > new Date(latest)
        ? section.expiry_date
        : latest;
    }, sections[0].expiry_date);

    document.getElementById("vip-expiry").textContent = new Date(
      latestExpiry,
    ).toDateString();
  } catch (error) {
    console.log(error);

    document.getElementById("vip-plan").textContent = "Unavailable";

    document.getElementById("vip-status").textContent = "Unknown";
  }
}

// ==============================
// LOAD USER VIP SECTIONS
// ==============================

async function loadVipSections() {
  try {
    const response = await fetch(
      `${API_URL}/api/vip-subscriptions/my-sections`,

      {
        headers: {
          Authorization: `Bearer ${vipToken}`,
        },
      },
    );

    const sections = await response.json();

    console.log("ACTIVE VIP SECTIONS:", sections);

    sectionButtons.innerHTML = "";

    // NO ACTIVE SUBSCRIPTION

    if (!sections || sections.length === 0) {
      sectionButtons.innerHTML = `

<p class="no-tips">

You don't have any active VIP subscription.

</p>


<a href="vip-subscription.html">

<button>
Subscribe VIP
</button>

</a>

`;

      return;
    }

    // CREATE BUTTONS

    sections.forEach((section, index) => {
      const button = document.createElement("button");

      button.textContent = section.name;

      button.dataset.id = section.id;

      button.onclick = () => {
        selectedSection = button.dataset.id;

        localStorage.setItem("selectedVipSection", selectedSection);

        console.log("SELECTED VIP SECTION:", selectedSection);

        loadVipTips();
      };

      sectionButtons.appendChild(button);

      // AUTO OPEN FIRST VIP

      if (savedSection && Number(savedSection) === Number(section.id)) {
        selectedSection = section.id;

        console.log("RESTORED VIP SECTION:", selectedSection);

        loadVipTips();
      } else if (index === 0 && !savedSection) {
        selectedSection = section.id;

        console.log("AUTO SELECTED VIP SECTION:", selectedSection);

        loadVipTips();
      }
    });
  } catch (error) {
    console.log(error);

    sectionButtons.innerHTML = `

<p class="no-tips">

Unable to load VIP sections.

</p>

`;
  }
}

// ==============================
// CHECK VIP ACCESS
// ==============================

async function checkVipAccess(section_id) {
  try {
    const response = await fetch(
      `${API_URL}/api/vip-subscriptions/access/${section_id}`,

      {
        headers: {
          Authorization: `Bearer ${vipToken}`,
        },
      },
    );

    return response.ok;
  } catch (error) {
    return false;
  }
}

// ==============================
// LOAD VIP PREDICTIONS
// ==============================

async function loadVipTips() {
  if (!selectedSection) {
    return;
  }

  try {
    const allowed = await checkVipAccess(selectedSection);

    if (!allowed) {
      vipContainer.innerHTML = `

<p class="no-tips">

Your subscription has expired.

</p>


<a href="vip-subscription.html">

<button>

Renew VIP

</button>

</a>


`;

      return;
    }

    const response = await fetch(
      `${API_URL}/api/predictions/vip/${selectedSection}?date=${selectedDate}`,

      {
        headers: {
          Authorization: `Bearer ${vipToken}`,
        },
      },
    );

    const predictions = await response.json();

    console.log("VIP PREDICTIONS:", predictions);

    if (!response.ok) {
      vipContainer.innerHTML = `

<p>

${predictions.message}

</p>

`;

      return;
    }

    vipContainer.innerHTML = "";

    if (predictions.length === 0) {
      vipContainer.innerHTML = `

<p class="no-tips">

No VIP predictions available.

</p>

`;

      return;
    }

    predictions.forEach((prediction) => {
      const card = document.createElement("div");

      card.className = "prediction-card";

      // Header
      const header = document.createElement("div");
      header.className = "tip-header";

      const league = document.createElement("span");
      league.className = "league";
      league.textContent = prediction.league || "Football";

      const vipBadge = document.createElement("span");
      vipBadge.className = "vip-badge";
      vipBadge.textContent = "VIP";

      header.appendChild(league);
      header.appendChild(vipBadge);

      // Teams
      const teams = document.createElement("div");
      teams.className = "teams";

      const homeTeam = document.createElement("h3");
      homeTeam.textContent = prediction.home_team;

      const vs = document.createElement("span");
      vs.textContent = "VS";

      const awayTeam = document.createElement("h3");
      awayTeam.textContent = prediction.away_team;

      teams.appendChild(homeTeam);
      teams.appendChild(vs);
      teams.appendChild(awayTeam);

      // Prediction information
      const predictionInfo = document.createElement("div");
      predictionInfo.className = "prediction-info";

      const predictionTitle = document.createElement("h2");
      predictionTitle.textContent = prediction.prediction;

      const details = document.createElement("div");
      details.className = "details";

      // Odds
      const oddsBox = document.createElement("div");

      const oddsLabel = document.createElement("span");
      oddsLabel.textContent = "Odds";

      const oddsValue = document.createElement("strong");
      oddsValue.textContent = prediction.odds ?? "--";

      oddsBox.appendChild(oddsLabel);
      oddsBox.appendChild(oddsValue);

      // Confidence
      const confidenceBox = document.createElement("div");

      const confidenceLabel = document.createElement("span");
      confidenceLabel.textContent = "Confidence";

      const confidenceValue = document.createElement("strong");
      confidenceValue.textContent =
        prediction.confidence != null ? `${prediction.confidence}%` : "--";

      confidenceBox.appendChild(confidenceLabel);
      confidenceBox.appendChild(confidenceValue);

      details.appendChild(oddsBox);
      details.appendChild(confidenceBox);

      // Section name
      const sectionName = document.createElement("p");
      sectionName.className = "section-name";
      sectionName.textContent = prediction.tip_section || "";

      predictionInfo.appendChild(predictionTitle);
      predictionInfo.appendChild(details);
      predictionInfo.appendChild(sectionName);

      // Build card
      card.appendChild(header);
      card.appendChild(teams);
      card.appendChild(predictionInfo);

      vipContainer.appendChild(card);
    });
  } catch (error) {
    console.log(error);

    vipContainer.innerHTML = `

<p>

Server connection failed.

</p>

`;
  }
}

// ==============================
// VIP DATE SELECTOR
// ==============================

const vipDateToggle = document.getElementById("vip-date-toggle");

const vipDateMenu = document.querySelector(".date-menu");

vipDateToggle.addEventListener("click", () => {
  vipDateMenu.style.display =
    vipDateMenu.style.display === "block" ? "none" : "block";
});

document.querySelectorAll(".date-menu button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedDate = button.dataset.date;

    vipDateToggle.innerHTML = `
      📅 ${button.innerText}
      <span>▾</span>
    `;

    vipDateMenu.style.display = "none";

    loadVipTips();
  });
});

// ==============================
// START
// ==============================

loadVipProfile();

loadVipSections();
