import { useState } from "react";
import FileIcon from "../../assets/icon-unknown-file.svg"

interface ImageProps{
    src: string,
    alt?: string,
    fallbackSrc?: string,
    className?: string
}

enum State {INIT, LOADING, ERROR}

const Image = (props: ImageProps) => {
    const [imgSrc, setImgSrc] = useState(props.src)
    const [state, setState] = useState(State.INIT);
    const onError = () => {
        if(state !== State.ERROR){
            setState(State.ERROR)
            setImgSrc(FileIcon)
        }
    }
    const onLoad = () =>{
        setState(State.LOADING)
    }
    return ( 
        <img
        loading="lazy"
        onError={onError}
        onLoad={onLoad}
        alt={props.alt || ''}
        className={props.className}
        src={imgSrc}
        />
     );
}
 
export default Image;