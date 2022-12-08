const HOST =
  process.env.NEXT_PUBLIC_BACKEND_API_TEST_MODE == "true"
    ? `${process.env.NEXT_PUBLIC_API_HOST_DEV}:${process.env.NEXT_PUBLIC_API_PORT_DEV}`
    : process.env.NEXT_PUBLIC_API_HOST_PRODUCT;

export const apiKeys = {
  GET_USER_INFO: `https://${HOST}/v1/user/info`,
  GITHUB_LOGIN_AUTH_REQUEST: `https://${HOST}/v1/auth/github`,
  LOGOUT: `https://${HOST}/v1/auth/logout`,

  GET_CATEGORIES: `https://${HOST}/v1/category`,

  GET_POSTS: `https://${HOST}/v1/interview?`,
  GET_POST: `https://${HOST}/v1/interview`,
  CREATE_POSTS: `https://${HOST}/v1/interview`,

  GET_INTERVIEW_QUESTIONS: `https://${HOST}/v1/question/`,
  GET_INTERVIEW_MEMBERS: `https://${HOST}/v1/interview/members/`,

  MY_QUESTION: `https://${HOST}/v1/user/question`,
  MY_RESUME: `https://${HOST}/v1/user/resume`,
  MANAGE_QUESTION: `https://${HOST}/v1/interview/question`,
};

export default apiKeys;
