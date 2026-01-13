# Unified Portal - Terraform Configuration
# This will create and manage EC2 instance for the application

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# AWS Provider Configuration
provider "aws" {
  region = var.aws_region
  
  # Credentials will be loaded from:
  # 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
  # 2. AWS credentials file (~/.aws/credentials)
  # 3. IAM role (if running on EC2)
}

# Data source to get latest Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Get default VPC
data "aws_vpc" "default" {
  default = true
}

# Security Group for the application
resource "aws_security_group" "unified_portal" {
  name        = "unified-portal-sg"
  description = "Security group for Unified Portal application"
  vpc_id      = data.aws_vpc.default.id

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  # HTTPS access
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access"
  }

  # Backend API (optional, for direct access)
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Backend API"
  }

  # ICMP for ping (troubleshooting)
  ingress {
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "ICMP ping"
  }

  # Outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name        = "unified-portal-sg"
    Project     = "Unified Portal"
    Environment = var.environment
  }
}

# EC2 Instance
resource "aws_instance" "unified_portal" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.unified_portal.id]
  
  # Enable public IP
  associate_public_ip_address = true

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = templatefile("${path.module}/user-data.sh", {
    whatsapp_business_account_id = var.whatsapp_business_account_id
    whatsapp_phone_number_id     = var.whatsapp_phone_number_id
    whatsapp_api_token           = var.whatsapp_api_token
    whatsapp_verify_token        = var.whatsapp_verify_token
  })

  tags = {
    Name        = "unified-portal-server"
    Project     = "Unified Portal"
    Environment = var.environment
  }
  
  # Wait for instance to be ready
  lifecycle {
    create_before_destroy = false
  }
}

# Elastic IP (optional, for static IP)
resource "aws_eip" "unified_portal" {
  count    = var.use_elastic_ip ? 1 : 0
  instance = aws_instance.unified_portal.id
  domain   = "vpc"

  tags = {
    Name        = "unified-portal-eip"
    Project     = "Unified Portal"
    Environment = var.environment
  }
}
