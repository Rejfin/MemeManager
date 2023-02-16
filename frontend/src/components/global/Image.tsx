import { useLayoutEffect, useRef, useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { isBlurhashValid } from 'blurhash';
import FileIcon from '../../assets/icon-unknown-file.svg';
import { ReactComponent as PlayIcon } from '../../assets/icon-play.svg';

type objectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';

interface ImageProps {
  id: string;
  src: string;
  width: number;
  height: number;
  type: string;
  blurHash?: string;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  objectFit?: objectFit;
  onClick?: (fileId: string, src: string, width: number, height: number, blurhash?: string) => void;
}

/**
 * States of img loading
 */
enum State {
  LOADING,
  ERROR,
  LOADED,
}

/**
 * Image component is used to support image display and additionally supports blurhash
 * In order for this component to work correctly, its height and maximum width must be fixed
 * @param {ImageProps} props
 * @returns {React.ReactElement} The Image
 */
const Image = (props: ImageProps): React.ReactElement => {
  const [imgSrc, setImgSrc] = useState(props.src);
  const [state, setState] = useState(State.LOADING);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const componentRef = useRef<HTMLDivElement | null>(null);

  /**
   * get the height of the compent to calculate the width in order to maintain
   * the aspect ratio of the image
   */
  useLayoutEffect(() => {
    if (componentRef.current) {
      setDimension({
        width: componentRef.current.offsetWidth,
        height: componentRef.current.offsetHeight,
      });
    }
  }, []);

  /**
   * When loading img failed, set img fallback
   */
  const onError = () => {
    if (state !== State.ERROR) {
      setState(State.ERROR);
      setImgSrc(props.fallbackSrc || FileIcon);
    }
  };

  const onLoad = () => {
    setState(State.LOADED);
  };

  return (
    <div ref={componentRef} className={props.className}>
      <div
        className={`max-w-full flex m-auto relative`}
        style={{ width: props.width * (dimension.height / props.height), height: dimension.height }}
      >
        {state === State.LOADING && props.blurHash && isBlurhashValid(props.blurHash).result && (
          <Blurhash
            onClick={() => props.onClick?.(props.id, props.src, props.width, props.height, props.blurHash) || undefined}
            className={`max-w-full`}
            hash={props.blurHash}
            width={props.width * (dimension.height / props.height)}
            height={dimension.height}
            punch={1}
            style={{
              width: props.width * (dimension.height / props.height),
              height: dimension.height,
            }}
          />
        )}
        <img
          onClick={() => props.onClick?.(props.id, props.src, props.width, props.height, props.blurHash) || undefined}
          loading='lazy'
          onError={onError}
          onLoad={onLoad}
          width={props.width * (dimension.height / props.height)}
          height={dimension.height}
          alt={props.alt || ''}
          className={`max-w-full absolute`}
          style={{
            width: props.width * (dimension.height / props.height),
            height: dimension.height,
            objectFit: props.objectFit || 'contain',
          }}
          src={imgSrc}
        />
        {props.type.startsWith('video') && (
          <div className='bg-background-dark bg-opacity-50 w-full h-full z-[1] pointer-events-none'>
            <PlayIcon className='fill-backgroundSurface opacity-95 pointer-events-none w-full max-w-full h-full py-10 abosolute left-1/2 top-1/2 bottom-1/2 z-[2]' />
          </div>
        )}
      </div>
    </div>
  );
};

export default Image;
