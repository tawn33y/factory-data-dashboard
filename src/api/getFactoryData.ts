import axios from "axios";

export const getFactoryData = () => new Promise((resolve, reject) => {
  axios.get("/api/factory-data")
    .then((response) => resolve(response.data))
    .catch((error) => reject(error?.response?.data.error ?? error?.message ?? "An error occurred"));
});
