import axios from "axios";


const BASE_URL = "https://library-management-5d01.onrender.com" 

const axiosInstance=axios.create({
    baseURL:BASE_URL,
});

export default axiosInstance; 