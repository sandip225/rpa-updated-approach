# Terraform Deployment for Unified Portal

## Prerequisites

1. **AWS CLI** configured with credentials
2. **Terraform** installed (v1.0+)
3. **SSH Key Pair** created in AWS (default: `gov-portal`)

## Quick Start

```bash
# Navigate to terraform folder
cd terraform

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Deploy
terraform apply -auto-approve

# Get outputs
terraform output
```

## Variables

| Variable | Default | Description |
|----------|---------|-------------|
| aws_region | us-east-1 | AWS region |
| instance_type | t2.micro | EC2 instance type |
| key_name | gov-portal | SSH key pair name |
| project_name | unified-portal | Project name for tagging |

## Outputs

After deployment, you'll get:
- `public_ip` - Server IP address
- `website_url` - Application URL
- `ssh_command` - SSH command to connect

## Destroy

```bash
terraform destroy -auto-approve
```

## Notes

- The EC2 instance automatically installs Docker and deploys the application
- Application will be available at `http://<public_ip>` after ~5 minutes
- Check deployment logs: `ssh -i gov-portal.pem ubuntu@<ip> "cat /var/log/user-data.log"`
