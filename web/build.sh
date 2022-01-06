yarn
rm -rf dist/
yarn build
aws s3 --profile tung sync dist/ s3://thesis.tungto.dev

