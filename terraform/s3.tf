data "aws_iam_policy_document" "storage_image" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.storage_image.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.storage_image.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "storage_image" {
  bucket = aws_s3_bucket.storage_image.id
  policy = data.aws_iam_policy_document.storage_image.json
}

resource "aws_s3_bucket" "storage_image" {
  bucket        = var.storage_domain_name
  acl           = "public-read"
  force_destroy = true
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["http://localhost:8088", "https://thesis.tungto.dev"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}


data "aws_iam_policy_document" "map_web" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.map_web.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.map_web.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "map_web" {
  bucket = aws_s3_bucket.map_web.id
  policy = data.aws_iam_policy_document.map_web.json
}


resource "aws_s3_bucket" "map_web" {
  bucket        = var.thesis_domain_name
  acl           = "public-read"
  force_destroy = false
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["http://localhost:5000", "http://localhost:8088", "https://thesis.tungto.dev"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

