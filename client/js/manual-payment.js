// =================================
// ZERO TRACE ANALYTICS
// MANUAL VIP PAYMENT
// =================================

const token = localStorage.getItem("token");

const form = document.getElementById("manualPaymentForm");
const planSelect = document.getElementById("plan_id");
const paymentMessage = document.getElementById("paymentMessage");

// =================================
// CHECK LOGIN
// =================================

if (!token) {
  alert("Please login first");
  window.location.href = "login.html";
}

// =================================
// LOAD VIP PLANS
// =================================

async function loadVipPlans() {
  try {
    const response = await fetch(`${API_URL}/api/vip-section-plans`);

    const plans = await response.json();

    if (!response.ok) {
      throw new Error("Unable to load VIP plans");
    }

    const savedPlan = JSON.parse(localStorage.getItem("manualPaymentPlan"));

    plans.forEach((plan) => {
      const option = document.createElement("option");

      option.value = plan.id;

      option.textContent = `${plan.section_name} - GH₵${plan.price} (${plan.duration_days} days)`;

      planSelect.appendChild(option);
    });

    // Automatically select the plan the user chose
    if (savedPlan && savedPlan.plan_id) {
      planSelect.value = savedPlan.plan_id;
    }
  } catch (error) {
    console.error("VIP PLAN ERROR:", error);

    paymentMessage.textContent = "Unable to load VIP plans.";
  }
}

// =================================
// SUBMIT MANUAL PAYMENT
// =================================

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const planId = planSelect.value;
  const paymentName = document.getElementById("payment_name").value.trim();
  const reference = document.getElementById("reference").value.trim();
  const notes = document.getElementById("notes").value.trim();

  if (!planId || !paymentName || !reference) {
    paymentMessage.textContent = "Please complete all required fields.";

    return;
  }

  paymentMessage.textContent = "Submitting payment...";

  try {
    const response = await fetch(`${API_URL}/api/manual-payments`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        plan_id: Number(planId),
        payment_name: paymentName,
        reference,
        notes,
      }),
    });

    const data = await response.json();

    console.log("MANUAL PAYMENT:", data);

    if (!response.ok) {
      paymentMessage.textContent = data.message || "Payment submission failed.";

      return;
    }

    paymentMessage.textContent =
      "Payment submitted successfully. Please wait for verification.";

    form.reset();

    setTimeout(() => {
      window.location.href = "vip-subscription.html";
    }, 1500);
  } catch (error) {
    console.error("MANUAL PAYMENT ERROR:", error);

    paymentMessage.textContent = "Unable to connect to the payment server.";
  }
});

// =================================
// START
// =================================

loadVipPlans();
