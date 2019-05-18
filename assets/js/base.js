function closeContact() {
    $(".contact-wrapper").removeClass("active");
}


function openContact() {
    $(".contact-wrapper").addClass("active");
}

$('#btn-contact').on('click', function(e) {
    openContact();
    e.preventDefault();
});

$('#btn-close-contact').on('click', function(e) {
    closeContact();
    e.preventDefault();
});

$('.background-fill').on('click', function(e) {
    closeContact();
    e.preventDefault();
});
