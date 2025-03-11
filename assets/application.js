// Put your application javascript here
console.log("hallo log")
document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");
    console.log("hallo log")
    faqItems.forEach((item) => {
        const button = item.querySelector(".faq-question");
        button.addEventListener("click", () => {
            faqItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                    console.log("hallo log")
                }
            });
            item.classList.toggle("active");
        });
    });
});


$(document).ready(function () {
    $("#review-slider").slick({
        arrows: false,
        dots: true,
        centerMode: true,
        variableWidth: true,
        autoplay: true,
        autoplaySpeed: 2000,
        centerPadding: "40px",
    });

    $("#review-slider").on("afterChange", function (event, slick, currentSlide) {
        var $activeDot = $(".slick-dots li").eq(currentSlide);
        $(".slick-dots li").removeClass("active-progress");
        $activeDot.addClass("active-progress");
        $activeDot.css(
            "--progress-duration",
            slick.options.autoplaySpeed / 1000 + "s"
        );
    });
    $("#review-slider").slick("slickGoTo", 0, true);

});





