// Wait a short moment to make sure the page loads
setTimeout(function () {

    // Get the download button inside the image editor
    var downloadButton = document.querySelector(".tui-image-editor-main-container .tui-image-editor-download-btn");

    // If the button does not exist, stop here
    if (downloadButton === null) {
        console.log("Download button not found. Skipping rate popup.");
        return;
    }

    // Add click listener to the button
    downloadButton.addEventListener("click", function (event) {
        // Stop default browser behavior
        event.preventDefault();

        // Get saved data from Chrome storage
        chrome.storage.local.get(["openTimes", "rateClicked"], function (storageData) {
            var openTimes = storageData.openTimes;
            var rateClicked = storageData.rateClicked;

            // Increment openTimes counter
            if (openTimes) {
                openTimes = openTimes + 1;
            } else {
                openTimes = 1;
            }

            // Save updated counter back to storage
            chrome.storage.local.set({ openTimes: openTimes });

            // Only show rate dialog if user has not clicked before AND every 4th open
            if (!rateClicked && openTimes % 4 === 0 && !document.getElementById("xxdialog-rate")) {

                // Add the rate dialog HTML to the page
                document.body.insertAdjacentHTML("beforeend", getRateDialogHTML());

                // Add listener to "Yes" button
                var yesButton = document.getElementById("xxdialog-yes");
                yesButton.addEventListener("click", function () {
                    chrome.storage.local.set({ rateClicked: true });
                    document.getElementById("xxdialog-rate").remove();
                    window.open("https://chrome.google.com/webstore/detail/" + chrome.runtime.id + "/reviews", "_blank").focus();
                });

                // Add listener to "No" button
                var noButton = document.getElementById("xxdialog-no");
                noButton.addEventListener("click", function () {
                    document.getElementById("xxdialog-rate").remove();
                });
            }
        });
    });

}, 300);

// Function to return hard-coded rate dialog HTML
function getRateDialogHTML() {
    return `
<div id="xxdialog-rate" class="xxflex-container">
  <div class="xxdialog">
    <h2 class="xxdialog-header" i18n="rateDialogTitle">Rate Our Extension</h2>
    <div class="xxdialog-content">
      <p i18n="rateDialogDesc">If you enjoy using this tool, please take a moment to rate it.</p>
    </div>
    <div class="xxdialog-button">
      <a href="#" id="xxdialog-yes" class="xxcancel" i18n="rateDialogYes">Yes, I will rate</a>
      <a href="#" id="xxdialog-no" i18n="rateDialogNo">No, thanks</a>
    </div>
