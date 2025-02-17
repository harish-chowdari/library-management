import axios from "axios";


const BASE_URL = "http://localhost:3002" 

const axiosInstance=axios.create({
    baseURL:BASE_URL,
});

export default axiosInstance; 