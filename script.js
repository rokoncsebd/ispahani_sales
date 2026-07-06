// =======================================
// ISPAHANI Sales Management System
// Version 2.0
// =======================================

// Google Apps Script URL
const API_URL = "https://script.google.com/macros/s/AKfycbzadWVa9k2vMETq8817pVK-ZftUMtUng86awVjFI7-Hg7fRWmmJwQV5Bd4KD7NmRdhXzg/exec";

// ==========================
// Staff List
// ==========================

const staffList = [
"Md. Zahidul Islam",
"Md. Uzzal Hossain",
"Md. Mohasin Ali",
"Rashel Rana",
"Ahoshan Habib",
"Rezaul Karim",
"Emdadul Hoque",
"Md. Shah Alam",
"Mahadi Hassan",
"Mosharrof Hossein",
"Abdur Rahman",
"Belal Hossen",
"Rony Sutrodhar",
"Md. Sabbir Hossen",
"Bipul Kumar Sarkar",
"Khorshed Alom",
"Md. Shorif Uddin",
"Md. Sagor Rahman",
"Khorshed Alom-2",
"Md. Sumon Sheikh",
"Md. Manik Uddin",
"Md. Rofiqul Islam",
"Md. Samiur Rahman",
"Md. Shakib Hasan",
"Mohammad Yasin Ali",
"Habibul Bashar"
];

// ==========================
// Product List
// ==========================

const products = [
"Tea-Kg",
"Food-Tk",
"Rice-Kg",
"Biscuits-Ctn",
];

// ==========================
// Page Load
// ==========================

window.onload = function () {

    document.getElementById("today").textContent =
        new Date().toLocaleDateString("en-GB");

    loadStaff();

    loadProducts();

    document.getElementById("submitBtn")
        .addEventListener("click", submitSales);

    document.getElementById("loginBtn")
        .addEventListener("click", adminLogin);

};

// ==========================
// Load Staff
// ==========================

function loadStaff() {

    const staffSelect = document.getElementById("staffSelect");

    staffList.forEach(name => {

        const option = document.createElement("option");

        option.value = name;
        option.textContent = name;

        staffSelect.appendChild(option);

    });

}

// ==========================
// Load Products
// ==========================

function loadProducts() {

    const productList = document.getElementById("productList");

    products.forEach((product, index) => {

        productList.innerHTML += `

        <div class="product">

            <label>${product}</label>

            <div class="qtyBox">

                <button class="minusBtn"
                onclick="changeQty(${index},-1)">-</button>

                <input
                    type="number"
                    id="qty${index}"
                    value="0"
                    min="0">

                <button class="plusBtn"
                onclick="changeQty(${index},1)">+</button>

            </div>

        </div>

        `;

    });

}
// ==========================
// Quantity Change
// ==========================

function changeQty(index, value) {

    let input = document.getElementById("qty" + index);

    let qty = parseInt(input.value) || 0;

    qty += value;

    if (qty < 0) qty = 0;

    input.value = qty;

}

// ==========================
// Navigation
// ==========================

function showSalesPage() {

    document.getElementById("homePage").style.display = "none";
    document.getElementById("salesPage").style.display = "block";
    document.getElementById("adminPage").style.display = "none";
    document.getElementById("dashboardPage").style.display = "none";

}

function showAdminPage() {

    document.getElementById("homePage").style.display = "none";
    document.getElementById("salesPage").style.display = "none";
    document.getElementById("adminPage").style.display = "block";
    document.getElementById("dashboardPage").style.display = "none";

}

function goHome() {

    document.getElementById("homePage").style.display = "block";
    document.getElementById("salesPage").style.display = "none";
    document.getElementById("adminPage").style.display = "none";
    document.getElementById("dashboardPage").style.display = "none";

}

// ==========================
// Submit Sales
// ==========================

async function submitSales() {

    const staffSelect = document.getElementById("staffSelect");

    if (staffSelect.selectedIndex === 0) {

        alert("Please Select Sales Officer");
        return;

    }

    let hasSales = false;

    const row = [];

    // Date (Apps Script পরে বসাবে)
    row.push("");

    // Staff
    row.push(staffSelect.value);

    // Products
    for (let i = 0; i < products.length; i++) {

        const qty = parseInt(document.getElementById("qty" + i).value) || 0;

        row.push(qty);

        if (qty > 0) {

            hasSales = true;

        }

    }

    if (!hasSales) {

        alert("Please Enter Sales Quantity");
        return;

    }

    const btn = document.getElementById("submitBtn");

    btn.disabled = true;
    btn.innerText = "Submitting...";

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            body: JSON.stringify({
                row: row
            })

        });

        const result = await response.json();

        if (result.success) {

            showSuccess();

            staffSelect.selectedIndex = 0;

            for (let i = 0; i < products.length; i++) {

                document.getElementById("qty" + i).value = 0;

            }

        } else {

            alert(result.error);

        }

    } catch (err) {

        alert("Network Error\n\n" + err);

    }

    btn.disabled = false;
    btn.innerText = "Submit Sales";

}
// ==========================
// Admin Login
// ==========================

function adminLogin() {

    const pin = document.getElementById("adminPin").value.trim();

    if (pin === "dm123") {

        openDashboard();
        loadSalesTable();

    } else {

        alert("❌ Wrong PIN");

    }

}

// ==========================
// Dashboard
// ==========================




// ==========================
// Success Popup
// ==========================

function showSuccess() {

    document.getElementById("successPopup").style.display = "flex";

}

function closePopup() {

    document.getElementById("successPopup").style.display = "none";

}
// ==========================
// Today's Report
// ==========================

document.getElementById("todayReportBtn").addEventListener("click", loadTodayReport);

async function loadTodayReport() {

    try {

        const response = await fetch(API_URL + "?action=report");
        const data = await response.json();

        document.getElementById("reportArea").style.display = "block";

        const tbody = document.getElementById("reportBody");
        tbody.innerHTML = "";

        // প্রথম Row যদি Header হয় তাহলে ১ থেকে শুরু করবে।
        // তোমার Sheet-এ Header নেই, তাই ০ থেকে শুরু।
        for (let i = 0; i < data.length; i++) {

            const row = data[i];

            tbody.innerHTML += `
                <tr>
                    <td>${row[1]}</td>
                    <td>${row[2]}</td>
                    <td>${row[3]}</td>
                    <td>${row[4]}</td>
                    <td>${row[5]}</td>
                </tr>
            `;

        }

    } catch (err) {

    console.error(err);
    alert(err);

}

}
// ==========================
// Dashboard
// ==========================

function openDashboard() {

    document.getElementById("homePage").style.display = "none";
    document.getElementById("salesPage").style.display = "none";
    document.getElementById("adminPage").style.display = "none";
    document.getElementById("dashboardPage").style.display = "block";

    document.getElementById("reportDate").innerText =
        new Date().toLocaleDateString("en-GB");

    loadSalesTable();

}

async function loadDashboard() {

    try {

        const response = await fetch(API_URL + "?action=dashboard");

        const data = await response.json();

        document.getElementById("totalStaff").innerText = data.totalStaff;
        document.getElementById("submittedCount").innerText = data.submitted;
        document.getElementById("pendingCount").innerText = data.pending;
        document.getElementById("totalSales").innerText = data.totalSales;

    } catch (err) {

        console.log(err);

        alert("Dashboard Load Failed");

    }

}
// ==========================
// Today's Report
// ==========================

document.getElementById("todayReportBtn").addEventListener("click", loadTodayReport);

async function loadTodayReport() {

    try {

        const response = await fetch(API_URL + "?action=report");

        const data = await response.json();

        const reportArea = document.getElementById("reportArea");
        const tbody = document.getElementById("reportBody");

        reportArea.style.display = "block";
        tbody.innerHTML = "";

        if (data.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        No Sales Submitted Today
                    </td>
                </tr>
            `;

            return;
        }

        data.forEach(row => {

            tbody.innerHTML += `
                <tr>
                    <td>${row[1]}</td>
                    <td>${row[2]}</td>
                    <td>${row[3]}</td>
                    <td>${row[4]}</td>
                    <td>${row[5]}</td>
                </tr>
            `;

        });

    } catch (err) {

        console.error(err);
        alert("Today's Report Load Failed");

    }

}
async function loadSalesTable() {

    try {

        const response = await fetch(API_URL + "?action=sales");

        const data = await response.json();

        console.log(data);

    } catch (err) {

        alert(err);

    }

}
// ==========================
// Load Sales Table
// ==========================

async function loadSalesTable() {

    try {

        const response = await fetch(API_URL + "?action=sales");

        const data = await response.json();

        const tbody = document.getElementById("reportBody");

        tbody.innerHTML = "";
        let staff = 0;
let tea = 0;
let food = 0;
let rice = 0;
let bisc = 0;

        // Header বাদ দিয়ে শুরু
        for (let i = 1; i < data.length; i++) {

            const row = data[i];
            staff++;
tea += Number(row[2]) || 0;
food += Number(row[3]) || 0;
rice += Number(row[4]) || 0;
bisc += Number(row[5]) || 0;


            tbody.innerHTML += `
<tr>
    <td>${row[1]}</td>
    <td>${row[2]}</td>
    <td>${row[3]}</td>
    <td>${row[4]}</td>
    <td>${row[5]}</td>
</tr>
`;

        }
        document.getElementById("sumStaff").innerText = staff;
document.getElementById("sumTea").innerText = tea;
document.getElementById("sumFood").innerText = food;
document.getElementById("sumRice").innerText = rice;
document.getElementById("sumBisc").innerText = bisc;

    } catch (err) {

        console.error(err);

        alert("Table Load Failed");

    }

}