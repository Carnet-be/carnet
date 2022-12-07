import { AddPhoto } from "@ui/icons";
import { Uploader } from "rsuite";
import CameraRetroIcon from "@rsuite/icons/legacy/CameraRetro";

const Upload = () => {
  return (
    <Uploader
      multiple
      listType="picture"
      action="//jsonplaceholder.typicode.com/posts/"
      className="flex flex-row items-center justify-center"
    >
      <button>
        <CameraRetroIcon />
      </button>
    </Uploader>
  );
};

export default Upload;
