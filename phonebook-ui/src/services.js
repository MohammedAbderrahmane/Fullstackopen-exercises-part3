import axios from "axios";

const baseUrl = "/persons";

const get = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const add = (personObject) => {
  const request = axios.post(baseUrl, personObject);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const update = (personObject, id) => {
  const request = axios.put(`${baseUrl}/${id}`, personObject);
  return request.then((response) => response.data);
};

export default { add, get, remove, update };
