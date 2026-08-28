// =================================
// ZERO TRACE ANALYTICS
// ADMIN VIP SECTION PLANS
// =================================

const vipToken = localStorage.getItem("token");

const vipPlanForm = document.getElementById("vipPlanForm");

const vipPlanSection = document.getElementById("vipPlanSection");

const vipPlansList = document.getElementById("vipPlansList");

// =================================
// LOAD VIP SECTIONS
// =================================

async function loadVipSections() {
  try {
    const response = await fetch(`${API_URL}/api/sections/VIP`);

    const sections = await response.json();

    vipPlanSection.innerHTML = `

        <option value="">
        Select VIP Section
        </option>

        `;

    sections.forEach((section) => {
      const option = document.createElement("option");

      option.value = section.id;

      option.textContent = section.name;

      vipPlanSection.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
}

// =================================
// LOAD VIP PLANS
// =================================

async function loadVipPlans() {
  try {
    const response = await fetch(`${API_URL}/api/vip-section-plans`);

    console.log("VIP RESPONSE STATUS:", response.status);

    const plans = await response.json();

    console.log("VIP PLANS:", plans);

    vipPlansList.innerHTML = "";

    if (plans.length === 0) {
      vipPlansList.innerHTML = "<p>No VIP plans created yet</p>";

      return;
    }

    plans.forEach((plan) => {
      const card = document.createElement("div");

      card.className = "admin-plan-card";

      card.innerHTML = `


      <h3>
      ${plan.section_name}
      </h3>


      <p>
      Price:
      GH₵${plan.price}
      </p>


      <p>
      Duration:
      ${plan.duration_days}
      Days
      </p>


      <p>
      Status:
      ${plan.status}
      </p>


      <div class="plan-actions">

<button 
class="edit-btn"
onclick="editVipPlan(
${plan.id},
${plan.section_id},
${plan.price},
${plan.duration_days},
'${plan.status}'
)">
✏ Edit
</button>


<button 
class="delete-btn"
onclick="deleteVipPlan(${plan.id})">
🗑 Delete
</button>

</div>

      `;

      vipPlansList.appendChild(card);
    });
  } catch (error) {
    console.log("VIP PLAN ERROR:", error);

    vipPlansList.innerHTML = "<p>Failed loading VIP plans</p>";
  }
}
// =================================
// CREATE VIP PLAN
// =================================

vipPlanForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const plan = {
    section_id: vipPlanSection.value,

    plan_name: "VIP Subscription",

    price: document.getElementById("vipPlanPrice").value,

    duration_days: document.getElementById("vipPlanDuration").value,

    description: "",

    features: [],

    is_featured: false,

    status: document.getElementById("vipPlanStatus").value,
  };

  try {
    let url = `${API_URL}/api/vip-section-plans`;

    let method = "POST";

    if (vipPlanForm.dataset.edit) {
      url = `${API_URL}/api/vip-section-plans/${vipPlanForm.dataset.edit}`;

      method = "PUT";
    }

    const response = await fetch(
      url,

      {
        method: method,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${vipToken}`,
        },

        body: JSON.stringify(plan),
      },
    );

    const data = await response.json();

    if (response.ok) {
      alert("VIP Plan Created Successfully");

      vipPlanForm.reset();

      loadVipPlans();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
});

loadVipSections();

loadVipPlans();
async function deleteVipPlan(id) {
  if (!confirm("Delete this VIP plan?")) return;

  await fetch(`${API_URL}/api/vip-section-plans/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${vipToken}`,
    },
  });

  loadVipPlans();
}

function editVipPlan(id, section_id, price, duration, status) {
  document.getElementById("vipPlanSection").value = section_id;

  document.getElementById("vipPlanPrice").value = price;

  document.getElementById("vipPlanDuration").value = duration;

  document.getElementById("vipPlanStatus").value = status;

  vipPlanForm.dataset.edit = id;
}
