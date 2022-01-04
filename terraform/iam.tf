resource "aws_iam_user" "s3_access" {
  name = "s3_access"
}

resource "aws_iam_policy" "s3_access" {
  name        = "s3_policy"
  description = "s3 policy"
  policy      = data.aws_iam_policy_document.s3_access.json
}

data "aws_iam_policy_document" "s3_access" {
  statement {
    actions   = ["s3:ListAllMyBuckets"]
    resources = ["${aws_s3_bucket.storage_image.arn}/*"]
    effect    = "Allow"
  }

  statement {
    actions   = ["s3:*"]
    resources = ["${aws_s3_bucket.storage_image.arn}/*"]
    effect    = "Allow"
  }
}

resource "aws_iam_user_policy_attachment" "s3_access" {
  user       = aws_iam_user.s3_access.name
  policy_arn = aws_iam_policy.s3_access.arn
}

resource "aws_iam_access_key" "s3_access" {
  user = aws_iam_user.s3_access.name
}

locals {
  env = "dev"
}

# EC2
resource "aws_iam_role" "ec2_role" {
  name               = "${local.env}_role"
  assume_role_policy = <<EOF
{
  "Version": "2012_10_17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": ["ec2.amazonaws.com"]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "ecr_policy" {
  name = "${local.env}_ecr_access_policy"
  policy = jsonencode({
    Version = "2012_10_17"
    Statement = [
      {
        Action = [
          "ecr:*",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}
resource "aws_iam_policy_attachment" "attach_ec2_ecr" {
  name       = "${local.env}_attach"
  roles      = ["${aws_iam_role.ec2_role.name}"]
  policy_arn = aws_iam_policy.ecr_policy.arn
}
