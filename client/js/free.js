// ==============================
// ZERO TRACE ANALYTICS
// FREE TIPS LOADER
// ==============================

let selectedSection = null;

let selectedDate = "today";

const predictionContainer = document.getElementById("prediction-container");

// ==============================
// LOAD FREE TIPS
// ==============================

async function loadFreeTips() {
  try {
    const response = await fetch(
      `${API_URL}/api/predictions/free?date=${selectedDate}`,
    );

    const predictions = await response.json();

    predictionContainer.innerHTML = "";

    const freeTips = predictions;

    const filteredTips = selectedSection
      ? freeTips.filter(
          (prediction) => prediction.tip_section === selectedSection,
        )
      : freeTips;

    if (filteredTips.length === 0) {
      predictionContainer.innerHTML = `

<p class="no-tips">
No free tips available today.
</p>

`;

      return;
    }

    filteredTips.forEach((prediction) => {
      const card = document.createElement("div");

      card.className = "prediction-card";

      card.innerHTML = `


<div class="tip-header">


<span class="league">

${prediction.league}

</span>



<span class="free-badge">

FREE

</span>


</div>




<div class="teams">


<h3>

${prediction.home_team}

</h3>


<span>
VS
</span>


<h3>

${prediction.away_team}

</h3>


</div>




<div class="prediction-info">


<p>
Prediction
</p>



<h2>

${prediction.prediction}

</h2>




<div class="details">

<div>
Odds
<strong>
${prediction.odds}
</strong>
</div>


<div>
Confidence
<strong>
${prediction.confidence}%
</strong>
</div>


<div>
Result

<strong class="status ${prediction.status}">
${prediction.status.toUpperCase()}
</strong>

</div>


</div>


</div>




<div class="confidence-bar">


<div style="width:${prediction.confidence}%">

</div>


</div>




<p class="section-name">

${prediction.tip_section || "General Tips"}

</p>




<p class="date">

📅

${new Date(prediction.match_date).toDateString()}

</p>



</div>


`;

      predictionContainer.appendChild(card);
    });
  } catch (error) {
    console.log(error);

    predictionContainer.innerHTML = `

<p class="no-tips">

Server connection failed.

</p>

`;
  }
}

// ==============================
// SECTION BUTTONS
// ==============================

document.querySelectorAll(".tip-buttons button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedSection = button.dataset.section;

    loadFreeTips();
  });
});

// ==============================
// DATE DROPDOWN
// ==============================

const dateToggle = document.getElementById("date-toggle");

const dateMenu = document.querySelector(".date-menu");

dateToggle.addEventListener("click", () => {
  dateMenu.style.display =
    dateMenu.style.display === "block" ? "none" : "block";
});

document.querySelectorAll(".date-menu button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedDate = button.dataset.date;

    dateToggle.innerHTML = `
      📅 ${button.innerText}
      <span>▾</span>
    `;

    dateMenu.style.display = "none";

    loadFreeTips();
  });
});

// ==============================
// FIRST LOAD
// ==============================

loadFreeTips();
