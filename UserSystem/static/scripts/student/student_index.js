window.onresize = window.onload = function() {
    const page = "student_index";
    Controller(page);
    CommingSoon()
}

function CommingSoon() {
    let art_trace = document.querySelector('#art_trace');
    let conge = document.querySelector("#demande_conge");
    let plainte = document.querySelector("#demande_plainte");
    let profil = document.querySelector("#profil");

    art_trace.addEventListener("click", function() {
        CommingOpen();
    })
    conge.addEventListener("click", function() {
        CommingOpen();
    })
    plainte.addEventListener("click", function() {
        CommingOpen();
    })
    profil.addEventListener("click", function() {
        CommingOpen();
    })
}

function CommingOpen() {
    let timer;
    $("#commingSoon").css({ display: "block" });
    timer = setTimeout(function() {
        $("#commingSoon").css({ display: "none" });
    }, 1500);
}