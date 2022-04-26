echo "api version (tag): "
read next

aws ecr get-login-password --profile tung --region ap-southeast-1 | docker login --username AWS --password-stdin 635506958747.dkr.ecr.ap-southeast-1.amazonaws.com

echo "149087623997.dkr.ecr.ap-southeast-1.amazonaws.com/api:$next"
docker build -t  635506958747.dkr.ecr.ap-southeast-1.amazonaws.com/map-api:$next .

docker push 635506958747.dkr.ecr.ap-southeast-1.amazonaws.com/map-api:$next
