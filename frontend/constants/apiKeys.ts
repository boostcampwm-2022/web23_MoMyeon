const HOST =
  process.env.NEXT_PUBLIC_BACKEND_API_TEST_MODE == "true"
    ? `${process.env.NEXT_PUBLIC_API_HOST_DEV}:${process.env.NEXT_PUBLIC_API_PORT_DEV}`
    : process.env.NEXT_PUBLIC_API_HOST_PRODUCT;

export const apiKeys = {
  GET_USER_INFO: `https://${HOST}/v1/user/info`,
  GITHUB_LOGIN_AUTH_REQUEST: `https://${HOST}/v1/auth/github`,

  GET_CATEGORIES: `https://${HOST}/v1/category`,

  GET_POSTS: `https://${HOST}/v1/interview?`,
  GET_POST: `https://${HOST}/v1/interview`,
  CREATE_POSTS: `https://${HOST}/v1/interview`,

  GET_INTERVIEW_QUESTIONS: `https://${HOST}/v1/question/`,
  GET_INTERVIEW_MEMBERS: `https://${HOST}/v1/interview/members/`,

  LOGOUT: `http://localhost:3000/api/logout`,
};

export default apiKeys;
