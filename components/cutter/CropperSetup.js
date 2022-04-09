import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Selector from '@/components/cutter/Selector';
import Drawer from '@/components/cutter/ImageDrawer';
import { useCutterContext } from 'context/CutterContext';
import CutpageSidebar from './Cutpage-sidebar';
import style from '@/styles/CropperSetup.module.css';

function CropperSetup() {
  const router = useRouter();

  const [counter, setCounter] = useState(0);

  const cuttedImages = useRef([]);

  const selectorCanvas = useRef();
  const container = useRef();
  const [imgSrc, setimgSrc] = useState([]);
  const cuttingImage = useRef();

  const { images, setImages } = useCutterContext();

  const drawerCanvas = useRef();
  const drawer = useRef();

  const containerInfo = () => {
    return container.current.getBoundingClientRect();
  };

  const callBack = (data) => {
    drawer.current.draw(data);
  };

  const fitResizer = () => {
    selectorCanvas.current.width = containerInfo().width;
    selectorCanvas.current.height = containerInfo().height;
  };

  useEffect(() => {
    if (images && images.length > 0) {
      images.forEach((image) => {
        const reader = new FileReader();
        reader.onload = () => {
          setimgSrc((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(image);
      });
    }
  }, []);

  useEffect(() => {
    const imageInfo = cuttingImage.current.getBoundingClientRect();
    // Selector
    selectorCanvas.current.width = containerInfo().width;
    selectorCanvas.current.height = containerInfo().height;

    let selector = new Selector(
      selectorCanvas.current,
      selectorCanvas.current.width / 2 - 100,
      selectorCanvas.current.height / 2 - 100,
      200,
      200,
      callBack
    );
    selector.init();

    drawer.current = new Drawer(
      drawerCanvas.current,
      fitResizer,
      container.current,
      cuttingImage.current
    );
    drawer.current.init(selectorCanvas);

    // Image drawer
    drawerCanvas.current.width = imageInfo.width;
    drawerCanvas.current.height = imageInfo.height;

    return () => {
      selector = null;
      drawer.current = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuttedImages.current.length]);

  const nextCut = () => {
    if (counter < images.length) {
      const output = drawerCanvas.current.toDataURL('image/jpeg');

      cuttedImages.current.push(output);

      setCounter((prev) => prev + 1);
    } else {
      setImages(cuttedImages.current);
      router.push('/adminPanel');
    }
  };

  const download = () => {
    const output = drawerCanvas.current
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    window.location.href = output;
  };

  return (
    <div className={style.container}>
      <div className={style.second_container}>
        <div ref={container} className={style.cropper_container}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc[counter]}
            alt="image to cut"
            className={style.cutting_image}
            ref={cuttingImage}
          />
          <canvas
            id="selector"
            ref={selectorCanvas}
            style={{ position: 'absolute', top: '0', left: '0', zIndex: '5' }}
          ></canvas>

          <button
            onClick={download}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              zIndex: '20',
              cursor: 'pointer',
            }}
          >
            Download
          </button>
          <button
            onClick={nextCut}
            style={{
              position: 'absolute',
              top: '0',
              left: '90px',
              zIndex: '20',
              cursor: 'pointer',
            }}
          >
            done
          </button>
        </div>
        <CutpageSidebar imgSrc={imgSrc} />
      </div>

      <div
        style={{ display: 'none' }} // position: 'absolute', right: '0', transform: 'scale(0.5)'
      >
        <canvas ref={drawerCanvas}></canvas>
      </div>
    </div>
  );
}

export default CropperSetup;
