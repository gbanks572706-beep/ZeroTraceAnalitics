// =================================
// ZERO TRACE ANALYTICS
// MANUAL VIP PAYMENT SYSTEM
// =================================

function initializeVipPayment(planId) {
  // Validate plan ID
  if (!planId) {
    alert("VIP plan is not available");
    return;
  }

  // Check login
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  // Save selected plan
  localStorage.setItem("selectedVipPlan", planId);

  // Open manual payment page
  window.location.href = "manual-payment.html";
}
