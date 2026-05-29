variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "pow-anywhere-rg"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "eastus"
}

variable "prefix" {
  description = "Prefix for resource names"
  type        = string
  default     = "pow"
}

variable "node_count" {
  description = "Number of nodes in the AKS cluster"
  type        = number
  default     = 3
}

variable "vm_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_DS2_v2"
}

variable "tags" {
  description = "Tags for resources"
  type        = map(string)
  default = {
    Environment = "Production"
    Application = "ProofOfWorkAnywhere"
  }
}
