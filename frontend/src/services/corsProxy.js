// Simple CORS proxy for development
const corsProxy = 'https://cors-anywhere.herokuapp.com/';

export const proxifyUrl = (url) => {
  // Only use proxy in development
  if (process.env.NODE_ENV === 'development') {
    return `${corsProxy}${url}`;
  }
  return url;
};