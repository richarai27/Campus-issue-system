function showStatus() {
  document.getElementById("statusSection").style.display = "block";
  document.getElementById("registerSection").style.display = "none";
  loadComplaints();
}

function showRegister() {
  document.getElementById("statusSection").style.display = "none";
  document.getElementById("registerSection").style.display = "block";
}


function submitComplaint() {
  const title = document.getElementById("title").value.trim().toLowerCase();
  const description = document.getElementById("description").value;

  if (!title || !selectedDept) {
    alert("Please enter title and select department");
    return;
  }

  const ref = db.ref("complaints");

  ref.once("value", (snapshot) => {
    let found = false;

    snapshot.forEach((child) => {
      const data = child.val();

      if (
        data.title.toLowerCase() === title &&
        data.category === selectedDept
      ) {
        // MATCH FOUND → increase count
        db.ref("complaints/" + child.key).update({
          count: (data.count || 1) + 1
        });

        found = true;
      }
    });

    if (!found) {
      // CREATE NEW
      ref.push({
        title: title,
        description: description,
        category: selectedDept,
        status: "Pending",
        count: 1
      });
    }

    alert("Complaint recorded!");
  });
}

// Load all complaints
function loadComplaints() {
  const list = document.getElementById("statusList");

  db.ref("complaints").on("value", (snapshot) => {
    list.innerHTML = "";

    snapshot.forEach((child) => {
      const data = child.val();

      list.innerHTML += `
        <div>
          <h4>${data.title}</h4>
      <p>${data.category} | ${data.status} | Count: ${data.count || 1}</p>
        </div>
        <hr>
      `;
    });
  });
}

// Filter
function filterStatus(status) {
  const list = document.getElementById("statusList");

  db.ref("complaints").once("value", (snapshot) => {
    list.innerHTML = "";

    snapshot.forEach((child) => {
      const data = child.val();

      if (status === "all" || data.status === status) {
        list.innerHTML += `
          <div>
            <h4>${data.title}</h4>
            <p>${data.category} | ${data.status}</p>
          </div>
          <hr>
        `;
      }
    });
  });
}


function loadDeptComplaints() {
  const list = document.getElementById("pollList");

  db.ref("complaints").on("value", (snapshot) => {
    list.innerHTML = "";

    snapshot.forEach((child) => {
      const data = child.val();

      // only same department + not resolved
      if (
        data.category === selectedDept &&
        (data.status === "Pending" || data.status === "In Progress")
    ){
        list.innerHTML += `
          <div>
            <input type="radio" name="complaint" value="${child.key}">
            ${data.title} | ${data.status} | Votes: ${data.count || 1}
          </div>
        `;
      }
    });
  });
}

function handleMainTab(event, type) {
  // highlight buttons
  const buttons = document.querySelectorAll("body > button");
  buttons.forEach(btn => {
    btn.classList.remove("active");
    btn.classList.add("dim");
  });

  event.target.classList.add("active");
  event.target.classList.remove("dim");

  // show sections
  if (type === "status") {
    showStatus();
  } else {
    showRegister();
  }
}

function handleFilter(event, status) {
  // highlight filter buttons
  const buttons = document.querySelectorAll("#statusSection button");
  buttons.forEach(btn => {
    btn.classList.remove("active");
    btn.classList.add("dim");
  });

  event.target.classList.add("active");
  event.target.classList.remove("dim");

  // call existing function
  filterStatus(status);
}

function voteComplaint() {
  const selected = document.querySelector('input[name="complaint"]:checked');

  if (!selected) {
    alert("Please select a complaint to vote");
    return;
  }

  const id = selected.value;

  // check if already voted
  if (localStorage.getItem("voted_" + id)) {
    alert("You have already voted for this complaint");
    return;
  }

  const ref = db.ref("complaints/" + id);

  ref.once("value", (snapshot) => {
    const data = snapshot.val();

    ref.update({
      count: (data.count || 1) + 1
    });

    // mark as voted
    localStorage.setItem("voted_" + id, true);

    alert("Vote added!");
  });
}

// Department select
let selectedDept = "";

function selectDept(dept) {
  selectedDept = dept;

  // remove active from all buttons
  const buttons = document.querySelectorAll("#registerSection button");
  buttons.forEach(btn => {
    btn.classList.remove("active");
    btn.classList.add("dim");
  });

  // highlight selected
  event.target.classList.add("active");
  event.target.classList.remove("dim");

  loadDeptComplaints();
}

