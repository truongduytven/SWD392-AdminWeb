import axios from "axios"

const busAPI = axios.create({
    baseURL: 'https://ticket-booking-swd392-project.azurewebsites.net',
    timeout: 20000,
    headers: {
      "Content-Type": "application/json"
    }
  })
  busAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!(config.data instanceof FormData)) {
            config.headers.Accept = 'application/json';
            config.headers['Content-Type'] = 'application/json';
        } else {
            // Khi sử dụng FormData, trình duyệt tự động thiết lập Content-Type
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// busAPI.interceptors.response.use(
// 	(response) => response.data,
// 	(error) => {
// 		if (error.response.status === 401) {
// 			/* empty */
// 		}
// 		return Promise.reject(error)
// 	},
// )
export default busAPI