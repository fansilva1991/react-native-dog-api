import {defaultData} from '../../defaultData';

export const fetchImageForBreed = async dog => {
  try {
    const response = await fetch(`https://dog.ceo/api/breed/${dog}/images`);
    let dogImagesForBreed = await response.json();
    return dogImagesForBreed.message;
  } catch (error) {
    return defaultData;
  }
};

export const fetchDogList = async () => {
  let response = await fetch('https://dog.ceo/api/breeds/list/all');
  response = await response.json();
  const responseAsArray = [];
  for (var key in response.message) {
    if (response.message.hasOwnProperty(key)) {
      const dog = {
        breed: key,
        image: null,
      };
      responseAsArray.push(dog);
    }
  }
  return responseAsArray;
};
