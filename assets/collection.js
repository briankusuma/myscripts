document.addEventListener("DOMContentLoaded", function () {
  const productImages = document.querySelectorAll(".collection-product-image");

  if (window.matchMedia("(min-width: 640px)").matches) {
    // Run your JavaScript here
    productImages.forEach((img) => {
      const hoverSrc = img.getAttribute("data-hover");
      const featuredSrc = img.getAttribute("data-featured");
  
  
      img.parentElement.addEventListener("mouseover", () => {
        if (hoverSrc) {
          img.src = hoverSrc;
        }
      });
  
      img.parentElement.addEventListener("mouseout", () => {
        img.src = featuredSrc;
      });
    });
  }
  

  // Show / Hide Filter Modal
  const filterShow = document.getElementById('filter-show');
  const filterPopup = document.querySelector('.collection-popup');
  const filterHide = document.getElementById('filter-hide');

  filterShow.addEventListener('click', () => {
    filterPopup.classList.add('popup-active');
  })
  filterHide.addEventListener('click', () => {
    filterPopup.classList.remove('popup-active');
  })
  filterPopup.addEventListener('click', () => {
    filterPopup.classList.remove('popup-active');
  })
  document.querySelector('.collection-popup-filter').addEventListener('click', (e) => {
    e.stopPropagation();
  })


  // Show More Filters
  const sections = document.querySelectorAll('.filter-variant-list');
    
    sections.forEach(section => {
      const showMoreBtn = section.querySelector('.show-more-btn');
      const hiddenItems = section.querySelectorAll('.filter-variant-list-item.hidden');
      
      if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function () {
          hiddenItems.forEach(item => {
            item.classList.remove('hidden');
          });
          showMoreBtn.style.display = 'none'; // Hide the button after all items are shown
        });
      }
    });
  
});

document.addEventListener('DOMContentLoaded', () => {
  const dropdown = document.querySelector('.dropdown');
  const trigger = dropdown.querySelector('.dropdown-trigger');
  const options = dropdown.querySelectorAll('.dropdown-option');
  const hiddenInput = dropdown.querySelector('#sort-by');
  const form = dropdown.closest('form');

  const dropdownMobile = document.querySelector('.sort-mobile');
  const optionsMobile = dropdownMobile.querySelectorAll('.dropdown-mobile-option');
  const hiddenInputMobile = dropdownMobile.querySelector('#sort-by-mobile');
  const formMobile = dropdownMobile.closest('form');


  if (window.matchMedia("(min-width: 481px)").matches) {
    console.log('desktop')
    

    trigger.addEventListener('click', () => {
      console.log('click ok')
      dropdown.classList.toggle('open');
    });

    options.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.dataset.value;
        hiddenInput.value = value;
        form.submit();
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
      }
    });
  }
  
  if(window.matchMedia("(max-width: 480px)").matches) {
    console.log('mobile')
    
    trigger.addEventListener('click', () => {
      dropdownMobile.classList.toggle('open');
    });

    optionsMobile.forEach(option => {
      console.log(option)
      option.addEventListener('click', () => {
        console.log('click ok')
        const value = option.dataset.value;
        hiddenInput.value = value;
        form.submit();
      });
    });

    // Close dropdown when clicking outside
    dropdownMobile.addEventListener('click', () => {
      dropdownMobile.classList.remove('open');
    })
    document.querySelector('.sort-mobile-hide-btn').addEventListener('click', () => {
      dropdownMobile.classList.remove('open');
    })
    document.querySelector('.form-mobile').addEventListener('click', (e) => {
      e.stopPropagation();
    })
  }
});