// import { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { useCutterContext } from 'context/CutterContext';
import style from '@/styles/adminPanel.module.css';
import Image from 'next/image';
import { API_URL } from 'config';

const Panel = () => {
  const router = useRouter();
  const { images, setImages } = useCutterContext();

  const sortChanger = (st1, st2) => {
    const sort1 = parseInt(st1);
    const sort2 = parseInt(st2);

    if (sort1 < sort2) {
      data.map((item) => {
        if (item.sort === sort2) item.sort = sort1;
        return item;
      });
      const item1 = data.find((item) => item.sort === sort1);
      item1.sort = sort2;
    } else {
      data.map((item) => {
        if (item.sort === sort1) item.sort = sort2;
        return item;
      });
      const item2 = data.find((item) => item.sort === sort2);
      item2.sort = sort1;
    }
  };

  const onClick = (e) => {
    const target = e.target.parentElement;
    const sort = e.target.getAttribute('st');
    target.style.transition = 'all 0.3s ease';
    target.style.transform = 'scale(1.1)';

    if (!sorting) {
      setSorting({ target, sort });
    } else {
      if (sorting !== target) {
        target.style.transform = 'scale(1)';
        sorting.target.style.transform = 'scale(1)';
        sortChanger(sorting.sort, sort);
        setSorting(null);
      }
    }
  };

  const onChange = (e) => {
    const files = e.target.files;

    for (let file of files) {
      setImages((prev) => {
        return [...prev, file];
      });
    }

    router.push('/cutter');
  };

  if (false) return <div>Loading...</div>;

  return (
    <div>
      <div className={style.container}>
        <div className={style.options}>
          <Image
            src={API_URL + '/favicon.svg'}
            alt="logo"
            width={20}
            height={20}
            objectFit="scale-down"
          />
          <span>MANAGE GALLERY</span>
          <div className={style.input}>
            <label htmlFor="input">ADD/REMOVE PHOTOS</label>
            <input
              type="file"
              name="input"
              id="input"
              multiple={true}
              onChangeCapture={onChange}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '2rem',
            padding: '2rem',
          }}
        >
          {images.map((image, index) => (
            <div key={index} style={{ width: '100%' }}>
              <img src={image} alt="ig" style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Panel;
