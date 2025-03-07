// Put your application javascript here
console.log("hallo log")
document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");
    console.log("hallo log")
    faqItems.forEach((item) => {
        const button = item.querySelector(".faq-question");

        button.addEventListener("click", () => {
            // Tutup semua FAQ sebelum membuka yang baru
            faqItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                    console.log("hallo log")
                }
            });

            // Toggle class 'active' hanya untuk item yang diklik
            item.classList.toggle("active");
        });
    });
});


// const slider = document.querySelector(".slider");

// function updateSliderBackground() {
//     const value = slider.value;
//     slider.style.setProperty("--progress", `${value}%`);
// }

// slider.addEventListener ("input", updateSliderBackground);
// updateSliderBackground();





