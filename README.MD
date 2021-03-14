# React Native Dog Api

This is an application created with React Native consuming the [dog CEO api](https://dog.ceo/dog-api/), with an autocomplete search feature.

## Installation

To install the application and run it into your own machine, just run:

```bash
yarn install
npx pod-install
```

You can check the requirements to run the application at [react native setup page](https://reactnative.dev/docs/environment-setup)

## Usage

```bash
npx react-native start #starts the bundler
npx react-native run-ios #run the application
```

## About the development

The biggest challenge in the development of this application was to implement the auto-complete feature without too many calls on the API when searching for the image. To solve this problem, I have implemented the debouncing feature ( by following the suggestion on this [link](https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js) ), and with that allowing the user to search the breed and the query only being executed just seconds after he stops typing ( and not on every type do a search query on execution time ).

If this was a production application, my first approach would be to ask the backend team to adjust the return of the API

```bash
https://dog.ceo/api/breeds/list/all
```

To add the list of images for the breed on the same response, allowing to avoid a lot of requests while searching. Here is an example of what I am talking about:

```json
{
  "message": [
    {
      "breed": {
        "name": "Akita",
        "images": []
      }
    },
    {
      "breed": {
        "name": "Dachshund",
        "images": []
      }
    }
  ],
  "status": "success"
}
```
