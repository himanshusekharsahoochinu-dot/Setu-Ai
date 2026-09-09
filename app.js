/* =====================================================
   SETU AI - Smart Industrial Approval Platform
   Main JavaScript
===================================================== */


/* ================= DEMO CREDENTIALS ================= */

const USER_EMAIL = "user@setu.ai";
const USER_PASSWORD = "user123";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "SETU@2026";


/* ================= APPLICATION STATE ================= */

let currentUser =
    JSON.parse(
        localStorage.getItem("setuCurrentUser")
    ) || null;

let applications =
    JSON.parse(
        localStorage.getItem("setuApplications")
    ) || [];

let currentApplication =
    JSON.parse(
        localStorage.getItem("setuCurrentApplication")
    ) || null;

let toastTimer;


/* ================= DEMO DATA ================= */

if (!localStorage.getItem("setuApplications")) {

    applications = [
        {
            id: "SETU-1001",

            applicant: "Demo Applicant",

            company: "Demo Industries",

            email: "demo@setu.ai",

            mobile: "9876543210",

            business: "Manufacturing",

            approval: "Industrial License",

            state: "Odisha",

            district: "Balasore",

            investment: "2500000",

            employees: "50",

            address: "Industrial Area, Odisha",

            activity:
                "Manufacturing and industrial production.",

            status: "Under Review",

            progress: 65,

            date: new Date().toLocaleString("en-IN"),

            userEmail: "demo@setu.ai"
        }
    ];

    localStorage.setItem(
        "setuApplications",
        JSON.stringify(applications)
    );
}


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadTheme();

        setupNavigation();

        if (currentUser) {

            openPortal();

        } else {

            document
                .getElementById("authScreen")
                .classList.remove("hidden");

            document
                .getElementById("mainApp")
                .classList.add("hidden");
        }

        renderApplications();

        updateStats();

        updateReceipt();

    }
);


/* =====================================================
   AUTHENTICATION
===================================================== */

function switchLogin(type) {

    const userForm =
        document.getElementById("userLoginForm");

    const adminForm =
        document.getElementById("adminLoginForm");

    const userTab =
        document.getElementById("userTab");

    const adminTab =
        document.getElementById("adminTab");


    if (type === "user") {

        userForm.classList.remove("hidden");

        adminForm.classList.add("hidden");

        userTab.classList.add("active");

        adminTab.classList.remove("active");

    } else {

        userForm.classList.add("hidden");

        adminForm.classList.remove("hidden");

        userTab.classList.remove("active");

        adminTab.classList.add("active");
    }
}


/* ================= USER LOGIN ================= */

document.addEventListener(
    "submit",
    function (event) {

        if (event.target.id === "userLoginForm") {

            event.preventDefault();

            userLogin();
        }


        if (event.target.id === "adminLoginForm") {

            event.preventDefault();

            adminLogin();
        }
    }
);


function userLogin() {

    const email =
        document
            .getElementById("userEmail")
            .value
            .trim();

    const password =
        document
            .getElementById("userPassword")
            .value;


    if (
        email === USER_EMAIL &&
        password === USER_PASSWORD
    ) {

        currentUser = {
            email: email,

            role: "user",

            name: "SETU User"
        };

        localStorage.setItem(
            "setuCurrentUser",
            JSON.stringify(currentUser)
        );

        openPortal();

        showToast(
            "User login successful",
            "✓"
        );

    } else {

        showToast(
            "Invalid user credentials",
            "!"
        );
    }
}


/* ================= ADMIN LOGIN ================= */

function adminLogin() {

    const username =
        document
            .getElementById("adminUsername")
            .value
            .trim();

    const password =
        document
            .getElementById("adminPassword")
            .value;


    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        currentUser = {

            username: username,

            role: "admin",

            name: "SETU Administrator"
        };

        localStorage.setItem(
            "setuCurrentUser",
            JSON.stringify(currentUser)
        );

        openPortal();

        showPage("adminPage");

        showToast(
            "Admin login successful",
            "✓"
        );

    } else {

        showToast(
            "Invalid admin credentials",
            "!"
        );
    }
}


/* ================= OPEN PORTAL ================= */

function openPortal() {

    document
        .getElementById("authScreen")
        .classList.add("hidden");

    document
        .getElementById("mainApp")
        .classList.remove("hidden");


    updateUserUI();

    configurePortal();

    renderApplications();

    updateStats();

    updateReceipt();
}


/* ================= USER UI ================= */

function updateUserUI() {

    const adminNav =
        document.getElementById("adminNav");

    if (
        currentUser &&
        currentUser.role === "admin"
    ) {

        adminNav.classList.remove("hidden");

    } else {

        adminNav.classList.add("hidden");
    }
}


/* ================= PORTAL CONFIG ================= */

function configurePortal() {

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(
        item => {

            item.classList.remove("active");
        }
    );

    const dashboard =
        document.querySelector(
            '[data-page="homePage"]'
        );

    if (dashboard) {

        dashboard.classList.add("active");
    }

    document
        .querySelectorAll(".page")
        .forEach(
            page =>
                page.classList.remove(
                    "active-page"
                )
        );

    document
        .getElementById("homePage")
        .classList.add("active-page");
}


/* ================= ADMIN LOGOUT ================= */

function adminLogout() {

    currentUser = null;

    localStorage.removeItem(
        "setuCurrentUser"
    );

    document
        .getElementById("mainApp")
        .classList.add("hidden");

    document
        .getElementById("authScreen")
        .classList.remove("hidden");

    switchLogin("admin");

    showToast(
        "Admin logged out",
        "✓"
    );
}


/* ================= NORMAL LOGOUT ================= */

function logout() {

    currentUser = null;

    localStorage.removeItem(
        "setuCurrentUser"
    );

    document
        .getElementById("mainApp")
        .classList.add("hidden");

    document
        .getElementById("authScreen")
        .classList.remove("hidden");

    switchLogin("user");

    showToast(
        "Logged out successfully",
        "✓"
    );
}


/* =====================================================
   NAVIGATION
===================================================== */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item[data-page]"
        );

    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                function () {

                    const page =
                        this.dataset.page;

                    if (
                        page === "adminPage" &&
                        (
                            !currentUser ||
                            currentUser.role !== "admin"
                        )
                    ) {

                        showToast(
                            "Admin access required",
                            "!"
                        );

                        return;
                    }

                    showPage(page);

                }
            );
        }
    );
}


function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(
            page => {

                page.classList.remove(
                    "active-page"
                );
            }
        );


    const page =
        document.getElementById(pageId);

    if (!page) return;

    page.classList.add("active-page");


    document
        .querySelectorAll(
            ".nav-item[data-page]"
        )
        .forEach(
            item => {

                item.classList.toggle(
                    "active",
                    item.dataset.page === pageId
                );
            }
        );


    const sidebar =
        document.getElementById("sidebar");

    if (sidebar) {

        sidebar.classList.remove("open");
    }


    if (pageId === "myAppsPage") {

        renderApplications();
    }

    if (pageId === "adminPage") {

        renderAdminTable();
    }

    if (pageId === "receiptPage") {

        updateReceipt();
    }
}


/* ================= MOBILE SIDEBAR ================= */

function toggleSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    sidebar.classList.toggle("open");
}


/* =====================================================
   THEME
===================================================== */

function toggleTheme() {

    document
        .body
        .classList
        .toggle("dark");

    const dark =
        document
            .body
            .classList
            .contains("dark");

    localStorage.setItem(
        "setuTheme",
        dark ? "dark" : "light"
    );
}


function loadTheme() {

    const theme =
        localStorage.getItem("setuTheme");

    if (theme === "dark") {

        document
            .body
            .classList
            .add("dark");
    }
}


/* =====================================================
   APPLICATION SUBMISSION
===================================================== */

document.addEventListener(
    "submit",
    function (event) {

        if (
            event.target.id !==
            "applicationForm"
        ) {

            return;
        }

        event.preventDefault();


        if (!currentUser) {

            showToast(
                "Please login first",
                "!"
            );

            return;
        }


        const application = {

            id:
                "SETU-" +
                (
                    1001 +
                    applications.length
                ),

            applicant:
                document
                    .getElementById("applicantName")
                    .value
                    .trim(),

            company:
                document
                    .getElementById("companyName")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("applicationEmail")
                    .value
                    .trim(),

            mobile:
                document
                    .getElementById("mobile")
                    .value
                    .trim(),

            business:
                document
                    .getElementById("businessType")
                    .value,

            approval:
                document
                    .getElementById("approvalType")
                    .value,

            state:
                document
                    .getElementById("state")
                    .value
                    .trim(),

            district:
                document
                    .getElementById("district")
                    .value
                    .trim(),

            investment:
                document
                    .getElementById("investment")
                    .value,

            employees:
                document
                    .getElementById("employees")
                    .value,

            address:
                document
                    .getElementById("address")
                    .value
                    .trim(),

            activity:
                document
                    .getElementById("activity")
                    .value
                    .trim(),

            status: "Pending",

            progress: 25,

            date:
                new Date()
                    .toLocaleString("en-IN"),

            userEmail:
                currentUser.email
        };


        applications.push(application);

        currentApplication =
            application;


        localStorage.setItem(
            "setuApplications",
            JSON.stringify(applications)
        );

        localStorage.setItem(
            "setuCurrentApplication",
            JSON.stringify(currentApplication)
        );


        generatePrecheck(application);

        renderApplications();

        updateStats();

        updateReceipt();


        document
            .getElementById("applicationForm")
            .reset();


        showToast(
            "Application submitted successfully",
            "✓"
        );


        setTimeout(
            () => {

                showPage("receiptPage");

            },
            500
        );
    }
);


/* =====================================================
   DOCUMENT PRECHECK
===================================================== */

function generatePrecheck(application) {

    const docs = [
        "Identity Proof",
        "PAN Card",
        "Company Registration",
        "Business Plan"
    ];


    const text =
        (
            application.approval +
            " " +
            application.business +
            " " +
            application.activity
        )
        .toLowerCase();


    if (
        text.includes("pollution") ||
        text.includes("manufacturing") ||
        text.includes("factory")
    ) {

        docs.push(
            "Pollution Consent",
            "Environmental Clearance"
        );
    }


    if (
        text.includes("factory") ||
        text.includes("manufacturing")
    ) {

        docs.push(
            "Factory Safety Plan"
        );
    }


    if (
        text.includes("food")
    ) {

        docs.push(
            "Food Safety License"
        );
    }


    if (
        text.includes("fire")
    ) {

        docs.push(
            "Fire Safety Certificate"
        );
    }


    application.suggestedDocuments =
        [...new Set(docs)];


    localStorage.setItem(
        "setuApplications",
        JSON.stringify(applications)
    );
}


/* =====================================================
   GET USER APPLICATIONS
===================================================== */

function getUserApplications() {

    if (
        currentUser &&
        currentUser.role === "admin"
    ) {

        return applications;
    }


    if (!currentUser) {

        return [];
    }


    return applications.filter(
        app =>
            app.userEmail ===
            currentUser.email
    );
}


/* =====================================================
   RENDER APPLICATIONS
===================================================== */

function renderApplications() {

    const container =
        document.getElementById(
            "applicationsList"
        );

    if (!container) return;


    const userApps =
        getUserApplications();


    if (userApps.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📂
                </div>

                <h3>No applications yet</h3>

                <p>
                    Submit your first industrial
                    approval application.
                </p>

                <br>

                <button
                    class="btn primary"
                    onclick="showPage('applicationPage')">

                    Start Application

                </button>

            </div>

        `;

        return;
    }


    container.innerHTML =
        userApps
            .slice()
            .reverse()
            .map(
                app => `

                <div class="application-card">

                    <div class="application-top">

                        <div>

                            <div class="application-id">
                                ${escapeHTML(app.id)}
                            </div>

                            <h3>
                                ${escapeHTML(app.company)}
                            </h3>

                        </div>

                        <span class="status ${statusClass(app.status)}">
                            ${escapeHTML(app.status)}
                        </span>

                    </div>


                    <div class="application-meta">

                        <div class="meta-item">

                            <span>Applicant</span>

                            <strong>
                                ${escapeHTML(app.applicant)}
                            </strong>

                        </div>


                        <div class="meta-item">

                            <span>Approval</span>

                            <strong>
                                ${escapeHTML(app.approval)}
                            </strong>

                        </div>


                        <div class="meta-item">

                            <span>District</span>

                            <strong>
                                ${escapeHTML(app.district)}
                            </strong>

                        </div>


                        <div class="meta-item">

                            <span>Submitted</span>

                            <strong>
                                ${escapeHTML(app.date)}
                            </strong>

                        </div>

                    </div>


                    <div
                        style="
                            display:flex;
                            gap:10px;
                            margin-top:18px;
                            flex-wrap:wrap;
                        "
                    >

                        <button
                            class="btn secondary"
                            onclick="viewApplication('${app.id}')">

                            View Details

                        </button>


                        <button
                            class="btn primary"
                            onclick="showPage('trackingPage'); document.getElementById('trackId').value='${app.id}'; trackApplication();">

                            Track

                        </button>

                    </div>

                </div>

            `
            )
            .join("");
}


/* =====================================================
   STATUS CLASS
===================================================== */

function statusClass(status) {

    return status
        .toLowerCase()
        .replace(/\s+/g, "-");
}


/* =====================================================
   VIEW APPLICATION
===================================================== */

function viewApplication(id) {

    const app =
        applications.find(
            item => item.id === id
        );


    if (!app) {

        showToast(
            "Application not found",
            "!"
        );

        return;
    }


    const documents =
        app.suggestedDocuments ||
        [];


    document.getElementById(
        "modalContent"
    ).innerHTML = `

        <h2>
            Application ${escapeHTML(app.id)}
        </h2>

        <br>

        <div class="application-meta">

            <div class="meta-item">
                <span>Applicant</span>
                <strong>${escapeHTML(app.applicant)}</strong>
            </div>

            <div class="meta-item">
                <span>Company</span>
                <strong>${escapeHTML(app.company)}</strong>
            </div>

            <div class="meta-item">
                <span>Email</span>
                <strong>${escapeHTML(app.email)}</strong>
            </div>

            <div class="meta-item">
                <span>Mobile</span>
                <strong>${escapeHTML(app.mobile)}</strong>
            </div>

        </div>

        <br>

        <h3>Approval Details</h3>

        <br>

        <p>
            <strong>Business:</strong>
            ${escapeHTML(app.business)}
        </p>

        <p>
            <strong>Approval:</strong>
            ${escapeHTML(app.approval)}
        </p>

        <p>
            <strong>Location:</strong>
            ${escapeHTML(app.district)},
            ${escapeHTML(app.state)}
        </p>

        <br>

        <h3>Suggested Documents</h3>

        <br>

        <ul>

            ${
                documents
                    .map(
                        doc =>
                            `<li>${escapeHTML(doc)}</li>`
                    )
                    .join("")
            }

        </ul>

    `;


    document
        .getElementById("modal")
        .classList.remove("hidden");
}


/* =====================================================
   TRACK APPLICATION
===================================================== */

function trackApplication() {

    const id =
        document
            .getElementById("trackId")
            .value
            .trim()
            .toUpperCase();


    const result =
        document.getElementById(
            "trackingResult"
        );


    if (!id) {

        showToast(
            "Enter application ID",
            "!"
        );

        return;
    }


    const app =
        applications.find(
            item =>
                item.id.toUpperCase() === id
        );


    if (!app) {

        result.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ❌
                </div>

                <h3>
                    Application Not Found
                </h3>

                <p>
                    Please check the application ID
                    and try again.
                </p>

            </div>

        `;

        return;
    }


    result.innerHTML = `

        <div>

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:15px;
                    flex-wrap:wrap;
                    align-items:center;
                "
            >

                <div>

                    <span
                        style="
                            color:var(--muted);
                            font-size:13px;
                        "
                    >
                        Application ID
                    </span>

                    <h2>
                        ${escapeHTML(app.id)}
                    </h2>

                </div>

                <span class="status ${statusClass(app.status)}">
                    ${escapeHTML(app.status)}
                </span>

            </div>


            <div
                style="
                    margin-top:20px;
                    background:#eef6ff;
                    padding:15px;
                    border-radius:12px;
                "
            >

                <strong>
                    ${app.progress}% Complete
                </strong>

                <div
                    style="
                        height:8px;
                        background:#d9e7f4;
                        border-radius:20px;
                        margin-top:10px;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            width:${app.progress}%;
                            height:100%;
                            background:
                                linear-gradient(
                                    90deg,
                                    var(--primary),
                                    var(--teal)
                                );
                            border-radius:20px;
                        "
                    ></div>

                </div>

            </div>


            <div class="timeline">

                <div class="timeline-item done">

                    <div class="timeline-dot">
                        ✓
                    </div>

                    <div class="timeline-content">

                        <h4>
                            Application Submitted
                        </h4>

                        <p>
                            Application successfully received by SETU AI.
                        </p>

                    </div>

                </div>


                <div class="timeline-item ${
                    app.progress >= 40
                        ? "done"
                        : ""
                }">

                    <div class="timeline-dot">
                        ${
                            app.progress >= 40
                                ? "✓"
                                : "2"
                        }
                    </div>

                    <div class="timeline-content">

                        <h4>
                            Document Verification
                        </h4>

                        <p>
                            Documents are being checked.
                        </p>

                    </div>

                </div>


                <div class="timeline-item ${
                    app.progress >= 65
                        ? "done"
                        : ""
                }">

                    <div class="timeline-dot">
                        ${
                            app.progress >= 65
                                ? "✓"
                                : "3"
                        }
                    </div>

                    <div class="timeline-content">

                        <h4>
                            Department Review
                        </h4>

                        <p>
                            Application is under department review.
                        </p>

                    </div>

                </div>


                <div class="timeline-item ${
                    app.progress >= 100 &&
                    app.status === "Approved"
                        ? "done"
                        : ""
                }">

                    <div class="timeline-dot">
                        ${
                            app.progress >= 100 &&
                            app.status === "Approved"
                                ? "✓"
                                : "4"
                        }
                    </div>

                    <div class="timeline-content">

                        <h4>
                            Final Decision
                        </h4>

                        <p>
                            Final approval decision.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    `;
}


/* =====================================================
   RECEIPT
===================================================== */

function updateReceipt() {

    const app =
        currentApplication ||
        getUserApplications()[0];


    if (!app) {

        document.getElementById(
            "receiptId"
        ).textContent = "—";

        document.getElementById(
            "receiptApplicant"
        ).textContent = "—";

        document.getElementById(
            "receiptCompany"
        ).textContent = "—";

        document.getElementById(
            "receiptApproval"
        ).textContent = "—";

        document.getElementById(
            "receiptStatus"
        ).textContent = "—";

        document.getElementById(
            "receiptDate"
        ).textContent = "—";

        return;
    }


    document.getElementById(
        "receiptId"
    ).textContent = app.id;

    document.getElementById(
        "receiptApplicant"
    ).textContent = app.applicant;

    document.getElementById(
        "receiptCompany"
    ).textContent = app.company;

    document.getElementById(
        "receiptApproval"
    ).textContent = app.approval;

    document.getElementById(
        "receiptStatus"
    ).textContent = app.status;

    document.getElementById(
        "receiptDate"
    ).textContent = app.date;
}


/* =====================================================
   DASHBOARD STATS
===================================================== */

function updateStats() {

    const total =
        applications.length;


    const approved =
        applications.filter(
            app =>
                app.status === "Approved"
        ).length;


    const review =
        applications.filter(
            app =>
                app.status === "Under Review"
        ).length;


    const pending =
        applications.filter(
            app =>
                app.status === "Pending"
        ).length;


    const totalApps =
        document.getElementById(
            "totalApps"
        );

    const approvedApps =
        document.getElementById(
            "approvedApps"
        );

    const reviewApps =
        document.getElementById(
            "reviewApps"
        );

    if (totalApps)
        totalApps.textContent = total;

    if (approvedApps)
        approvedApps.textContent = approved;

    if (reviewApps)
        reviewApps.textContent = review;


    const adminTotal =
        document.getElementById(
            "adminTotal"
        );

    const adminPending =
        document.getElementById(
            "adminPending"
        );

    const adminApproved =
        document.getElementById(
            "adminApproved"
        );

    const adminRejected =
        document.getElementById(
            "adminRejected"
        );


    if (adminTotal)
        adminTotal.textContent = total;

    if (adminPending)
        adminPending.textContent = pending;

    if (adminApproved)
        adminApproved.textContent = approved;

    if (adminRejected)
        adminRejected.textContent =
            applications.filter(
                app =>
                    app.status === "Rejected"
            ).length;


    renderAdminTable();
}


/* =====================================================
   ADMIN TABLE
===================================================== */

function renderAdminTable() {

    const body =
        document.getElementById(
            "adminTableBody"
        );


    if (!body) return;


    if (applications.length === 0) {

        body.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                        color:var(--muted);
                    "
                >
                    No applications available.

                </td>

            </tr>

        `;

        return;
    }


    body.innerHTML =
        applications
            .slice()
            .reverse()
            .map(
                app => `

                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(app.id)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(app.applicant)}
                    </td>

                    <td>
                        ${escapeHTML(app.company)}
                    </td>

                    <td>
                        ${escapeHTML(app.approval)}
                    </td>

                    <td>

                        <span class="status ${statusClass(app.status)}">

                            ${escapeHTML(app.status)}

                        </span>

                    </td>

                    <td>

                        <select
                            class="admin-select"
                            onchange="
                                updateApplicationStatus(
                                    '${app.id}',
                                    this.value
                                )
                            "
                        >

                            <option
                                ${
                                    app.status === "Pending"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Pending
                            </option>

                            <option
                                ${
                                    app.status === "Documents Required"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Documents Required
                            </option>

                            <option
                                ${
                                    app.status === "Under Review"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Under Review
                            </option>

                            <option
                                ${
                                    app.status === "Approved"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Approved
                            </option>

                            <option
                                ${
                                    app.status === "Rejected"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Rejected
                            </option>

                        </select>

                    </td>

                </tr>

            `
            )
            .join("");
}


/* =====================================================
   UPDATE STATUS
===================================================== */

function updateApplicationStatus(
    id,
    newStatus
) {

    const app =
        applications.find(
            item =>
                item.id === id
        );


    if (!app) return;


    app.status = newStatus;


    const progressMap = {

        "Pending": 25,

        "Documents Required": 40,

        "Under Review": 65,

        "Approved": 100,

        "Rejected": 100
    };


    app.progress =
        progressMap[newStatus] || 25;


    if (
        currentApplication &&
        currentApplication.id === id
    ) {

        currentApplication = app;

        localStorage.setItem(
            "setuCurrentApplication",
            JSON.stringify(
                currentApplication
            )
        );
    }


    localStorage.setItem(
        "setuApplications",
        JSON.stringify(
            applications
        )
    );


    updateStats();

    renderApplications();

    updateReceipt();


    showToast(
        `${id} status updated to ${newStatus}`,
        "✓"
    );
}


/* =====================================================
   AI ASSISTANT
===================================================== */

function sendMessage() {

    const input =
        document.getElementById(
            "chatInput"
        );


    const message =
        input.value.trim();


    if (!message) return;


    addChatMessage(
        message,
        "user"
    );


    input.value = "";


    setTimeout(
        () => {

            const response =
                getAIResponse(message);

            addChatMessage(
                response,
                "ai"
            );

        },
        500
    );
}


/* ================= QUICK QUESTIONS ================= */

function quickAsk(question) {

    const input =
        document.getElementById(
            "chatInput"
        );

    input.value = question;

    sendMessage();
}


/* ================= ADD CHAT MESSAGE ================= */

function addChatMessage(
    message,
    type
) {

    const container =
        document.getElementById(
            "chatMessages"
        );


    const wrapper =
        document.createElement("div");


    wrapper.className =
        type === "user"
            ? "message user-message"
            : "message ai-message";


    wrapper.innerHTML = `

        <div class="message-avatar">

            ${
                type === "user"
                    ? "👤"
                    : "🤖"
            }

        </div>

        <div class="message-content">

            <strong>
                ${
                    type === "user"
                        ? "You"
                        : "SETU AI"
                }
            </strong>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;


    container.appendChild(wrapper);


    container.scrollTop =
        container.scrollHeight;
}


/* ================= AI RESPONSE ================= */

function getAIResponse(message) {

    const text =
        message.toLowerCase();


    if (
        text.includes("document") ||
        text.includes("documents")
    ) {

        return `
            Common documents include Identity Proof,
            PAN Card, Company Registration, Business Plan,
            and approval-specific documents such as
            Pollution Consent, Fire Safety Certificate
            or Food Safety License.
        `;
    }


    if (
        text.includes("time") ||
        text.includes("how long")
    ) {

        return `
            Approval time depends on the approval type,
            document completeness and department review.
            SETU AI helps reduce delays by identifying
            missing information early.
        `;
    }


    if (
        text.includes("track") ||
        text.includes("status")
    ) {

        return `
            You can track your application using your
            SETU Application ID from the Track Application
            section.
        `;
    }


    if (
        text.includes("pollution") ||
        text.includes("environment")
    ) {

        return `
            Pollution clearance confirms that an industrial
            activity meets applicable environmental requirements.
            The exact requirements depend on the type and scale
            of the project.
        `;
    }


    if (
        text.includes("fire") ||
        text.includes("safety")
    ) {

        return `
            Fire and safety approval may require documents
            such as a Fire Safety Certificate, emergency plan
            and safety layout depending on the project.
        `;
    }


    if (
        text.includes("apply") ||
        text.includes("application")
    ) {

        return `
            To apply, open New Application, enter your
            applicant and business information, provide the
            project address and submit the form.
        `;
    }


    if (
        text.includes("government") ||
        text.includes("support") ||
        text.includes("scheme")
    ) {

        return `
            SETU AI can help users understand government
            support categories, eligibility concepts and
            documents. Always verify the final scheme
            requirements with the concerned authority.
        `;
    }


    return `
        I can help with industrial approvals,
        application tracking, documents, compliance,
        pollution clearance, fire safety and government
        support. Please ask me a specific question.
    `;
}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    message,
    icon = "✓"
) {

    const toast =
        document.getElementById(
            "toast"
        );

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );

    const toastIcon =
        document.getElementById(
            "toastIcon"
        );


    toastMessage.textContent =
        message;

    toastIcon.textContent =
        icon;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
}


/* =====================================================
   MODAL
===================================================== */

function closeModal() {

    document
        .getElementById("modal")
        .classList
        .add("hidden");
}


document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.id ===
            "modal"
        ) {

            closeModal();
        }
    }
);


document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeModal();
        }
    }
);


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   ENTER KEY FOR AI CHAT
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.target.id ===
            "chatInput" &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            sendMessage();
        }
    }
);