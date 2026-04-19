// 🔥 Load complaints by department
function loadDept(dept) {
  const list = document.getElementById("adminList");

  db.ref("complaints").on("value", (snapshot) => {
    list.innerHTML = "";

    let complaintsArray = [];

    snapshot.forEach((child) => {
      const data = child.val();

      // ✅ FIX: safe category match
      if (data.category && data.category.toLowerCase() === dept.toLowerCase()) {
        complaintsArray.push({
          id: child.key,
          ...data
        });
      }
    });

    // 🔥 Sort by votes (highest first)
    complaintsArray.sort((a, b) => (b.count || 1) - (a.count || 1));

    // 🔥 Display
    complaintsArray.forEach((item) => {
      list.innerHTML += `
        <div>
          <h4>${item.title}</h4>
          <p>${item.description || ""}</p>
          <p class="${getStatusClass(item.status)}">
            ${item.status} | Votes: ${item.count || 1}
          </p>

          <button onclick="updateStatus('${item.id}', 'In Progress')">
            In Progress
          </button>

          <button onclick="updateStatus('${item.id}', 'Resolved')">
            Resolved
          </button>
        </div>
        <hr>
      `;
    });

    // if no complaints
    if (complaintsArray.length === 0) {
      list.innerHTML = "<p>No complaints in this department</p>";
    }
  });
}

// 🔥 Update complaint status
function updateStatus(id, newStatus) {
  db.ref("complaints/" + id).update({
    status: newStatus
  });

  alert("Status updated to " + newStatus);
}

// 🔥 Status color helper
function getStatusClass(status) {
  if (status === "Pending") return "pending";
  if (status === "In Progress") return "inprogress";
  if (status === "Resolved") return "resolved";
  return "";
}

// 🔥 PERFORMANCE SYSTEM
function calculatePerformance() {
  const resultDiv = document.getElementById("performance");

  let stats = {
    hostel: { total: 0, resolved: 0 },
    academics: { total: 0, resolved: 0 },
    campus: { total: 0, resolved: 0 }
  };

  db.ref("complaints").once("value", (snapshot) => {

    snapshot.forEach((child) => {
      const data = child.val();

      if (!data.category) return;

      const dept = data.category.toLowerCase();

      if (stats[dept]) {
        stats[dept].total++;

        if (data.status === "Resolved") {
          stats[dept].resolved++;
        }
      }
    });

    let resultArray = [];

    for (let dept in stats) {
      let total = stats[dept].total;
      let resolved = stats[dept].resolved;

      let performance = total === 0 ? 0 : ((resolved / total) * 100).toFixed(2);

      resultArray.push({
        dept,
        total,
        resolved,
        performance: parseFloat(performance)
      });
    }

    // 🔥 Sort ranking
    resultArray.sort((a, b) => b.performance - a.performance);

    // 🔥 Display result
    let output = "<h3>🏆 Department Ranking</h3>";

    resultArray.forEach((item, index) => {
      output += `
        <div>
          <h4>#${index + 1} ${item.dept.toUpperCase()}</h4>
          <p>Total: ${item.total}</p>
          <p>Resolved: ${item.resolved}</p>
          <p>Performance: ${item.performance}%</p>
        </div>
        <hr>
      `;
    });

    resultDiv.innerHTML = output;
  });
}