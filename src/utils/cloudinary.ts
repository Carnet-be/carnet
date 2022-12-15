import cl from 'cloudinary'
import { env } from '@env/server.mjs';

const cloudy=cl.v2


cloudy.config({
    cloud_name:env.CLOUDY_NAME,
    api_key:env.CLOUDY_API_KEY,
    api_secret:env.CLOUDY_API_SECRET
})

export {cloudy}