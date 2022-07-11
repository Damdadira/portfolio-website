'use strict';

const navbar = document.querySelector('#navbar'); //CSS에서 불러오겠다 '#navbar라는 항목을'
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

//navbar에서 메뉴 선택했을 때 해당 페이지로 이동하도록 설정
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
  console.log(event.target.dataset.link);
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) {
    return;
  }
  console.log(event.target.dataset.link);
  const scrollTo = document.querySelector(link);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
});
