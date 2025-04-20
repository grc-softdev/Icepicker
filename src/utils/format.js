export const capFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const userAvatar = (str) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const imagePath = "/files" + str;
  const imageURL = BASE_URL + imagePath;
  return imageURL;
};
