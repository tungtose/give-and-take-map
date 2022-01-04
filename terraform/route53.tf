resource "aws_route53_zone" "totungdev" {
  name = "tungto.dev"
}

resource "aws_route53_record" "map_web" {
  zone_id = aws_route53_zone.totungdev.zone_id
  name    = var.thesis_domain_name
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.map_web.domain_name
    zone_id                = aws_cloudfront_distribution.map_web.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "storage_image" {
  zone_id = aws_route53_zone.totungdev.zone_id
  name    = var.storage_domain_name
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.map_web.domain_name
    zone_id                = aws_cloudfront_distribution.map_web.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "validation_map_web" {
  allow_overwrite = true
  name            = tolist(aws_acm_certificate.map_web.domain_validation_options)[0].resource_record_name
  records         = [tolist(aws_acm_certificate.map_web.domain_validation_options)[0].resource_record_value]
  type            = tolist(aws_acm_certificate.map_web.domain_validation_options)[0].resource_record_type
  zone_id         = aws_route53_zone.totungdev.id
  ttl             = 60
}

resource "aws_route53_record" "validation_storage_image" {
  allow_overwrite = true
  name            = tolist(aws_acm_certificate.storage_image.domain_validation_options)[0].resource_record_name
  records         = [tolist(aws_acm_certificate.storage_image.domain_validation_options)[0].resource_record_value]
  type            = tolist(aws_acm_certificate.storage_image.domain_validation_options)[0].resource_record_type
  zone_id         = aws_route53_zone.totungdev.id
  ttl             = 60
}
