const HOST =
  process.env.NEXT_PUBLIC_DEV_MODE == "true"
    ? process.env.NEXT_PUBLIC_API_HOST_DEV
    : process.env.NEXT_PUBLIC_API_HOST_PRODUCT;

export const apiKeys = {
  GET_POSTS: `http://${HOST}:3000/api/posts`,
  CREATE_POSTS: `http://${HOST}:3000/api/v1/interview`,
  GET_CATEGORIES: `http://${HOST}:3000/api/v1/category`,
  LOGOUT: `http://${HOST}:3000/api/logout`,
};

export default apiKeys;
