// Press / media coverage — single source of truth.
// Consumed by the Footer "Featured In" strip and the home-page TrustStrip so the
// two never drift apart. Each entry carries light/dark logo variants because the
// press logos are flat PNGs that need to flip with the active theme.
export const PRESS = [
  {
    name: 'GMA News Online',
    logoLight: '/assets/press/gma-news-online-light.png',
    logoDark:  '/assets/press/gma-news-online-dark.png',
    url: 'https://www.gmanetwork.com/news/pinoyabroad/dispatch/989216/ofw-developersoftware-hub-filipino-students/story/',
  },
  {
    name: 'The Global Filipino Magazine',
    logoLight: '/assets/press/the-global-filipino-magazine-dubai-light.png',
    logoDark:  '/assets/press/the-global-filipino-magazine-dubai-dark.png',
    url: 'https://theglobalfilipinomagazine.com/the-advocate-behind-a-growing-free-tech-movement-in-philippine-education/',
  },
  {
    name: 'Walastech',
    logoLight: '/assets/press/walastech-light.png',
    logoDark:  '/assets/press/walastech-dark.png',
    url: 'https://walastech.com/news/abakada-org-wants-to-close-the-software-gap-in-philippine-schools/',
  },
  {
    name: 'Bombo Radyo',
    logoLight: '/assets/press/bombo-radyo-light.png',
    logoDark:  '/assets/press/bombo-radyo-dark.png',
    url: 'https://tuguegarao.bomboradyo.com/ofw-developer-naglunsad-ng-libreng-software-hub-para-sa-mga-estudyanteng-pilipino/',
  },
  {
    // Full-color SVG wordmark (carries its own deep-blue field), so the single
    // asset reads correctly in both themes — no light/dark variants needed.
    name: 'DZMM TeleRadyo',
    logoLight: '/assets/press/dzmm-teleradyo.svg',
    logoDark:  '/assets/press/dzmm-teleradyo.svg',
    url: 'https://youtu.be/fQoZbmdiYhc?t=19772',
  },
  {
    name: 'TechNode Global',
    logoLight: '/assets/press/tnglobal-logo-light.png',
    logoDark:  '/assets/press/tnglobal-logo-dark.png',
    url: 'https://technode.global/2026/05/20/the-software-gap-in-philippine-education-and-what-open-source-can-do-about-it/',
  },
]
