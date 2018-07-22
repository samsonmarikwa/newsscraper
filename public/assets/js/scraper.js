$(function() {

    $("#scrape-link").on("click", (e) => {
        e.preventDefault();
        scrapeNews();
    });

    $("#scrape-new").on("click", (e) => {
        e.preventDefault();
        scrapeNews();
    });


    $("#saved-articles").on("click", () => {

        alert("Saved Articles");
        $.ajax({
            url: "/api/retrieve-saved",
            method: "GET"
        }).then((res) => {
            if (res.success) {
                swal(res.swalTitle,
                    res.swalMsg,
                    res.swalIcon).then(() => {
                    location = "/api/retrieve-saved";
                });
            };
        });
    });


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



    $("#clear-articles").on("click", (e) => {
        e.preventDefault();
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


    $(".save-article").on("click", (e) => {

        console.log($(e.target).attr("id"));
        console.log($(e.target).attr("title"));
        console.log($(e.target).attr("summary"));
        console.log($(e.target).attr("link"));

        $.ajax({
            url: "/api/savearticle",
            method: "POST",
            data: {
                id: $(e.target).attr("id"),
                title: $(e.target).attr("title"),
                summary: $(e.target).attr("summary"),
                link: $(e.target).attr("link")
            }
        }).then((res) => {

            swal(res.swalTitle,
                res.swalMsg,
                res.swalIcon).then(() => {
                location = "/";
            });
        });
    });
});