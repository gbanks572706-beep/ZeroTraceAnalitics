// =================================
// ZERO TRACE ANALYTICS
// ADMIN SECTION MANAGEMENT
// =================================

const sectionToken = localStorage.getItem("token");

// Elements

const sectionsList = document.getElementById("sectionsList");

const addSectionBtn = document.getElementById("addSectionBtn");

const sectionModal = document.getElementById("sectionModal");

const closeSectionModal = document.getElementById("closeSectionModal");

const sectionForm = document.getElementById("sectionForm");

const editSectionModal = document.getElementById("editSectionModal");

const closeEditSectionModal = document.getElementById("closeEditSectionModal");

const editSectionForm = document.getElementById("editSectionForm");

// =================================
// LOAD SECTIONS
// =================================

async function loadSections() {
  try {
    const response = await fetch(`${API_URL}/api/sections`);

    const sections = await response.json();

    sectionsList.innerHTML = "";

    const freeSections = sections.filter((item) => item.category === "FREE");

    const vipSections = sections.filter((item) => item.category === "VIP");

    sectionsList.innerHTML += `

<h3>
🆓 FREE SECTIONS
</h3>

`;

    freeSections.forEach((section) => {
      sectionsList.innerHTML += createSectionCard(section);
    });

    sectionsList.innerHTML += `

<h3>
👑 VIP SECTIONS
</h3>

`;

    vipSections.forEach((section) => {
      sectionsList.innerHTML += createSectionCard(section);
    });
  } catch (error) {
    console.log(error);

    sectionsList.innerHTML = "<p>Failed loading sections</p>";
  }
}

// =================================
// SECTION CARD
// =================================

function createSectionCard(section) {
  return `

<div class="section-card">


<h3>
${section.name}
</h3>


<p>
Category:
${section.category}
</p>


<p>
Status:
${section.status}
</p>



<div class="section-actions">


<button 
class="edit-btn"
onclick="openEditSection(${section.id},
'${section.name}',
'${section.category}',
'${section.status}')">

✏ Edit

</button>



<button
class="delete-btn"
onclick="deleteSection(${section.id})">

🗑 Delete

</button>


</div>


</div>

`;
}

// =================================
// OPEN ADD MODAL
// =================================

addSectionBtn.onclick = () => {
  sectionModal.style.display = "flex";
};

closeSectionModal.onclick = () => {
  sectionModal.style.display = "none";
};

// =================================
// CREATE SECTION
// =================================

sectionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("sectionName").value,

    category: document.getElementById("sectionCategory").value,

    status: document.getElementById("sectionStatus").value,
  };

  await fetch(`${API_URL}/api/sections`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${sectionToken}`,
    },

    body: JSON.stringify(data),
  });

  sectionForm.reset();

  sectionModal.style.display = "none";

  loadSections();
});

// =================================
// OPEN EDIT MODAL
// =================================

function openEditSection(id, name, category, status) {
  editSectionModal.style.display = "flex";

  document.getElementById("editSectionId").value = id;

  document.getElementById("editSectionName").value = name;

  document.getElementById("editSectionCategory").value = category;

  document.getElementById("editSectionStatus").value = status;
}

closeEditSectionModal.onclick = () => {
  editSectionModal.style.display = "none";
};

// =================================
// UPDATE SECTION
// =================================

editSectionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editSectionId").value;

  const data = {
    name: document.getElementById("editSectionName").value,

    category: document.getElementById("editSectionCategory").value,

    status: document.getElementById("editSectionStatus").value,
  };

  await fetch(
    `${API_URL}/api/sections/${id}`,

    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${sectionToken}`,
      },

      body: JSON.stringify(data),
    },
  );

  editSectionModal.style.display = "none";

  loadSections();
});

// =================================
// DELETE SECTION
// =================================

async function deleteSection(id) {
  if (!confirm("Delete this section?")) return;

  await fetch(
    `${API_URL}/api/sections/${id}`,

    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${sectionToken}`,
      },
    },
  );

  loadSections();
}

// START

loadSections();
