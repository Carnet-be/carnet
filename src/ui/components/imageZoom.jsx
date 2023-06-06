import { Zoom } from "react-image-zoom";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ImageZoom = (props) => {
  // return <Zoom zoomScale={3} transitionTime={0.5} {...props} />;
  return (
    <TransformWrapper>
      <TransformComponent>
        <img {...props} />
      </TransformComponent>
    </TransformWrapper>
  );
};

export default ImageZoom;
