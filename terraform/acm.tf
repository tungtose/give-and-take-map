resource "aws_acm_certificate" "map_web" {
  provider = aws.virginia
  domain_name       = var.thesis_domain_name
  validation_method = "DNS"

  tags = {
    Environment = "dev"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "storage_image" {
  provider = aws.virginia
  domain_name       = var.storage_domain_name
  validation_method = "DNS"

  tags = {
    Environment = "dev"
  }

  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_acm_certificate_validation" "map_web" {
  provider = aws.virginia
  certificate_arn         = aws_acm_certificate.map_web.arn
  validation_record_fqdns = [ aws_route53_record.validation_map_web.fqdn ]
}


resource "aws_acm_certificate_validation" "storage_image" {
  provider = aws.virginia
  certificate_arn         = aws_acm_certificate.storage_image.arn
  validation_record_fqdns = [ aws_route53_record.validation_storage_image.fqdn ]
}
