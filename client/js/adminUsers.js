// ==============================
// ZERO TRACE ANALYTICS
// ADMIN USERS MANAGEMENT
// ==============================

const usersList = document.getElementById("usersList");

const adminToken = localStorage.getItem("token");

// ==============================
// LOAD USERS
// ==============================

async function loadUsers() {
  try {
    const response = await fetch(`${API_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const users = await response.json();

    if (!response.ok) {
      usersList.innerHTML = `
      <p>${users.message}</p>
      `;

      return;
    }

    usersList.innerHTML = "";

    users.forEach((user) => {
      const card = document.createElement("div");

      card.className = "admin-card";

      card.innerHTML = `

<h3>
👤 ${user.name}
</h3>


<p>
Email:
${user.email}
</p>


<p>
Role:
<span id="role-${user.id}">
${user.role}
</span>
</p>

<p>
Account Status:

<span id="status-${user.id}">
${user.account_status}
</span>

</p>


<p>
VIP Status:
${user.vip_status}
</p>


<p>
Joined:
${new Date(user.created_at).toDateString()}
</p>


<select id="roleSelect-${user.id}">

<option value="user" ${user.role === "user" ? "selected" : ""}>
User
</option>


<option value="admin" ${user.role === "admin" ? "selected" : ""}>
Admin
</option>

</select>


<button onclick="updateUserRole(${user.id})">
Update Role
</button>


<button onclick="viewUser(${user.id})">
View Details
</button>

<select id="statusSelect-${user.id}">

<option value="active" ${user.account_status === "active" ? "selected" : ""}>
Active
</option>


<option value="suspended" ${user.account_status === "suspended" ? "selected" : ""}>
Suspended
</option>

</select>


<button onclick="updateUserStatus(${user.id})">
Update Status
</button>


`;

      usersList.appendChild(card);
    });
  } catch (error) {
    console.log(error);

    usersList.innerHTML = `
    <p>Failed loading users</p>
    `;
  }
}

// ==============================
// INITIAL LOAD
// ==============================

loadUsers();

// ==============================
// UPDATE USER ROLE
// ==============================

async function updateUserRole(id) {
  const role = document.getElementById(`roleSelect-${id}`).value;

  try {
    const response = await fetch(`${API_URL}/api/admin/users/${id}/role`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${adminToken}`,
      },

      body: JSON.stringify({
        role,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Role updated successfully");

      loadUsers();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    alert("Role update failed");
  }
}

// ==============================
// VIEW USER DETAILS
// ==============================

async function viewUser(id) {
  try {
    const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    const user = await response.json();

    if (response.ok) {
      alert(
        `
Name:
${user.name}

Email:
${user.email}

Role:
${user.role}

Subscription:
${user.subscription_status}
`,
      );
    } else {
      alert(user.message);
    }
  } catch (error) {
    console.log(error);

    alert("Failed loading user");
  }
}

// ==============================
// UPDATE USER ACCOUNT STATUS
// ==============================

async function updateUserStatus(id) {
  const account_status = document.getElementById(`statusSelect-${id}`).value;

  try {
    const response = await fetch(`${API_URL}/api/admin/users/${id}/status`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${adminToken}`,
      },

      body: JSON.stringify({
        account_status,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account status updated successfully");

      loadUsers();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    alert("Status update failed");
  }
}
