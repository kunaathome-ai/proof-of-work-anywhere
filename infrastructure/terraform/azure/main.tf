terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "pow" {
  name     = var.resource_group_name
  location = var.location

  tags = var.tags
}

# Container Registry
resource "azurerm_container_registry" "pow" {
  name                = "${var.prefix}acr"
  resource_group_name = azurerm_resource_group.pow.name
  location            = azurerm_resource_group.pow.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = var.tags
}

# Kubernetes Cluster (AKS)
resource "azurerm_kubernetes_cluster" "pow" {
  name                = "${var.prefix}-aks"
  location            = azurerm_resource_group.pow.location
  resource_group_name = azurerm_resource_group.pow.name
  dns_prefix          = "${var.prefix}-aks"

  default_node_pool {
    name       = "default"
    node_count = var.node_count
    vm_size    = var.vm_size
  }

  identity {
    type = "SystemAssigned"
  }

  tags = var.tags
}

# Storage Account
resource "azurerm_storage_account" "pow" {
  name                     = "${var.prefix}sa"
  resource_group_name      = azurerm_resource_group.pow.name
  location                 = azurerm_resource_group.pow.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = var.tags
}

# Container for evidence
resource "azurerm_storage_container" "evidence" {
  name                  = "evidence"
  storage_account_name  = azurerm_storage_account.pow.name
  container_access_type = "private"
}

# Container for reports
resource "azurerm_storage_container" "reports" {
  name                  = "reports"
  storage_account_name  = azurerm_storage_account.pow.name
  container_access_type = "private"
}

# Redis Cache
resource "azurerm_redis_cache" "pow" {
  name                = "${var.prefix}-redis"
  location            = azurerm_resource_group.pow.location
  resource_group_name = azurerm_resource_group.pow.name
  capacity            = 1
  family              = "C"
  sku_name            = "Basic"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"

  tags = var.tags
}

# Application Insights
resource "azurerm_application_insights" "pow" {
  name                = "${var.prefix}-appinsights"
  location            = azurerm_resource_group.pow.location
  resource_group_name = azurerm_resource_group.pow.name
  application_type    = "web"

  tags = var.tags
}

# Output connection details
output "resource_group_name" {
  value = azurerm_resource_group.pow.name
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.pow.name
}

output "acr_login_server" {
  value = azurerm_container_registry.pow.login_server
}

output "storage_account_name" {
  value = azurerm_storage_account.pow.name
}

output "redis_host" {
  value = azurerm_redis_cache.pow.hostname
}

output "app_insights_instrumentation_key" {
  value = azurerm_application_insights.pow.instrumentation_key
}
