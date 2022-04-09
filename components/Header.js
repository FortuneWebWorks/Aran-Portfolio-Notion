import style from '@/styles/Header.module.css';
import aboutStyles from '@/styles/about.module.css';
import Router, { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import HomeSvg from './SVG/home.svg';

function Header() {
  const router = useRouter();
  const navRoutes = ['gallery', 'about', 'contact'];
  let correctUrl = useRef(router.pathname.split('/')[1]);
  let page = useRef(null);

  useEffect(() => {
    page.current = document.getElementById(`${correctUrl.current}`);
    if (page.current) {
      page.current.style.opacity = '1';
    }
  }, []);

  Router.events.on('routeChangeComplete', (routeURL) => {
    setTimeout(() => {
      if (page.current) {
        page.current.style.opacity = '1';
      }
    }, 100);
  });

  function routeHandle(route) {
    if (page.current) {
      page.current.style.opacity = '0';
      if (correctUrl.current === 'about' || '') {
        document
          .querySelector(`.${aboutStyles.satan}`)
          .classList.add(aboutStyles.getOut);
        document
          .querySelector(`.${aboutStyles.adriel}`)
          .classList.add(aboutStyles.getOut);
      }
    }

    setTimeout(() => {
      router.push(route);
    }, 200);
  }

  function checkActive(e, route) {
    if (
      !e.target.classList.contains(style.active) ||
      router.pathname.split('/').length > 2
    ) {
      routeHandle(`/${route}`);
    }
  }

  function menuTrigger(e) {
    e.target.classList.toggle(style.open);
    e.target.parentElement.classList.toggle(style.show);
  }

  const onClickHandler = () => {
    router.push('/');
  };

  return (
    <header className={style.navbar_container}>
      <HomeSvg
        onClick={onClickHandler}
        style={{
          height: '3rem',
          width: '100%',
          textAlign: 'center',
          margin: '1rem auto',
          cursor: 'pointer',
          fill: '#121212',
        }}
      />
      <div className={style.ham_menu} onClick={menuTrigger}>
        <div className={style.ham_item}></div>
        <div className={style.ham_item}></div>
        <div className={style.ham_item}></div>
      </div>

      <div className={style.tabs}>
        {navRoutes.map((item) => {
          return (
            <span
              onClick={(e) => {
                e.preventDefault();
                checkActive(e, item);
              }}
              className={router.pathname.includes(item) ? style.active : ''}
              key={item}
            >
              {item.toUpperCase()}
            </span>
          );
        })}
      </div>
    </header>
  );
}

export default Header;
