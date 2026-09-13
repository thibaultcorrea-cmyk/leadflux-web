import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const LightGalleryImage = ({ src, alt }: { src: string, alt?: string }) => {
    return (

        <PhotoView src={src}>
            <img src={src} alt={alt} className="max-w-full h-auto" />
        </PhotoView>
    )
}


const LightGalleryZoomButton = ({ onScale, scale }: { onScale: (scale: number) => void, scale: number }) => {

    return (
        <>
            <svg className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale + 1)} />
            <svg className="PhotoView-Slider__toolbarIcon" onClick={() => onScale(scale - 1)} />
        </>
    );

}


type LightViewerSingleProps = {
    src: string;
    alt?: string;
    className?: string;
}
const LightViewerSingle = ({ src, alt, className }: LightViewerSingleProps) => {
    return (

        <PhotoProvider  >
            <LightGalleryImage src={src} alt={alt} />
        </PhotoProvider>

    )
}





export default LightViewerSingle