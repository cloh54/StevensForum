(function () {

    let reportModal = document.getElementById("report-modal");
    let reportButton = document.getElementById("report-button");
    let closeReport = document.getElementById("close-report");

    reportButton.onclick = function() {
        reportModal.style.display = "block";
    };

    closeReport.onclick = function() {
        
        reportModal.style.display = "none";
    };

    let editPostModal = document.getElementById("edit-post-modal");
    let editPostButton = document.getElementById("edit-post-button");
    let closeEditPost = document.getElementById("close-edit-post");

    editPostButton.onclick = function() {
        editPostModal.style.display = "block";
    };

    closeEditPost.onclick = function() {
        editPostModal.style.display = "none";
    };

    let deletePostModal = document.getElementById("delete-post-modal");
    let deletePostButton = document.getElementById("delete-post-button");
    let closeDeletePost = document.getElementById("close-delete-post");

    deletePostButton.onclick = function() {
        deletePostModal.style.display = "block";
    };

    closeDeletePost.onclick = function() {
        deletePostModal.style.display = "none";
    };
})();