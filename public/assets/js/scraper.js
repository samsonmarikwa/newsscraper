$(function() {

    // event listener for Scrape New Articles button
    $("#scrape-new").on("click", () => {
        scrapeNews();
    });

    // event listener for Try Scraping New Articles link
    $("#scrape-link").on("click", () => {
        scrapeNews();
    });

    // scrape new articles function
    function scrapeNews() {
        $.ajax({
            url: "/api/scrape",
            method: "GET"
        }).then((res) => {
            if (res.success) {
                swal(res.swalTitle,
                    res.swalMsg,
                    res.swalIcon).then(() => {
                    location = "/";
                });
            };
        });
    }

    // clear articles event
    // clears articles in the Artcles collection and redirects to root
    $("#clear-articles").on("click", (event) => {
        event.preventDefault();
        $.ajax({
            url: "/api/cleararticles",
            method: "DELETE"
        }).then((res) => {

            swal(res.swalTitle,
                res.swalMsg,
                res.swalIcon).then(() => {
                location = "/";
            });
        });

    });

    // event listener for Save Article button
    // saves the article in the SavedArticles collection and
    // deletes the article from the articles collection

    $(".save-article").on("click", (event) => {

        var id = $(event.target).attr("id");

        $.ajax({
            url: "/api/savearticle",
            method: "POST",
            data: {
                id: id,
                title: $(event.target).attr("title"),
                summary: $(event.target).attr("summary"),
                link: $(event.target).attr("link")
            }
        }).then((res) => {
            console.log(res);
            if (res.success === true) {
                swal(res.swalTitle,
                    res.swalMsg,
                    res.swalIcon).then(() => {
                    $.ajax({
                        url: "/api/deletearticle",
                        method: "DELETE",
                        data: {
                            id: id
                        }
                    }).then((res) => {

                        swal(res.swalTitle,
                            res.swalMsg,
                            res.swalIcon).then(() => {
                            location = "/";
                        });
                    });
                });
            } else {
                swal(res.swalTitle,
                    res.swalMsg,
                    res.swalIcon).then(() => {
                    location = "/";
                });
            }

        });
    });


    // event listener for Delete From Saved button
    // deletes the article from the SavedArticles collection

    $(".saved-delete").on("click", (event) => {

        var id = $(event.target).attr("id");

        $.ajax({
            url: "/api/deletesaved",
            method: "DELETE",
            data: {
                id: id
            }
        }).then((res) => {
            swal(res.swalTitle,
                res.swalMsg,
                res.swalIcon).then(() => {
                location = "/saved";
            });
        });
    });


    // event listener for Article Notes
    // create article notes
    $(".article-notes").on("click", (event) => {

        var id = $(event.target).attr("id");
        var swalTitle = "Notes For Article: " + id;

        // retrieve existing notes
        $.ajax({
            url: "/notes/" + id,
            method: "GET"
        }).then((result) => {

            if (result[0].notes.length > 0) {
                var swalHTML = "";

                for (var x = 0; x < result[0].notes.length; x++) {
                    console.log(result[0].notes[x].notes);

                    swalHTML += '<p>' + result[0].notes[x].notes + '&nbsp;&nbsp;<a href="/api/deletenotes/' + id + '/' + result[0].notes[x]._id + '" class="btn-danger" id="delete-notes">X</a></p>';

                }
                swal({
                    title: swalTitle,
                    html: swalHTML,
                    input: 'textarea',
                    showCloseButton: true,
                    showCancelButton: true,
                    inputPlaceholder: 'Type your notes here',
                    cancelButtonText: 'Cancel',
                    confirmButtonText: 'Save New Note'
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                            url: "/api/save-notes",
                            method: "POST",
                            data: {
                                articleId: id,
                                notes: result.value
                            }
                        }).then((res) => {
                            swal(res.swalTitle,
                                res.swalMsg,
                                res.swalIcon);
                        });
                    }
                });

            } else {
                // no notes exist, so prompt user to create new notes

                swal({
                    title: swalTitle,
                    input: 'textarea',
                    inputPlaceholder: 'Type your notes here',
                    showCancelButton: true,
                    confirmButtonText: 'Save this note'
                }).then((result) => {

                    if (result.value) {
                        $.ajax({
                            url: "/api/save-notes",
                            method: "POST",
                            data: {
                                articleId: id,
                                notes: result.value
                            }
                        }).then((res) => {
                            swal(res.swalTitle,
                                res.swalMsg,
                                res.swalIcon);
                        });
                    }

                });

            }

        });

    });


    // event listener for Article Notes
    // create article notes
    $("#delete-notes").on("click", (event) => {

        var id = $(event.target).attr("id");
        alert("Delete button clicked")

    });
});