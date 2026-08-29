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
      // ================================
      // CHECK IF USER OWNS THIS PLAN
      // ================================

      const subscribedPlan = userSubscriptions.find(
        (sub) => Number(sub.id) === Number(plan.section_id),
      );

      let expiry = "";

      const card = document.createElement("div");

      card.className = "plan-card";

      // ================================
      // PLAN NAME
      // ================================

      const planTitle = document.createElement("h3");

      planTitle.textContent = plan.section_name || "VIP Access";

      card.appendChild(planTitle);

      // ================================
      // PRICE
      // ================================

      const price = document.createElement("h2");

      price.textContent = `GH₵${plan.price}`;

      card.appendChild(price);

      // ================================
      // DURATION
      // ================================

      const duration = document.createElement("p");

      duration.textContent = `${plan.duration_days} Days Access`;

      card.appendChild(duration);

      // ================================
      // ACTIVE SUBSCRIPTION
      // ================================

      if (subscribedPlan) {
        const expiryDate = new Date(subscribedPlan.expiry_date);

        if (expiryDate > new Date()) {
          expiry = `
            <p>
              Expires: ${expiryDate.toDateString()}
            </p>
          `;

          const expiryContainer = document.createElement("div");

          expiryContainer.innerHTML = expiry;

          card.appendChild(expiryContainer);
        }
      }

      // ================================
      // FEATURES
      // ================================

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

      // ================================
      // ACTIVE VIP
      // ================================

      if (subscribedPlan) {
        const expiryDate = new Date(subscribedPlan.expiry_date);

        if (expiryDate > new Date()) {
          const openButton = document.createElement("button");

          openButton.textContent = "OPEN VIP";

          openButton.addEventListener("click", () => {
            openVip(plan.section_id);
          });

          card.appendChild(openButton);

          plansContainer.appendChild(card);

          return;
        }
      }

      // ================================
      // PAYSTACK TEMPORARILY DISABLED
      // ================================

      // Paystack payments are temporarily disabled.
      // Users must use manual payment until Paystack
      // verification is fully secured.

      // ================================
      // MANUAL PAYMENT BUTTON
      // ================================

      const manualButton = document.createElement("button");

      manualButton.textContent = "Pay Manually";

      manualButton.className = "manual-payment-btn";

      manualButton.addEventListener("click", () => {
        openManualPayment(plan);
      });

      card.appendChild(manualButton);

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
// PAYSTACK SUBSCRIBE
// ================================

function subscribeVip(planId) {
  initializeVipPayment(planId);
}

// ================================
// MANUAL PAYMENT
// ================================

function openManualPayment(plan) {
  localStorage.setItem(
    "manualPaymentPlan",
    JSON.stringify({
      plan_id: plan.id,
      section_id: plan.section_id,
      section_name: plan.section_name,
      price: plan.price,
      duration_days: plan.duration_days,
    }),
  );

  window.location.href = "manual-payment.html";
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
