'use strict';

//navbar 투명하게 만들건데 올라가면 투명, 내려오면 색상 출력
const navbar = document.querySelector('#navbar'); //CSS에서 불러오겠다 '#navbar라는 항목을'
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark');
  } else {
    navbar.classList.remove('navbar--dark');
  }
});

//navbar에서 메뉴 선택했을 때 해당 페이지로 이동하도록 설정
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) {
    return;
  }
  navbarMenu.classList.remove('open');
  scrollIntoView(link);
  selectNavItem(target); //수동적으로 선택할 수 있도록(상단바 선택할 때 버그가 발생할 수도 있기 때문)
});

//small screen에서 navbar toggle button 작동하게
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
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
  //만약 window.scrollY가 0이고, homeHeight이 800이면 0/800=0,, 1-0=1(불투명)
  home.style.opacity = 1 - window.scrollY / homeHeight; //불투명:1 ,점점 투명:0.5, 투명:0
});

//스크롤을 내리면 arrow up 버튼을 보여줌
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add('visible');
  } else {
    arrowUp.classList.remove('visible');
  }
});

//arrow up 버튼을 누르면 상단으로 올라가도록 설정
arrowUp.addEventListener('click', () => {
  scrollIntoView('#home');
});

//projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }

  //이전에 선택된 아이템은 셀렉션을 없애고, 새롭게 선택된 아이템 선택
  const active = document.querySelector('.category__btn.selected');
  // active.classList.remove('selected');
  // const target = //아닌 경우(span인 경우)
  //   e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
  // e.target.classList.add('selected');

  if (active != null) {
    active.classList.remove('selected');
  }
  e.target.classList.add('selected');

  projectContainer.classList.add('anim-out');
  setTimeout(() => {
    projects.forEach((project) => {
      console.log(project.dataset.type);
      if (filter === '*' || filter === project.dataset.type) {
        project.classList.remove('invisible');
      } else {
        project.classList.add('invisible');
      }
    });
    projectContainer.classList.remove('anim-out');
  }, 300);
});

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 1. 모든 섹션 요소들과 메뉴아이템들을 가지고 온다
 * 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
 * 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다
 */

// 1. 모든 섹션 요소들과 메뉴아이템들을 가지고 온다
const sectionIds = [
  //우리가 사용하는 모든 아이디를 배열로(문자열로) 저장
  '#home',
  '#about',
  '#skills',
  '#work',
  '#testimonials',
  '#contact',
];
const sections = sectionIds.map((id) => document.querySelector(id)); //모든 sectionIds 요소들을 sections에 할당
const navItems = sectionIds.map(
  (id) => document.querySelector(`[data-link="${id}"]`) //동일한 네비게이션 아이템 요소들을 섹션 navItems에 할당
);
// console.log(sections); ->값 확인용
// console.log(navItems);

// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
//현재 선택된 메뉴 인덱스와 메뉴 요소들을 변수에 저장
let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
//새로운 메뉴 아이템을 선택할 때마다 이전에 활성화된 아이는 지워주고, 다시 새롭게 할당하고 나서 active를 지정
function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

const observerOptions = {
  root: null,
  rootMagin: '0px',
  threshold: 0.3,
};

//IntersectionObserver를 이용해서 섹션에 밖으로 나갈 때마다 그 다음에 해당하는 인덱스를 계산
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    // console.log(entry.target); ->값 확인용
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // console.log(index, entry.target.id); ->값 확인용

      //스크롤이 중간에 있다면
      //스크롤링이 아래로 되어서 페이지가 올라옴
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        //페이지가 내려가고 있는 경우
        selectedNavIndex = index - 1;
      }
    }
  });
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

//3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다
window.addEventListener('wheel', () => {
  //'wheel'->사용자가 직접 상단바 선택할 때만, 'scroll'->마우스로 스크롤 할 때
  if (window.scrollY === 0) {
    //스크롤이 제일 위에 있다면 'Home'을 선택하도록
    selectedNavIndex = 0;
  } else if (
    //scrollY와 window창의 innerHeight값을 더한값이 document.body.clientHeight값과
    //정확하게 일치하지 않는 경우가 있기 때문에 더한값을 반올림 해줘야 함
    //ex->(scrollY+innerHeignt = 1269.2) != (document.body.clientHeight = 1270)
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.clientHeight
  ) {
    //스크롤이 제일 밑에 도달했다면 'Contact'를 선택하도록
    selectedNavIndex = navItems.length - 1; //제일 마지막 인덱스를 가리켜라
  }
  selectNavItem(navItems[selectedNavIndex]);
});
