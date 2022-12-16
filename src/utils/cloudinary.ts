import cl from 'cloudinary'
import { env } from '@env/server.mjs';

const cloudy=cl.v2


cloudy.config({
    cloud_name:"dab7dxfh7",
    api_key:"125426688527763",
    api_secret:"PaeviZiqhZf-2HyI-VlmldqVopE"
})

export {cloudy}