import axios from "axios";

export interface FactoryData {
  headers: string[];
  rows: Record<string, number[]>;
}
export const getFactoryData = (): Promise<FactoryData> => new Promise((resolve, reject) => {
  axios.get("/api/factory-data")
    .then((response) => resolve(response.data))
    .catch((error) => reject(error?.response?.data.error ?? error?.message ?? "An error occurred"));
});
