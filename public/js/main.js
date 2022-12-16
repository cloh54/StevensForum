(function () {
    let reportModal = document.getElementById("report-modal");
    let reportButton = document.getElementById("report-button");
    let span = document.getElementsByClassName("close")[0];

    reportButton.onclick = function() {
        console.log("report button clicked")
        reportModal.style.display = "block";
    };

    span.onclick = function() {
        reportModal.style.display = "none";
    }
})();