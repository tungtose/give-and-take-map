variable "region" {
  default = "ap-southeast-1"
}

variable "script_path" {
  type        = string
  description = "path to initial script"
  default     = "/Users/tung/Personal/thesis/terraform/script.sh"
}

variable "aws_access_key" {
  type        = string
  default     = "AKIAZH5ZKUGNWKVNIBBZ"
  description = "your aws access key"
}

variable "aws_secret_key" {
  type        = string
  default     = "hdIRTA1IpMjZVSJrsSsGvPxcutgyU4SCFC4dX9C+"
  description = "your aws secret key"
}

variable "thesis_domain_name" {
  type        = string
  default     = "thesis.tungto.dev"
  description = "thesis domain"
}

variable "storage_domain_name" {
  type        = string
  default     = "storage.tungto.dev"
  description = "storage domain"
}

variable "image_id" {
  type        = string
  description = "The id of the machine image (AMI) to use for the server."

  default = "ami-0d058fe428540cd89"

  validation {
    condition     = length(var.image_id) > 4 && substr(var.image_id, 0, 4) == "ami-"
    error_message = "The image_id value must be a valid AMI id, starting with \"ami-\"."
  }
}

