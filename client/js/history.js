// ==============================
// ZERO TRACE ANALYTICS
// PREDICTION HISTORY
// ==============================

let historyData = [];

let currentFilter = "all";

const historyContainer = document.getElementById("history-container");

// ==============================
// LOAD HISTORY
// ==============================

async function loadHistory() {
  try {
    const response = await fetch(`${API_URL}/api/history`);

    const predictions = await response.json();

    historyData = predictions;

    // ==============================
    // CALCULATE STATISTICS
    // ==============================

    const totalTips = predictions.length;

    const wonTips = predictions.filter(
      (prediction) => prediction.status === "won",
    ).length;

    const lostTips = predictions.filter(
      (prediction) => prediction.status === "lost",
    ).length;

    const pendingTips = predictions.filter(
      (prediction) => prediction.status === "pending",
    ).length;

    const winRate = totalTips > 0 ? Math.round((wonTips / totalTips) * 100) : 0;

    document.getElementById("total-tips").textContent = totalTips;

    document.getElementById("won-tips").textContent = wonTips;

    document.getElementById("lost-tips").textContent = lostTips;

    document.getElementById("pending-tips").textContent = pendingTips;

    document.getElementById("win-rate").textContent = winRate + "%";

    console.log("HISTORY DATA:", predictions);

    historyContainer.innerHTML = "";

    if (predictions.length === 0) {
      historyContainer.innerHTML = `

<p class="no-tips">

No prediction history available.

</p>

`;

      return;
    }

    function renderHistory(data) {
      historyContainer.innerHTML = "";

      if (data.length === 0) {
        historyContainer.innerHTML = `
      <p class="no-tips">
        No predictions found.
      </p>
    `;
        return;
      }

      data.forEach((prediction) => {
        const card = document.createElement("div");

        card.className = "prediction-card";

        card.innerHTML = `

<div class="tip-header">

  <span class="league">
    ${prediction.league}
  </span>

  <span class="${prediction.tip_category === "VIP" ? "vip-badge" : "free-badge"}">
    ${prediction.tip_category}
  </span>

</div>

<div class="teams">

  <h3>${prediction.home_team}</h3>

  <span>VS</span>

  <h3>${prediction.away_team}</h3>

</div>

<div class="prediction-info">

  <h2>${prediction.prediction}</h2>

  <div class="details">

    <div>
      Odds
      <strong>${prediction.odds}</strong>
    </div>

    <div>
      Confidence
      <strong>${prediction.confidence}%</strong>
    </div>

    <div>
      Result
      <strong class="status ${prediction.status}">
        ${prediction.status.toUpperCase()}
      </strong>
    </div>

  </div>

  <p class="section-name">
    ${prediction.tip_section || "No Section"}
  </p>

  <p class="date">
    📅 ${new Date(prediction.match_date).toDateString()}
  </p>

</div>
`;

        historyContainer.appendChild(card);
      });
    }

    document.querySelectorAll(".history-filter").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".history-filter")
          .forEach((btn) => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        if (currentFilter === "all") {
          renderHistory(historyData);

          return;
        }

        const filtered = historyData.filter(
          (prediction) => prediction.status === currentFilter,
        );

        renderHistory(filtered);
      });
    });

    renderHistory(historyData);
  } catch (error) {
    console.log(error);

    historyContainer.innerHTML = `

<p class="no-tips">

Server connection failed.

</p>

`;
  }
}

loadHistory();
