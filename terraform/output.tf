output "api_ip" {
  value = aws_instance.map_server.public_ip
}

output "s3-access-key" {
  value = aws_iam_access_key.s3_access.id
}

output "s3-secret-key" {
  value     = aws_iam_access_key.s3_access.secret
  sensitive = true
}

output "api_ecr_repository" {
  value = aws_ecr_repository.map_api.repository_url
}


resource "aws_instance" "web" {
  # ...
  provisioner "local-exec" {
    when    = destroy
    command = "echo 'Destroy-time provisioner'"
  }
}
