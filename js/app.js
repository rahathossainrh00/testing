// ========================
// GitHub Issues Tracker - Main App Logic
// ========================

// API Endpoints
const API_ALL_ISSUES = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const API_SINGLE_ISSUE = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";
const API_SEARCH_ISSUES = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";

// ========== Auth Guard ==========
if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html";
}

// ========== DOM Elements ==========
const issuesGrid = document.getElementById("issues-grid");
const loadingSpinner = document.getElementById("loading-spinner");
const noResults = document.getElementById("no-results");
const issueCountEl = document.getElementById("issue-count");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const signoutBtn = document.getElementById("signout-btn");

// Tab buttons
const tabAll = document.getElementById("tab-all");
const tabOpen = document.getElementById("tab-open");
const tabClosed = document.getElementById("tab-closed");
const allTabs = [tabAll, tabOpen, tabClosed];

// Modal elements
const issueModal = document.getElementById("issue-modal");
const modalTitle = document.getElementById("modal-title");
const modalMeta = document.getElementById("modal-meta");
const modalDescription = document.getElementById("modal-description");
const modalAssignee = document.getElementById("modal-assignee");
const modalPriority = document.getElementById("modal-priority");
const modalAuthor = document.getElementById("modal-author");
const modalCreated = document.getElementById("modal-created");
const modalLabels = document.getElementById("modal-labels");
const modalCloseBtn = document.getElementById("modal-close-btn");

// ========== State ==========
let allIssues = [];
let currentFilter = "all"; // "all", "open", "closed"

// ========== Utility Functions ==========

// Format date to a readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

// Get priority badge class
function getPriorityClass(priority) {
    switch (priority.toLowerCase()) {
        case "high": return "priority-high";
        case "medium": return "priority-medium";
        case "low": return "priority-low";
        default: return "bg-gray-400 text-white";
    }
}

// Get label badge class
function getLabelClass(label) {
    const normalizedLabel = label.toLowerCase().replace(/\s+/g, "-");
    switch (normalizedLabel) {
        case "bug": return "label-bug";
        case "enhancement": return "label-enhancement";
        case "documentation": return "label-documentation";
        case "help-wanted": return "label-help-wanted";
        case "good-first-issue": return "label-good-first-issue";
        default: return "bg-gray-100 text-gray-600";
    }
}

// Show loading spinner
function showLoading() {
    loadingSpinner.classList.remove("hidden");
    issuesGrid.classList.add("hidden");
    noResults.classList.add("hidden");
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.classList.add("hidden");
}

// Show no results message
function showNoResults() {
    noResults.classList.remove("hidden");
    issuesGrid.classList.add("hidden");
}

// ========== Render Functions ==========

// Create a single issue card HTML
function createIssueCard(issue) {
    const borderClass = issue.status === "open" ? "card-open" : "card-closed";
    const priorityClass = getPriorityClass(issue.priority);

    // Build labels HTML
    const labelsHTML = issue.labels
        .map(label => {
            const labelClass = getLabelClass(label);
            return `<span class="text-xs px-2 py-0.5 rounded-full font-medium ${labelClass}">${label}</span>`;
        })
        .join("");

    const card = document.createElement("div");
    card.className = `issue-card bg-white rounded-lg shadow-sm border border-gray-100 ${borderClass} cursor-pointer overflow-hidden`;
    card.setAttribute("data-issue-id", issue.id);

    card.innerHTML = `
        <div class="p-4">
            <!-- Status badge + Priority -->
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-semibold ${issue.status === "open" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
        }">
                    ${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${priorityClass}">
                    ${issue.priority}
                </span>
            </div>

            <!-- Title -->
            <h3 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 leading-tight">${issue.title}</h3>

            <!-- Description -->
            <p class="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">${issue.description}</p>

            <!-- Labels -->
            <div class="flex flex-wrap gap-1 mb-3">
                ${labelsHTML}
            </div>

            <!-- Footer: Author + Date -->
            <div class="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                <span class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    #${issue.id} by ${issue.author}
                </span>
                <span>${formatDate(issue.createdAt)}</span>
            </div>
        </div>
    `;

    // Click to open modal
    card.addEventListener("click", () => openModal(issue.id));

    return card;
}

// Render issues to the grid
function renderIssues(issues) {
    hideLoading();
    issuesGrid.innerHTML = "";

    if (issues.length === 0) {
        showNoResults();
        issueCountEl.textContent = "0";
        return;
    }

    noResults.classList.add("hidden");
    issuesGrid.classList.remove("hidden");
    issueCountEl.textContent = issues.length;

    issues.forEach(issue => {
        const card = createIssueCard(issue);
        issuesGrid.appendChild(card);
    });
}

// Filter issues by status
function filterIssues(filter) {
    currentFilter = filter;

    if (filter === "all") {
        renderIssues(allIssues);
    } else {
        const filtered = allIssues.filter(issue => issue.status === filter);
        renderIssues(filtered);
    }
}

// ========== Tab Handling ==========

function setActiveTab(activeTab) {
    allTabs.forEach(tab => tab.classList.remove("tab-active"));
    activeTab.classList.add("tab-active");
}

tabAll.addEventListener("click", () => {
    setActiveTab(tabAll);
    filterIssues("all");
});

tabOpen.addEventListener("click", () => {
    setActiveTab(tabOpen);
    filterIssues("open");
});

tabClosed.addEventListener("click", () => {
    setActiveTab(tabClosed);
    filterIssues("closed");
});

// ========== Search Functionality ==========

async function searchIssues(query) {
    if (!query.trim()) {
        // If search is empty, show all with current filter
        filterIssues(currentFilter);
        return;
    }

    showLoading();

    try {
        const response = await fetch(API_SEARCH_ISSUES + encodeURIComponent(query));
        const result = await response.json();

        if (result.status === "success" && result.data) {
            let filteredData = result.data;

            // Apply current tab filter on search results
            if (currentFilter !== "all") {
                filteredData = filteredData.filter(issue => issue.status === currentFilter);
            }

            renderIssues(filteredData);
        } else {
            renderIssues([]);
        }
    } catch (error) {
        console.error("Search error:", error);
        renderIssues([]);
    }
}

searchBtn.addEventListener("click", () => {
    searchIssues(searchInput.value);
});

searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        searchIssues(searchInput.value);
    }
});

// ========== Modal Functions ==========

async function openModal(issueId) {
    try {
        const response = await fetch(API_SINGLE_ISSUE + issueId);
        const result = await response.json();

        if (result.status === "success" && result.data) {
            const issue = result.data;

            // Populate modal
            modalTitle.textContent = issue.title;

            // Meta: status + author + date
            const statusBadge = issue.status === "open"
                ? `<span class="text-xs px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">Open</span>`
                : `<span class="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-700">Closed</span>`;

            modalMeta.innerHTML = `
                ${statusBadge}
                <span class="text-gray-400">Opened by <span class="font-medium text-gray-600">${issue.author}</span></span>
                <span class="text-gray-400">• ${formatDate(issue.createdAt)}</span>
            `;

            modalDescription.textContent = issue.description;
            modalAssignee.textContent = issue.assignee || "Unassigned";
            modalAuthor.textContent = issue.author;
            modalCreated.textContent = formatDate(issue.createdAt);

            // Priority with color
            const priorityClass = getPriorityClass(issue.priority);
            modalPriority.innerHTML = `<span class="text-xs px-2 py-0.5 rounded-full font-semibold ${priorityClass}">${issue.priority}</span>`;

            // Labels
            modalLabels.innerHTML = issue.labels
                .map(label => {
                    const labelClass = getLabelClass(label);
                    return `<span class="text-xs px-3 py-1 rounded-full font-medium ${labelClass}">${label}</span>`;
                })
                .join("");

            // Show modal
            issueModal.classList.remove("hidden");
            issueModal.classList.add("flex");
        }
    } catch (error) {
        console.error("Error fetching issue details:", error);
    }
}

function closeModal() {
    issueModal.classList.add("hidden");
    issueModal.classList.remove("flex");
}

modalCloseBtn.addEventListener("click", closeModal);

// Close modal when clicking backdrop
issueModal.addEventListener("click", (event) => {
    if (event.target === issueModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

// ========== Sign Out ==========
signoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    window.location.href = "index.html";
});

// ========== Fetch All Issues ==========

async function loadAllIssues() {
    showLoading();

    try {
        const response = await fetch(API_ALL_ISSUES);
        const result = await response.json();

        if (result.status === "success" && result.data) {
            allIssues = result.data;
            renderIssues(allIssues);
        } else {
            renderIssues([]);
        }
    } catch (error) {
        console.error("Error loading issues:", error);
        hideLoading();
        showNoResults();
    }
}

// ========== Initialize ==========
loadAllIssues();
