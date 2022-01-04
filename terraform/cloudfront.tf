locals {
  s3_origin_id              = "S3Origin"
  storage_origin            = "StorageOrigin"
  graphql_api_staging_v2_id = "GraphqlOriginStagingV2"
  map_web_origin            = "MapWebOrigin"
}

resource "aws_cloudfront_origin_access_identity" "storage_image" {
  comment = "datasean storage cloudfront identity"
}

resource "aws_cloudfront_origin_access_identity" "map_web" {
  comment = "datasean storage cloudfront identity"
}

resource "aws_cloudfront_distribution" "image_storage" {
  origin {
    domain_name = aws_s3_bucket.storage_image.bucket_regional_domain_name
    origin_id   = local.storage_origin

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.storage_image.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = false
  default_root_object = "index.html"

  aliases = [var.storage_domain_name]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.storage_origin

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow_all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern     = "/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.storage_origin

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect_to_https"
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "SG", "VN"]
    }
  }

  tags = {
    Environment = "dev"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    acm_certificate_arn            = aws_acm_certificate.storage_image.arn
    ssl_support_method             = "sni_only"
  }
}

// Thesis
resource "aws_cloudfront_distribution" "map_web" {
  origin {
    domain_name = aws_s3_bucket.map_web.bucket_regional_domain_name
    origin_id   = local.map_web_origin

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.map_web.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = false
  default_root_object = "index.html"

  aliases = ["datasean.vn"]

  custom_error_response {
    error_caching_min_ttl = 300
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }


  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.map_web_origin

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow_all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern     = "/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.map_web_origin

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect_to_https"
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "SG", "VN"]
    }
  }

  tags = {
    Environment = "dev"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    acm_certificate_arn            = aws_acm_certificate.map_web.arn
    ssl_support_method             = "sni_only"
  }
}




// Graphql API distribution
#
# resource "aws_cloudfront_distribution" "graphql_api_staging_distribution" {
#   origin {
#     domain_name = aws_instance.graphql_api_staging.public_dns
#     origin_id   = local.graphql_api_staging_id
#     custom_origin_config {
#       http_port              = 5000
#       https_port = 443
#       origin_ssl_protocols = ["TLSv1.2"]
#       origin_protocol_policy = "http_only"
#     }
#   }
#
#   enabled         = true
#   is_ipv6_enabled = false
#
#   aliases = [var.thesis_domain_name]
#   default_cache_behavior {
#     allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
#     cached_methods   = ["GET", "HEAD"]
#     target_origin_id = local.storage_origin
#
#     forwarded_values {
#       query_string = true
#       headers      = ["*"]
#       cookies {
#         forward = "all"
#       }
#     }
#
#     viewer_protocol_policy = "allow_all"
#     min_ttl                = 0
#     default_ttl            = 0
#     max_ttl                = 0
#   }
#
#   price_class = "PriceClass_200"
#
#   restrictions {
#     geo_restriction {
#       restriction_type = "whitelist"
#       locations        = ["US", "SG", "VN"]
#     }
#   }
#
#   tags = {
#     Environment = "api_qa"
#   }
#
#   viewer_certificate {
#     cloudfront_default_certificate = false
#     acm_certificate_arn            = aws_acm_certificate.graphql_api_staging.arn
#     ssl_support_method             = "sni_only"
#   }
# }
#
#
#
# resource "aws_cloudfront_distribution" "api_staging_v2" {
#   origin {
#     domain_name = aws_instance.graphql_api_staging_v2.public_dns
#     origin_id   = local.graphql_api_staging_v2_id 
#     custom_origin_config {
#       http_port              = 5000
#       https_port = 443
#       origin_ssl_protocols = ["TLSv1.2"]
#       origin_protocol_policy = "http_only"
#     }
#   }
#
#   enabled         = true
#   is_ipv6_enabled = false
#
#   aliases = ["staging.api_v2.datasean.com"]
#   default_cache_behavior {
#     allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
#     cached_methods   = ["GET", "HEAD"]
#     target_origin_id = local.graphql_api_staging_v2_id
#
#     forwarded_values {
#       query_string = true
#       headers      = ["*"]
#       cookies {
#         forward = "all"
#       }
#     }
#
#     viewer_protocol_policy = "allow_all"
#     min_ttl                = 0
#     default_ttl            = 0
#     max_ttl                = 0
#   }
#
#   price_class = "PriceClass_200"
#
#   restrictions {
#     geo_restriction {
#       restriction_type = "whitelist"
#       locations        = ["US", "SG", "VN"]
#     }
#   }
#
#   tags = {
#     Environment = "staging_api_v2"
#   }
#   
#   viewer_certificate {
#     cloudfront_default_certificate = true
#     acm_certificate_arn            = aws_acm_certificate.api_staging_v2.arn
#     ssl_support_method             = "sni_only"
#   }
# }

