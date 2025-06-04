'use strict';

//navbar 투명하게 만들건데 올라가면 투명, 내려오면 색상 출력
const navbar = document.querySelector('#navbar'); //CSS에서 불러오겠다 '#navbar라는 항목을'
const navbarHeight = navbar.getBoundingClientRect().height;

if (window.scrollY > navbarHeight) {
  navbar.classList.add('navbar--dark');
} else {
  navbar.classList.remove('navbar--dark');
}

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
const filterTabs = document.querySelectorAll('.filter__tab');
const projectCards = document.querySelectorAll('.project__card');
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const categories = card.getAttribute('data-category');
                if (categories && categories.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});


// 1. 모든 섹션 요소들과 메뉴아이템들을 가지고 온다
const sectionIds = [
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

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
  selectNavItem(navItems[sectionIds.indexOf(selector)]); //수동으로 할당
}

const observerOptions = {
  root: null,
  rootMagin: '0px',
  threshold: 0.3,
};

//IntersectionObserver를 이용해서 섹션에 밖으로 나갈 때마다 그 다음에 해당하는 인덱스를 계산
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);

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

//새로고침 했을 때 navbar 유지되도록
window.addEventListener('load', () => {
  let closestIndex = 0;
  let minDistance = Infinity;

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const distance = Math.abs(rect.top);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  selectedNavIndex = closestIndex;
  selectNavItem(navItems[selectedNavIndex]);
});

//마우스 효과
const cursor = document.querySelector('.mouse__effect');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX + 10;
  mouseY = e.clientY + 10;
});

function animate() {
  currentX += (mouseX - currentX) * 0.5;
  currentY += (mouseY - currentY) * 0.5;

  cursor.style.left = `${currentX}px`;
  cursor.style.top = `${currentY}px`;

  requestAnimationFrame(animate);
}

animate();

// 스크롤 할때 section 올라오는 효과
gsap.registerPlugin(ScrollTrigger);

const scrollIds = [
  '#home',
  '#about',
  '#skills',
  '#work',
  '#testimonials',
];
scrollIds.forEach((section) => {
  gsap.from(section, {
    opacity: 0,
    y: 100,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 80%', 
      toggleActions: 'play none none none', 
    },
  });
});