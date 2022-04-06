import style from '@/styles/JumpToTop.module.scss';
import { useEffect, useRef } from 'react';
import Icon from '@/svg/pointing_hand_2.svg';

function JumpToTop() {
  const goToTopRef = useRef();

  function goToTop(e) {
    e.preventDefault();

    window.scrollTo(0, {
      smooth: true,
    });

    e.target.removeEventListener('click', goToTop);
  }

  function showOnScroll(e) {
    const button = goToTopRef.current;
    if (button) {
      window.scrollY > 0
        ? (button.style.opacity = 1)
        : (button.style.opacity = 0);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', showOnScroll);

    return () => {
      window.removeEventListener('scroll', showOnScroll);
    };
  }, []);

  return (
    <div
      onClick={goToTop}
      className={style.go_top}
      ref={goToTopRef}
      id="goToTop"
    >
      <Icon />
    </div>
  );
}

export default JumpToTop;
