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
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 635506958747.dkr.ecr.ap-southeast-1.amazonaws.com
VERSION=\$1
rm -rf .env
echo "VERSION=\$VERSION" > .env
sudo docker-compose up -d
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
    image: 635506958747.dkr.ecr.ap-southeast-1.amazonaws.com/map-api:\${VERSION}
    container_name: api
    ports:
      - "5000:5000"
    environment:
      - MONGO_URL=mongodb://mongo:27017/thesis
      - JWT_SECRET=thesis-secret
      - AWS_DEFAULT_REGION=ap-southeast-1
      - S3_ACCESS_KEY_ID=AKIAZH5ZKUGNYQZR4EWN
      - S3_SECRET_ACCESS_KEY=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
      - S3_IMAGE_STORAGE_NAME=storage.tungto.dev
      - NODE_ENV=production
    restart: always
    privileged: true

  mongo:
    image: mongo
    restart: always
    ports:
      - 0.0.0.0:27107:27017
    volumes:
      - .docker/data/db:/data/db
    environment:
      - MONGO_INITDB_DATABASE=thesis
EOF

chmod +x deploy.sh
# sh deploy.sh latest
sudo webhook -hooks hook.yaml -port 8088

sudo sh -c "$(curl -fsLS git.io/chezmoi)" -- init --apply https://github.com/tungtose/dotfiles.git
