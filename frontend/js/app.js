const API_URL = "http://localhost:3000/api/expenses";

// Get Expenses
async function getExpenses() {
  showSpinner();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error.message === "Failed to fetch") {
      showAlert(
        "Unable to connect to the server. Please try again later.",
        "danger",
      );
    } else {
      showAlert(error.message, "danger");
    }

    return [];
  } finally {
    hideSpinner();
  }
}
// Add Expense
async function addExpense(data) {
  showSpinner();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      throw new Error(`HTTP Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    showAlert(error.message, "danger");

    return false;
  } finally {
    hideSpinner();
  }
}
// Update Expense
async function updateExpense(id, data) {
  showSpinner();

  try {
    const response = await fetch(API_URL + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 400 || response.status === 404) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      throw new Error(`HTTP Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    showAlert(error.message, "danger");

    return false;
  } finally {
    hideSpinner();
  }
}
// Delete Expense
async function deleteExpense(id) {
  showSpinner();

  try {
    const response = await fetch(API_URL + "/" + id, {
      method: "DELETE",
    });

    if (!response.ok) {
      if (response.status === 404) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      throw new Error(`HTTP Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    showAlert(error.message, "danger");

    return false;
  } finally {
    hideSpinner();
  }
}

// Handle adding a new expense
function handleAddExpense() {
  const expenseForm = document.getElementById("expenseForm");

  expenseForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputTitle = document.getElementById("inputTitle").value;
    const inputAmount = document.getElementById("inputAmount").value;
    const inputCategory = document.getElementById("inputCategory").value;
    const inputDate = document.getElementById("inputDate").value;

    const titleError = document.getElementById("titleError");
    const amountError = document.getElementById("amountError");
    const categoryError = document.getElementById("categoryError");
    const dateError = document.getElementById("dateError");

    let isValid = true;

    // Title validation
    if (inputTitle.trim() === "") {
      titleError.textContent = "Title is required";
      isValid = false;
    } else {
      titleError.textContent = "";
    }

    // Amount validation
    if (inputAmount === "") {
      amountError.textContent = "Amount is required";
      isValid = false;
    } else if (Number(inputAmount) <= 0) {
      amountError.textContent = "Amount must be greater than zero";
      isValid = false;
    } else {
      amountError.textContent = "";
    }

    // Category validation
    if (inputCategory === "") {
      categoryError.textContent = "Category is required";
      isValid = false;
    } else {
      categoryError.textContent = "";
    }

    // Date validation
    if (inputDate === "") {
      dateError.textContent = "Date is required";
      isValid = false;
    } else {
      dateError.textContent = "";
    }

    // Stop if validation failed
    if (!isValid) {
      return;
    }

    const newExpense = {
      title: inputTitle,
      amount: inputAmount,
      category: inputCategory,
      date: inputDate,
    };

    const success = await addExpense(newExpense);
    if (success) {
      showAlert("Expense added successfully!", "success");

      expenseForm.reset();

      await refresh();
    }
  });
}
// Handle Edit button click
function handleEditBtn() {
  const expensesTable = document.getElementById("expensesTable");

  expensesTable.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
      const id = event.target.dataset.id;

      document.getElementById("editTitle").value = event.target.dataset.title;

      document.getElementById("editAmount").value = event.target.dataset.amount;

      document.getElementById("editCategory").value =
        event.target.dataset.category;

      document.getElementById("editDate").value = event.target.dataset.date;

      document.getElementById("saveEditBtn").dataset.id = id;

      const modal = new bootstrap.Modal(document.getElementById("editModal"));

      modal.show();
    }
  });
}
// Handle saving edited expense
function handleSaveEdit() {
  const saveEditBtn = document.getElementById("saveEditBtn");

  saveEditBtn.addEventListener("click", async () => {
    const id = saveEditBtn.dataset.id;

    const title = document.getElementById("editTitle").value;
    const amount = document.getElementById("editAmount").value;
    const category = document.getElementById("editCategory").value;
    const date = document.getElementById("editDate").value;

    const titleError = document.getElementById("editTitleError");
    const amountError = document.getElementById("editAmountError");
    const categoryError = document.getElementById("editCategoryError");
    const dateError = document.getElementById("editDateError");

    let isValid = true;

    if (title.trim() === "") {
      titleError.textContent = "Title is required";
      isValid = false;
    } else {
      titleError.textContent = "";
    }

    if (amount === "") {
      amountError.textContent = "Amount is required";
      isValid = false;
    } else if (Number(amount) <= 0) {
      amountError.textContent = "Amount must be greater than zero";
      isValid = false;
    } else {
      amountError.textContent = "";
    }

    if (category === "") {
      categoryError.textContent = "Category is required";
      isValid = false;
    } else {
      categoryError.textContent = "";
    }

    if (date === "") {
      dateError.textContent = "Date is required";
      isValid = false;
    } else {
      dateError.textContent = "";
    }

    if (!isValid) {
      return;
    }

    const editableExpense = {
      title: title,
      amount: Number(amount),
      category: category,
      date: date,
    };

    const success = await updateExpense(id, editableExpense);

    if (success) {
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editModal"),
      );

      modal.hide();

      showAlert("Expense updated successfully!", "success");

      await refresh();
    }
  });
}
// Handle Delete button click
function handleDeleteBtn() {
  const expensesTable = document.getElementById("expensesTable");

  expensesTable.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const id = event.target.dataset.id;

      const success = await deleteExpense(id);

      if (success) {
        showAlert("Expense deleted successfully!", "success");
        await refresh();
      }
    }
  });
}

// Apply category, month, and title filters
let sortByTitle = null;
async function applyFilters() {
  const categoryFilter = document.getElementById("categoryFilter").value;
  const monthFilter = document.getElementById("monthFilter").value;
  const searchInput = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  const data = await getExpenses();

  // Apply Filter by Category
  const filteredData = data.filter((expense) => {
    const matchesCategory =
      categoryFilter === "All" || expense.category === categoryFilter;

    // Bonus - Filter by month
    const matchesMonth =
      monthFilter === "" || expense.date.startsWith(monthFilter);

    // Bonus - Search by title
    const matchesTitle =
      searchInput === "" || expense.title.toLowerCase().includes(searchInput);

    return matchesCategory && matchesMonth && matchesTitle;
  });

  // Bonus - Sort Table
  if (sortByTitle === true) {
    filteredData.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortByTitle === false) {
    filteredData.sort((a, b) => b.title.localeCompare(a.title));
  }

  renderTable(filteredData);
}

// UI Rendering
function renderTable(list) {
  const expensesTable = document.getElementById("expensesTable");

  expensesTable.innerHTML = "";

  if (list.length === 0) {
    expensesTable.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">
          No expenses found.
        </td>
      </tr>
    `;

    return;
  }

  list.forEach((expense) => {
    let categoryColor = "";

    if (expense.category === "Food") {
      categoryColor = "bg-success";
    } else if (expense.category === "Transport") {
      categoryColor = "bg-primary";
    } else if (expense.category === "Bills") {
      categoryColor = "bg-warning text-dark";
    } else if (expense.category === "Entertainment") {
      categoryColor = "bg-info text-dark";
    } else {
      categoryColor = "bg-secondary";
    }

    expensesTable.innerHTML += `
      <tr>
        <td>${expense.title}</td>
       <td class="text-end">
            ${expense.amount}
        </td>
        <td>
           <span class="badge ${categoryColor}">
                ${expense.category}
            </span>
        </td>
        <td>${expense.date}</td>
        <td class="text-end">
            <button 
                type="button" 
                class="btn btn-outline-secondary edit-btn" 
                data-id="${expense.id}"
                data-title="${expense.title}"
                data-amount="${expense.amount}"
                data-category="${expense.category}"
                data-date="${expense.date}"
            >
                Edit
            </button>
            <button 
                type="button" 
                class="btn btn-outline-danger delete-btn" 
                data-id="${expense.id}"
            >
                Delete
            </button>
        </td>
      </tr>
    `;
  });
}
function renderSummary(list) {
  const totalAmount = document.getElementById("totalAmount");
  const expensesCount = document.getElementById("expensesCount");
  const highestAmount = document.getElementById("highestAmount");
  const highestTitle = document.getElementById("highestTitle");

  // Total Amount
  const sum = list.reduce(add, 0).toFixed(2);
  function add(accumulator, expense) {
    return accumulator + expense.amount;
  }
  totalAmount.innerHTML = sum;

  // Expenses Count
  expensesCount.innerHTML = list.length;

  // Highest Amount
  if (list.length === 0) {
    highestAmount.innerHTML = "0";
    highestTitle.innerHTML = "-";
  } else {
    const highestExpense = list.reduce((max, expense) => {
      if (expense.amount > max.amount) {
        return expense;
      } else {
        return max;
      }
    });
    highestAmount.innerHTML = highestExpense.amount;
    highestTitle.innerHTML = highestExpense.title;
  }
}

// Bonus: Expenses by Category Chart
let expenseChart;
function renderChart(list) {
  const categoryTotals = {
    Food: 0,
    Transport: 0,
    Bills: 0,
    Entertainment: 0,
    Other: 0,
  };

  // Calculate the total expenses for each category
  list.forEach((expense) => {
    categoryTotals[expense.category] += expense.amount;
  });

  // Prepare the data for Chart.js
  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);
  const barColors = ["green", "blue", "orange", "cyan", "gray"];

  // Render the chart
  const canvas = document.getElementById("myChart");

  if (expenseChart) {
    // Update existing chart
    expenseChart.data.datasets[0].data = data;
    // Redraw the chart
    expenseChart.update();
  } else {
    expenseChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Expenses",
            backgroundColor: barColors,
            data: data,
          },
        ],
      },
    });
  }
}

// Refresh Data
async function refresh() {
  const data = await getExpenses();

  renderTable(data);
  renderSummary(data);
  renderChart(data);
}

// UI Helpers
function showAlert(message, type) {
  const alertContainer = document.getElementById("alertContainer");

  alertContainer.innerHTML = `
    <div 
      class="alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3"
      style="z-index: 1055;"
      role="alert"
    >
      ${message}

      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
      ></button>
    </div>
  `;
}
function showSpinner() {
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("d-none");
}
function hideSpinner() {
  const spinner = document.getElementById("spinner");
  spinner.classList.add("d-none");
}

// Initialize application
refresh();

handleAddExpense();
handleDeleteBtn();
handleEditBtn();
handleSaveEdit();

// Filter event listeners
const categoryFilter = document.getElementById("categoryFilter");
categoryFilter.addEventListener("change", applyFilters);

const monthFilter = document.getElementById("monthFilter");
monthFilter.addEventListener("change", applyFilters);

// Debounce search input
let searchTimer;
function handleSearch() {
  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    applyFilters();
  }, 500);
}

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", handleSearch);

// Bonus - Sort table by title when the column header is clicked
const thTitle = document.getElementById("thTitle");
thTitle.addEventListener("click", () => {
  sortByTitle = !sortByTitle;
  applyFilters();
});

// Bonus - Toggle dark mode
const darkModeBtn = document.getElementById("darkModeBtn");
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
