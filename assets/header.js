const shopTrigger = document.getElementById('nav-shop');
const shopMenu = document.querySelector('.dropdown-left');

const searchTrigger = document.getElementById('nav-search');
const searchMenu = document.querySelector('.dropdown-right');

const navMenuTrigger = document.querySelectorAll('.nav-menu-button');
const navMenuClose = document.getElementById('nav-menu-close');
const navMenuWrapper = document.getElementById('nav-menu-mobile');
const navSubmenuTrigger = document.querySelectorAll('.navbar-mobile-dropdown');

const cartTrigger = document.getElementById('nav-cart');
const userTrigger = document.getElementById('nav-user');

const navOverlay = document.querySelector('.navbar-overlay');
const navbarCont = document.querySelector('.navbar-cont');

shopTrigger.addEventListener('mouseenter', () => {
  shopMenu.classList.add('dropdown-active');
  navOverlay.classList.add('show');
  navbarCont.style.zIndex = 999;
})
// shopMenu.addEventListener('mouseleave', () => {
//   shopMenu.classList.remove('dropdown-active');
//   navOverlay.classList.remove('show');
// })
searchTrigger.addEventListener('click', () => {
  searchMenu.classList.add('dropdown-active');
  navOverlay.classList.add('show-transparent');
  navbarCont.style.zIndex = 999;
});


navMenuTrigger.forEach((btn) => {
  btn.addEventListener('click', () => {
    shopMenu.classList.toggle('dropdown-active');
    navOverlay.classList.toggle('show');
  });
})
navMenuClose.addEventListener('click', (e) => {
  navOverlay.classList.remove('show');
  navOverlay.classList.remove('show-transparent');
  navMenuWrapper.classList.remove('menu-active');
  navbarCont.style.zIndex = 9;
})
navMenuWrapper.addEventListener('click', (e) => {
  e.stopPropagation();
})
navSubmenuTrigger.forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.nextElementSibling.classList.toggle('sublist-show');
  })
})


searchMenu.addEventListener('click', (e) => {
  e.stopPropagation();
})
shopMenu.addEventListener('click', (e) => {
  shopMenu.classList.remove('dropdown-active');
  navOverlay.classList.remove('show');
  navOverlay.classList.remove('show-transparent');
  searchMenu.classList.remove('dropdown-active');
  navMenuWrapper.classList.remove('menu-active');
  navbarCont.style.zIndex = 9;
  e.stopPropagation();
})
// searchMenu.addEventListener('mouseleave', () => {
//   searchMenu.classList.remove('dropdown-active');
//   navOverlay.classList.remove('show');
// })


navOverlay.addEventListener('click', () => {
  shopMenu.classList.remove('dropdown-active');
  navOverlay.classList.remove('show');
  navOverlay.classList.remove('show-transparent');
  searchMenu.classList.remove('dropdown-active');
  navMenuWrapper.classList.remove('menu-active');
  navbarCont.style.zIndex = 9;
})
