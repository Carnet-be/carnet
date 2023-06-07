import ReactImageZoom from "react-image-zoom";
const ImageZoom = (props) => {
  // return <Zoom zoomScale={3} transitionTime={0.5} {...props} />;
  return <ReactImageZoom {...props} />;
};

export default ImageZoom;
