// =================================
// ZERO TRACE ANALYTICS
// ADMIN VIP PLANS MANAGEMENT
// =================================

const adminPlanToken = localStorage.getItem("token");

const planForm = document.getElementById("planForm");

const plansList = document.getElementById("plansList");

const planEditModal = document.getElementById("planEditModal");

const closePlanModal = document.getElementById("closePlanModal");

const editPlanForm = document.getElementById("editPlanForm");

async function loadPlans() {
  try {
    const response = await fetch(`${API_URL}/api/subscription-plans`);

    const plans = await response.json();

    plansList.innerHTML = "";

    plans.forEach((plan) => {
      const card = document.createElement("div");

      card.className = "admin-plan-card";

      card.innerHTML = `


<h3>
${plan.name}
</h3>


<p>
Price:
GH₵${plan.price}
</p>


<p>
Duration:
${plan.duration_days} Days
</p>


<p>
${plan.description}
</p>


<p>
Status:
${plan.status}
</p>



<button onclick="editPlan(${JSON.stringify(plan).replaceAll('"', "&quot;")})">

Edit

</button>


<button onclick="deletePlan(${plan.id})">

Delete

</button>


`;

      plansList.appendChild(card);
    });
  } catch (error) {
    console.log(error);
  }
}

// ADD PLAN

planForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const plan = {
    name: document.getElementById("planName").value,

    price: document.getElementById("planPrice").value,

    duration_days: document.getElementById("planDuration").value,

    description: document.getElementById("planDescription").value,

    status: document.getElementById("planStatus").value,
  };

  await fetch(`${API_URL}/api/subscription-plans`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${adminPlanToken}`,
    },

    body: JSON.stringify(plan),
  });

  planForm.reset();

  loadPlans();
});

// OPEN EDIT MODAL

function editPlan(plan) {
  document.getElementById("editPlanId").value = plan.id;

  document.getElementById("editPlanName").value = plan.name;

  document.getElementById("editPlanPrice").value = plan.price;

  document.getElementById("editPlanDuration").value = plan.duration_days;

  document.getElementById("editPlanDescription").value = plan.description;

  document.getElementById("editPlanStatus").value = plan.status;

  planEditModal.style.display = "block";
}

// SAVE EDIT

editPlanForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editPlanId").value;

  const updatedPlan = {
    name: document.getElementById("editPlanName").value,

    price: document.getElementById("editPlanPrice").value,

    duration_days: document.getElementById("editPlanDuration").value,

    description: document.getElementById("editPlanDescription").value,

    status: document.getElementById("editPlanStatus").value,
  };

  await fetch(
    `${API_URL}/api/subscription-plans/${id}`,

    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${adminPlanToken}`,
      },

      body: JSON.stringify(updatedPlan),
    },
  );

  planEditModal.style.display = "none";

  loadPlans();
});

// CLOSE MODAL

closePlanModal.onclick = () => {
  planEditModal.style.display = "none";
};

// DELETE PLAN

async function deletePlan(id) {
  if (!confirm("Delete this plan?")) return;

  await fetch(
    `${API_URL}/api/subscription-plans/${id}`,

    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${adminPlanToken}`,
      },
    },
  );

  loadPlans();
}

loadPlans();
