import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

function ImageLoader({ src }) {
  // const [size, setSize] = useState();
  // const [loading, setLoading] = useState(true);
  // const image = useRef();

  // useEffect(() => {
  //   image.current = new Image();
  //   image.current.src = src;

  //   setSize(() => ({
  //     width: image.current.naturalWidth,
  //     height: image.current.naturalHeight,
  //   }));
  //   setLoading(false);
  // }, [size, loading]);

  // if (loading) {
  //   return <h2>Loading...</h2>;
  // }

  return (
    <Image
      src={src}
      alt="image"
      layout="intrinsic"
      width={1000}
      height={1000}
    />
  );
}

export default ImageLoader;
