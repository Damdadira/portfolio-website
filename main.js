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

  scrollIntoView(link);
});

//Home의 Contact me를 누르면 Contact 페이지로 이동하도록
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', () => {
  scrollIntoView('#contact');
});

//스크롤을 내릴 때 Home부분이 점점 투명해지도록
const home = document.querySelector('.home__container'); //배경화면은 그대로, 안에 있는 콘텐츠만 투명해지게
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  console.log(homeHeight);
  //만약 window.scrollY가 0이고, homeHeight이 800이면 0/800=0,, 1-0=1(불투명)
  home.style.opacity = 1 - window.scrollY / homeHeight; //불투명:1 ,점점 투명:0.5, 투명:0
});

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
}
