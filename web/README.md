### Note
  - To make point interactive, 
remember to change the "interactiveIds" props the same with the layer want to play with 


### Build
```
yarn
rm -rf dist/
yarn build
aws s3 --profile tung sync dist/ s3://thesis.tungto.dev

```

