function loadDept(dept) {

  const list = document.getElementById("adminList");

  db.ref("complaints").on("value", (snapshot) => {
    list.innerHTML = "";

    let complaints = [];

    snapshot.forEach((child) => {
      const data = child.val();

      if (data.category === dept) {
        complaints.push({
          id: child.key,
          ...data
        });
      }
    });

    // 🔥 SORT by votes (highest first)
    complaints.sort((a, b) => (b.count || 1) - (a.count || 1));

    // DISPLAY
    complaints.forEach((data, index) => {
      list.innerHTML += `
        <div>
         <h4>
            ${index === 0 ? "🔥 TOP ISSUE: " : ""}${data.title}
         </h4>

         <p class="${
          data.status === "Pending"
            ? "pending"
            : data.status === "In Progress"
            ? "inprogress"
            : "resolved"
            }">
            ${data.status} | Votes: ${data.count || 1}
          </p>

          <button onclick="updateStatus('${data.id}', 'In Progress')">
           In Progress
          </button>

          <button onclick="updateStatus('${data.id}', 'Resolved')">
           Resolved
          </button>
        </div>
        <hr>
      `;
    });
  });
}

function selectAdminDept(event, dept) {
  const buttons = document.querySelectorAll("button");

  buttons.forEach(btn => {
    btn.classList.remove("active");
    btn.classList.add("dim");
  });

  event.target.classList.add("active");
  event.target.classList.remove("dim");

  loadDept(dept);
}

function updateStatus(id, status) {
  db.ref("complaints/" + id).update({
    status: status
  });
}