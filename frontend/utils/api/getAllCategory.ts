import apiKeys from "constants/apiKeys";
import axios from 'axios'
async function getAllCategory() {
  const req = await axios.get(apiKeys.GET_CATEGORIES);
  const data = await req.data.category;

  return data;
}

export default getAllCategory;
