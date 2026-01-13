# Terraform Outputs

output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.unified_portal.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = var.use_elastic_ip ? aws_eip.unified_portal[0].public_ip : aws_instance.unified_portal.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.unified_portal.public_dns
}

output "security_group_id" {
  description = "Security Group ID"
  value       = aws_security_group.unified_portal.id
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${var.use_elastic_ip ? aws_eip.unified_portal[0].public_ip : aws_instance.unified_portal.public_ip}"
}

output "website_url" {
  description = "Website URL"
  value       = "http://${var.use_elastic_ip ? aws_eip.unified_portal[0].public_ip : aws_instance.unified_portal.public_ip}"
}

output "api_url" {
  description = "API URL"
  value       = "http://${var.use_elastic_ip ? aws_eip.unified_portal[0].public_ip : aws_instance.unified_portal.public_ip}/api"
}

output "whatsapp_webhook_url" {
  description = "WhatsApp Webhook URL (use this in Meta Dashboard)"
  value       = "http://${var.use_elastic_ip ? aws_eip.unified_portal[0].public_ip : aws_instance.unified_portal.public_ip}/api/whatsapp/webhook"
}
