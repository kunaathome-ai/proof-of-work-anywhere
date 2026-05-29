variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "prefix" {
  description = "Prefix for resource names"
  type        = string
  default     = "pow"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "node_count" {
  description = "Number of EKS nodes"
  type        = number
  default     = 3
}

variable "instance_type" {
  description = "Instance type for EKS nodes"
  type        = string
  default     = "t3.medium"
}

variable "redis_instance_type" {
  description = "Instance type for Redis"
  type        = string
  default     = "cache.t3.medium"
}

variable "tags" {
  description = "Tags for resources"
  type        = map(string)
  default = {
    Environment = "Production"
    Application = "ProofOfWorkAnywhere"
  }
}
