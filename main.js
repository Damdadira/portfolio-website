'use strict';

const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;

//navbar 투명하게 만들건데 올라가면 투명, 내려오면 색상 출력
document.addEventListener('scroll', () => {
  console.log(window.scrollY);
  console.log(`navbarHeight: ${navbarHeight}`);
  if (window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark');
  } else {
    navbar.classList.remove('navbar--dark');
  }
});
