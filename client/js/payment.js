// =================================
// ZERO TRACE ANALYTICS
// PAYSTACK PAYMENT SYSTEM
// =================================

// =================================
// INITIALIZE VIP PAYMENT
// =================================

async function initializeVipPayment(planId) {
  try {
    // =================================
    // VALIDATE PLAN ID
    // =================================

    if (!planId) {
      alert("VIP plan is not available");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "login.html";
      return;
    }

    // =================================
    // SEND PLAN ID TO BACKEND
    // =================================

    const response = await fetch(`${API_URL}/api/payments/initialize`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        plan_id: planId,
      }),
    });

    const data = await response.json();

    console.log("PAYMENT INITIALIZATION:", data);

    if (!response.ok) {
      alert(data.message || "Unable to initialize payment");
      return;
    }

    // =================================
    // OPEN PAYSTACK CHECKOUT
    // =================================

    if (!data.authorization_url) {
      alert("Paystack authorization URL was not returned");
      return;
    }

    window.location.href = data.authorization_url;
  } catch (error) {
    console.error("PAYMENT INITIALIZATION ERROR:", error);

    alert("Unable to connect to payment server");
  }
}
