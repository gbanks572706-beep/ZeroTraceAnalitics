// ==============================
// ZERO TRACE ANALYTICS
// ADMIN VIP USERS MANAGEMENT
// ==============================

const vipUsersList = document.getElementById("vipUsersList");

const vipAdminToken = localStorage.getItem("token");

// ==============================
// LOAD VIP USERS
// ==============================

async function loadVipUsers() {
  try {
    const response = await fetch(`${API_URL}/api/admin/vip-users`, {
      headers: {
        Authorization: `Bearer ${vipAdminToken}`,
      },
    });

    const vipUsers = await response.json();

    if (!response.ok) {
      vipUsersList.innerHTML = `
        <p>
        ${vipUsers.message}
        </p>
      `;

      return;
    }

    vipUsersList.innerHTML = "";

    vipUsers.forEach((vip) => {
      const card = document.createElement("div");

      card.className = "admin-card";

      card.innerHTML = `


<h3>
👤 ${vip.name}
</h3>


<p>
Subscription ID:
${vip.subscription_id}
</p>


<p>
Email:
${vip.email}
</p>


      <p>
      VIP Section:
      ${vip.section_name}
      </p>


      <p>
      Price Paid:
      GH₵${vip.price_paid}
      </p>


      <p>
      Status:
      ${vip.status}
      </p>


      <p>
      Expiry Date:
      ${new Date(vip.expiry_date).toDateString()}
      </p>


      <p>
      Joined VIP:
      ${new Date(vip.created_at).toDateString()}
      </p>

      <div class="vip-actions">


<button onclick="extendVip(${vip.subscription_id},7)">
+7 Days
</button>


<button onclick="extendVip(${vip.subscription_id},30)">
+30 Days
</button>


<button onclick="extendVip(${vip.subscription_id},90)">
+90 Days
</button>


<button onclick="cancelVip(${vip.subscription_id})">
❌ Cancel VIP
</button>


</div>


      `;

      vipUsersList.appendChild(card);
    });
  } catch (error) {
    console.log(error);

    vipUsersList.innerHTML = `

    <p>
    Failed loading VIP users
    </p>

    `;
  }
}

// ==============================
// INITIAL LOAD
// ==============================

loadVipUsers();

// ==============================
// EXTEND VIP
// ==============================

async function extendVip(id, days) {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/vip-users/${id}/extend`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${vipAdminToken}`,
        },

        body: JSON.stringify({
          days,
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      alert(`VIP extended by ${days} days`);

      loadVipUsers();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    alert("Extension failed");
  }
}

// ==============================
// CANCEL VIP
// ==============================

async function cancelVip(id) {
  const confirmCancel = confirm("Cancel this VIP subscription?");

  if (!confirmCancel) {
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/admin/vip-users/${id}/cancel`,
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${vipAdminToken}`,
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      alert("VIP cancelled successfully");

      loadVipUsers();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    alert("Cancel failed");
  }
}
