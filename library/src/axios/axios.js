import axios from "axios";


const BASE_URL = "https://library-management-5d01.onrender.com" 
// const BASE_URL = "http://localhost:3009"

const axiosInstance=axios.create({
    baseURL:BASE_URL,
});

export default axiosInstance; 