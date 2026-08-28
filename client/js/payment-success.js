// =================================
// ZERO TRACE ANALYTICS
// PAYMENT SUCCESS VERIFICATION
// =================================

const paymentMessage = document.getElementById("paymentMessage");

const token = localStorage.getItem("token");

// =================================
// CHECK LOGIN
// =================================

if (!token) {
  paymentMessage.textContent = "Please login again to verify your payment.";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);

  throw new Error("Authentication required");
}

// =================================
// GET PAYSTACK REFERENCE
// =================================

const urlParams = new URLSearchParams(window.location.search);

const reference = urlParams.get("reference") || urlParams.get("trxref");

// =================================
// VERIFY PAYMENT
// =================================

async function verifyPayment() {
  try {
    if (!reference) {
      paymentMessage.textContent = "Payment reference was not found.";

      return;
    }

    paymentMessage.textContent = "Verifying your payment with Paystack...";

    const response = await fetch(`${API_URL}/api/payment-verification/verify`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        reference,
      }),
    });

    const data = await response.json();

    console.log("PAYMENT VERIFICATION:", data);

    if (response.ok) {
      paymentMessage.textContent =
        "Payment successful! Your VIP subscription is now active.";

      setTimeout(() => {
        window.location.href = "vip.html";
      }, 2500);

      return;
    }

    paymentMessage.textContent = data.message || "Payment verification failed.";
  } catch (error) {
    console.error("PAYMENT VERIFICATION ERROR:", error);

    paymentMessage.textContent = "Unable to verify payment. Please try again.";
  }
}

// =================================
// START
// =================================

if (token) {
  verifyPayment();
}
