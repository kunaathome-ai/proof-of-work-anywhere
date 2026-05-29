variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "secondary_region" {
  description = "Secondary region for Redis HA"
  type        = string
  default     = "us-central2"
}

variable "prefix" {
  description = "Prefix for resource names"
  type        = string
  default     = "pow"
}

variable "subnet_cidr" {
  description = "CIDR block for subnet"
  type        = string
  default     = "10.0.0.0/24"
}

variable "node_count" {
  description = "Number of GKE nodes"
  type        = number
  default     = 3
}

variable "machine_type" {
  description = "Machine type for GKE nodes"
  type        = string
  default     = "e2-medium"
}

variable "redis_memory_size" {
  description = "Redis memory size in GB"
  type        = number
  default     = 1
}

variable "labels" {
  description = "Labels for resources"
  type        = map(string)
  default = {
    environment = "production"
    application = "proof-of-work-anywhere"
  }
}
