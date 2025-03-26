// Put your application javascript here
console.log("hallo from aplication js")
// document.addEventListener("DOMContentLoaded", () => {
//     const faqItems = document.querySelectorAll(".faq-item");
//     console.log("hallo log")
//     faqItems.forEach((item) => {
//         const button = item.querySelector(".faq-question");
//         button.addEventListener("click", () => {
//             faqItems.forEach((otherItem) => {
//                 if (otherItem !== item) {
//                     otherItem.classList.remove("active");
//                     console.log("hallo log")
//                 }
//             });
//             item.classList.toggle("active");
//         });
//     });
// });


// $(document).ready(function () {
//     $("#review-slider").slick({
//         arrows: false,
//         dots: true,
//         centerMode: true,
//         variableWidth: true,
//         autoplay: true,
//         autoplaySpeed: 2000,
//         centerPadding: "40px",
//     });

//     $("#review-slider").on("afterChange", function (event, slick, currentSlide) {
//         var $activeDot = $(".slick-dots li").eq(currentSlide);
//         $(".slick-dots li").removeClass("active-progress");
//         $activeDot.addClass("active-progress");
//         $activeDot.css(
//             "--progress-duration",
//             slick.options.autoplaySpeed / 1000 + "s"
//         );
//     });
//     $("#review-slider").slick("slickGoTo", 0, true);

// });

// document.addEventListener("DOMContentLoaded", () => {
//     const buttons = document.querySelectorAll(".tab-btn");
//     const contents = document.querySelectorAll(".tab-content");

//     buttons.forEach(button => {
//         button.addEventListener("click", () => {

//             buttons.forEach(btn => btn.classList.remove("show"));
//             contents.forEach(content => content.classList.remove("show"));

//             button.classList.add("active");
//             document.getElementById(button.dataset.tab).classList.add("show");
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    function openTab(tabName) {
        // Hapus class 'active' dari semua tombol dan konten
        buttons.forEach(btn => btn.classList.remove("active"));
        contents.forEach(content => content.classList.remove("active"));

        // Cari tombol dan konten yang sesuai dengan 'tabName'
        const activeButton = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(tabName);

        if (activeButton && activeContent) {
            activeButton.classList.add("active");
            activeContent.classList.add("active");
        }
    }

    // Cek URL untuk parameter 'tab'
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromURL = urlParams.get("tab");

    // Jika ada parameter 'tab' di URL, buka tab sesuai parameter
    if (tabFromURL) {
        openTab(tabFromURL);
    } else {
        // Jika tidak ada parameter 'tab' di URL, aktifkan tab pertama
        if (buttons.length > 0) {
            const defaultTab = buttons[0].dataset.tab;  // Ambil tab pertama
            openTab(defaultTab);  // Aktifkan tab pertama dan kontennya
        }
    }

    // Tambahkan event listener untuk setiap tombol tab
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const tabName = button.dataset.tab;
            openTab(tabName);

            // Update URL tanpa reload halaman
            const newUrl = new URL(window.location);
            newUrl.searchParams.set("tab", tabName);
            window.history.pushState({}, "", newUrl);
        });
    });

    // Menangani navigasi browser (back/forward)
    window.addEventListener("popstate", () => {
        const tabFromURL = new URLSearchParams(window.location.search).get("tab");
        if (tabFromURL) {
            openTab(tabFromURL);
        } else {
            // Jika tidak ada parameter 'tab', aktifkan tab pertama
            openTab(buttons[0].dataset.tab);
        }
    });
});

// filter collection

document.addEventListener("DOMContentLoaded", function() {
const titles = document.querySelectorAll(".collection-title");
const products = document.querySelectorAll(".begin_info-items, .tab-content-title");

console.log("hallo from themes");
// Set default collection (Anti-Aging)
let defaultCollection = document.querySelector(".collection-title.active");
let selectedCollection = defaultCollection ? defaultCollection.getAttribute("data-collection") : null;

function filterProducts(collection) {
    products.forEach(product => {
    product.style.display = product.getAttribute("data-collection") === collection ? "flex" : "none";
    });

    // Update active class
    titles.forEach(title => title.classList.remove("active"));
    document.querySelector(`.collection-title[data-collection='${collection}']`).classList.add("active");
}

// Tampilkan default collection
if (selectedCollection) {
    filterProducts(selectedCollection);
}

// Event listener untuk klik koleksi
titles.forEach(title => {
    title.addEventListener("click", function() {
    let selectedCollection = this.getAttribute("data-collection");
    filterProducts(selectedCollection);
    });
});
});

// document.addEventListener("DOMContentLoaded", () => {
// // Menangani klik pada link filter
// const filterLinks = document.querySelectorAll('.collection-filter-link');

// filterLinks.forEach(link => {
//     link.addEventListener('click', (event) => {
//         event.preventDefault();
        
//         const collectionName = link.getAttribute('data-collection');
        
//         // Update URL untuk menambahkan query parameter collection
//         const url = new URL(window.location.href);
//         url.searchParams.set('collection', collectionName); // Set query parameter
//         window.location.href = url.toString(); // Arahkan ke URL baru
//     });
// });

// // Menampilkan produk berdasarkan koleksi yang dipilih
// const urlParams = new URLSearchParams(window.location.search);
// const collectionFilter = urlParams.get('collection');

// if (collectionFilter) {
//     const products = document.querySelectorAll('.product-item'); // pastikan produk diberi kelas .product-item
    
//     products.forEach(product => {
//         const productCollection = product.getAttribute('data-collection');
//         if (productCollection !== collectionFilter) {
//             product.style.display = 'none'; // Sembunyikan produk yang tidak cocok
//         }
//     });
// }
// });







