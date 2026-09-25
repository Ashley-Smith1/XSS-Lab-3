var registry = [];

fetch("data/handles.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        registry = data;
    });

/**
 * Reads the URL hash and displays a welcome message if a name is present.
 *
 * Called once on page load. If the URL contains a fragment (e.g. #capn_static),
 * the # character is stripped and the remainder is inserted into the welcome
 * element on the page.
 */
function loadWelcome() {
    var operatorName = location.hash.replace("#", "");
    if (operatorName.length > 0) {
        document.getElementById("welcome").innerHTML =
            "Welcome back, " + operatorName + ".";
    }
}

/**
 * Removes script opening and closing tags from a string.
 *
 * The replacement is case-insensitive. Note that this only removes the
 * literal <script> and </script> tags and does not encode or remove
 * other HTML elements or event handler attributes.
 *
 * @param {string} input - The string to process.
 * @returns {string} The input with script tags removed.
 */
function strip(input) {
    return input.replace(/<script>/gi, "").replace(/<\/script>/gi, "");
}

/**
 * Reads the search input, filters the registry, and renders the results.
 *
 * If the input is empty or whitespace only, all result elements are cleared
 * and the function returns early. Otherwise, the registry is filtered to
 * find entries whose handle or speciality contains the search term, and
 * the matching entries are rendered into the results section.
 *
 * Also schedules a call to logSearch() via setTimeout after 200ms.
 */
function runSearch() {
    var term = document.getElementById("search-input").value;

    if (term.trim().length === 0) {
        document.getElementById("results-heading").textContent = "";
        document.getElementById("search-echo").textContent = "";
        document.getElementById("result-count").textContent = "";
        document.getElementById("results-body").textContent = "";
        return;
    }

    var matches = registry.filter(function (entry) {
        return (
            entry.handle.toLowerCase().indexOf(term.toLowerCase()) !== -1 ||
            entry.speciality.toLowerCase().indexOf(term.toLowerCase()) !== -1
        );
    });

    document.getElementById("results-heading").textContent =
        "Results for: " + term;

    document.getElementById("search-echo").textContent =
        "Searching handles and specialities matching " + term;

    document.getElementById("result-count").textContent =
        matches.length + " record(s) found.";

    if (matches.length === 0) {
        document.getElementById("results-body").textContent =
            "No matching handles in registry.";
    } else {
        var resultsHtml = "";
        matches.forEach(function (entry) {
            resultsHtml +=
                '<div class="result-row">' +
                '<span class="handle">' +
                entry.handle +
                "</span>" +
                '<span class="region">' +
                entry.region +
                "</span>" +
                '<span class="joined">' +
                entry.joined +
                "</span>" +
                '<span class="speciality">' +
                entry.speciality +
                "</span>" +
                "</div>";
        });
        document.getElementById("results-body").innerHTML = resultsHtml;
    }

    setTimeout(function () {
    logSearch(term);
}, 200);
}

/**
 * Logs a completed search term to the browser console.
 *
 * Called by the setTimeout in runSearch() after a 200ms delay.
 *
 * @param {string} term - The search term that was used.
 */
function logSearch(term) {
    console.log("[REGISTRY] Search recorded: " + term);
}

window.addEventListener("load", loadWelcome);

document.getElementById("search-btn").addEventListener("click", runSearch);

document
    .getElementById("search-input")
    .addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            runSearch();
        }
    });
