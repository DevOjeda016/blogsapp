import axios from "axios";
const endpoint= '/api/login'

const login = async (user) => {
  const response = await axios.post(endpoint, user)
  return response.data
}

export default { login }