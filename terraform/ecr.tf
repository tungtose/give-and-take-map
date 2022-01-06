resource "aws_ecr_repository" "map_api" {
  name                 = "map-api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}
