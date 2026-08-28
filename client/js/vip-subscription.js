// =================================
// ZERO TRACE ANALYTICS
// VIP SUBSCRIPTION PAGE
// =================================

const plansContainer = document.getElementById("plansContainer");

const token = localStorage.getItem("token");

let userSubscriptions = [];

// ================================
// CHECK LOGIN
// ================================

if (!token) {
  alert("Please login first");
  window.location.href = "login.html";

  throw new Error("Authentication required");
}

// ================================
// LOAD USER ACTIVE VIP SECTIONS
// ================================

async function loadUserSubscriptions() {
  try {
    const response = await fetch(
      `${API_URL}/api/vip-subscriptions/my-sections`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok) {
      userSubscriptions = await response.json();

      console.log("USER SUBSCRIPTIONS:", userSubscriptions);
    } else if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("Your session has expired. Please login again.");

      window.location.href = "login.html";
    }
  } catch (error) {
    console.log("Subscription check error:", error);
  }
}

// ================================
// LOAD VIP PLANS
// ================================

async function loadVipPlans() {
  try {
    const response = await fetch(`${API_URL}/api/vip-section-plans`);

    const plans = await response.json();

    plansContainer.innerHTML = "";

    plans.forEach((plan) => {
      // CHECK IF USER OWNS THIS PLAN

      const subscribedPlan = userSubscriptions.find(
        (sub) => Number(sub.id) === Number(plan.section_id),
      );

      let buttonText = "Subscribe";

      let buttonAction = `subscribeVip(${plan.id})`;

      let expiry = "";

      if (subscribedPlan) {
        const expiryDate = new Date(subscribedPlan.expiry_date);

        if (expiryDate > new Date()) {
          buttonText = "OPEN VIP";

          expiry = `
                    <p>
                    Expires:
                    ${expiryDate.toDateString()}
                    </p>
                    `;

          buttonAction = `
    openVip(${plan.section_id})
`;
        }
      }

      const card = document.createElement("div");

      card.className = "plan-card";

      // Plan name
      const planTitle = document.createElement("h3");
      planTitle.textContent = plan.section_name || "VIP Access";

      // Price
      const price = document.createElement("h2");
      price.textContent = `GH₵${plan.price}`;

      // Duration
      const duration = document.createElement("p");
      duration.textContent = `${plan.duration_days} Days Access`;

      card.appendChild(planTitle);
      card.appendChild(price);
      card.appendChild(duration);

      // Expiry
      if (expiry) {
        const expiryContainer = document.createElement("div");

        expiryContainer.innerHTML = expiry;

        card.appendChild(expiryContainer);
      }

      // Features
      const featuresList = document.createElement("ul");

      const features = [
        "Premium Predictions",
        "Expert Analysis",
        "High Confidence Tips",
      ];

      features.forEach((feature) => {
        const item = document.createElement("li");

        item.textContent = `✅ ${feature}`;

        featuresList.appendChild(item);
      });

      card.appendChild(featuresList);

      // Subscribe / Open VIP button
      const button = document.createElement("button");

      button.textContent = buttonText;

      if (subscribedPlan) {
        button.addEventListener("click", () => {
          openVip(plan.section_id);
        });
      } else {
        button.addEventListener("click", () => {
          subscribeVip(plan.id);
        });
      }

      card.appendChild(button);

      plansContainer.appendChild(card);
    });
  } catch (error) {
    console.log(error);

    plansContainer.innerHTML = `
        <p>
        Unable to load VIP plans
        </p>
        `;
  }
}

// ================================
// SUBSCRIBE
// ================================

function subscribeVip(planId) {
  initializeVipPayment(planId);
}

// ================================
// OPEN VIP
// ================================

function openVip(sectionId) {
  localStorage.setItem("selectedVipSection", sectionId);

  window.location.href = "vip.html";
}

// ================================
// START
// ================================

async function start() {
  await loadUserSubscriptions();

  await loadVipPlans();
}

start();
