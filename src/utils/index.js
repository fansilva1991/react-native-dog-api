export const defaultDataToArray = data => {
  const responseAsArray = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      const dog = {
        breed: key,
        image: null,
      };
      responseAsArray.push(dog);
    }
  }
  return responseAsArray;
};
