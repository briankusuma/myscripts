// Put your application javascript here
console.log("hallo log")

const slider = document.querySelector(".slider");

function updateSliderBackground() {
    const value = slider.value;
    slider.style.setProperty("--progress", `${value}%`);
}

slider.addEventListener ("input", updateSliderBackground);
updateSliderBackground(); // Inisialisasi pertama kali
