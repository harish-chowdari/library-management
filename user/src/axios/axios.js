import axios from "axios";


const BASE_URL = "https://library-management-7xaa.vercel.app" 

const axiosInstance=axios.create({
    baseURL:BASE_URL,
});

export default axiosInstance; 