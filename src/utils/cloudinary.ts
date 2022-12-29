import {Cloudinary} from "@cloudinary/url-gen";
import { env } from '@env/server.mjs';

const cloudy = new Cloudinary({
    cloud: {
      cloudName:env.NEXT_PUBLIC_CLOUDY_NAME_CLIENT
    }
  });


  export default cloudy