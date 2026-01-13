# Terraform Variables for Unified Portal

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-south-1" # Mumbai region
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro" # Free tier eligible
}

variable "key_name" {
  description = "Name of the SSH key pair (must exist in AWS)"
  type        = string
  default     = "gov-portal"
}

variable "use_elastic_ip" {
  description = "Whether to use Elastic IP for static IP address"
  type        = bool
  default     = true
}

# WhatsApp Configuration
variable "whatsapp_business_account_id" {
  description = "WhatsApp Business Account ID"
  type        = string
  sensitive   = true
}

variable "whatsapp_phone_number_id" {
  description = "WhatsApp Phone Number ID"
  type        = string
  sensitive   = true
}

variable "whatsapp_api_token" {
  description = "WhatsApp API Access Token"
  type        = string
  sensitive   = true
}

variable "whatsapp_verify_token" {
  description = "WhatsApp Webhook Verify Token"
  type        = string
  default     = "my_secure_token_2024"
  sensitive   = true
}
