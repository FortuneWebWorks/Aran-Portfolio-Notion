import style from '@/styles/Header.module.scss';
// import aboutStyles from '@/styles/about.module.css';
import Router, { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import HomeSvg from '@/svg/home.svg';
import Link from 'next/link';

function Header() {
  const router = useRouter();
  const container = useRef();
  const navRoutes = ['gallery', 'about', 'contact'];

  useEffect(() => {
    container.current.style.display = 'flex';
  });

  function menuTrigger(e) {
    e.target.classList.toggle(style.open);
    e.target.parentElement.classList.toggle(style.show);
  }

  return (
    <header className={style.navbar_container} ref={container}>
      <HomeSvg
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
        {navRoutes.map((item, index) => {
          return (
            <Link href={`/${item}`} passHref key={index}>
              <span
                className={router.pathname.includes(item) ? style.active : ''}
                key={item}
              >
                {item.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

export default Header;
