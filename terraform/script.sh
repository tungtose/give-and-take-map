#!/bin/bash
ls -la
sudo apt update -y
# Install aws-cli
sudo apt install awscli -y
sudo apt-get install webhook -y

# Install docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo usermod -aG docker $USER
sudo systemctl start docker

mkdir thesis
cd thesis

cat > deploy.sh << EOF
#!/bin/sh
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 920161623610.dkr.ecr.ap-southeast-1.amazonaws.com
VERSION=\$1
rm -rf .env
echo "VERSION=\$VERSION" > .env
sudo docker-compose up -d
curl -X POST -H 'Content-type: application/json' \
  --data  "{\"blocks\":[{\"type\":\"section\",\"text\":{\"type\":\"plain_text\",\"emoji\":true,\"text\":\"🚀 Deploy SERVER Staging SUCCESS 🚀\"}},{\"type\":\"divider\"},{\"type\":\"section\",\"text\":{\"type\":\"mrdwn\",\"text\":\"Review website\"},\"accessory\":{\"type\":\"button\",\"text\":{\"type\":\"plain_text\",\"text\":\"View Page\",\"emoji\":true},\"value\":\"click_me_123\",\"url\":\"https://staging.thesis.com\",\"action_id\":\"button-action\"}},{\"type\":\"divider\"}]}" \
  https://hooks.slack.com/services/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
EOF

# Add authentication method into hook
cat > hook.yaml << EOF
- id: redeploy-webhook
  execute-command: "/thesis/deploy.sh"
  command-working-directory: "/thesis"
  response-message: "Start deploying"
  pass-arguments-to-command:
    - source: "url"
      name: "version"
EOF


cat > docker-compose.yml << EOF
version: "3"
services:
  api:
    image: 920161623610.dkr.ecr.ap-southeast-1.amazonaws.com/graphql-api-staging:\${VERSION}
    container_name: graphql-api
    ports:
      - "80:5000"
    environment:
      - MONGO_URL=mongodb+srv://thesis:PZHNNmOravk4kf3U@datasean-staging.xr84e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
      - JWT_SECRET=thesis-secret
      - AWS_DEFAULT_REGION=ap-southeast-1
      - S3_ACCESS_KEY_ID=AKIA5MPPIDY5BK46QIOK
      - S3_SECRET_ACCESS_KEY=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
      - S3_IMAGE_STORAGE_NAME=storage.thesis.com
      - NODE_ENV=staging
    restart: always
    privileged: true
EOF

chmod +x deploy.sh
# sh deploy.sh latest
sudo webhook -hooks hook.yaml -port 8088

sudo sh -c "$(curl -fsLS git.io/chezmoi)" -- init --apply https://github.com/tungtose/dotfiles.git
