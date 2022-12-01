const HOST =
  process.env.NEXT_PUBLIC_DEV_MODE == 'true'
    ? process.env.NEXT_PUBLIC_API_HOST_DEV
    : process.env.NEXT_PUBLIC_API_HOST_PRODUCT;

export const apiKeys = {
  GET_USER_INFO: `https://dev.momyeon.site/v1/user/info`,
  GITHUB_LOGIN_AUTH_REQUEST: `https://dev.momyeon.site/v1/auth/github`,
  LOGOUT: `http://${HOST}:3000/api/logout`,
  GET_POSTS: `https://dev.momyeon.site/v1/interview?`,
  GET_POST: `https://dev.momyeon.site/v1/interview`,
  CREATE_POSTS: `https://dev.momyeon.site/v1/interview`,
  GET_INTERVIEW_QUESTIONS: 'https://dev.momyeon.site/v1/question/',
  GET_INTERVIEW_MEMBERS: 'https://dev.momyeon.site/v1/interview/members/',
  GET_CATEGORIES: 'https://dev.momyeon.site/v1/category',
};

export default apiKeys;
