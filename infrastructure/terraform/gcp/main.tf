terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# VPC
resource "google_compute_network" "pow" {
  name                    = "${var.prefix}-vpc"
  auto_create_subnetworks = false
}

# Subnets
resource "google_compute_subnetwork" "pow" {
  name          = "${var.prefix}-subnet"
  ip_cidr_range = var.subnet_cidr
  region        = var.region
  network       = google_compute_network.pow.id
  
  secondary_ip_range {
    range_name    = "${var.prefix}-pods"
    ip_cidr_range = "10.1.0.0/16"
  }
  
  secondary_ip_range {
    range_name    = "${var.prefix}-services"
    ip_cidr_range = "10.2.0.0/16"
  }
}

# GKE Cluster
resource "google_container_cluster" "pow" {
  name     = "${var.prefix}-gke"
  location = var.region
  
  remove_default_node_pool = true
  initial_node_count       = 1
  
  network    = google_compute_network.pow.name
  subnetwork = google_compute_subnetwork.pow.name
  
  ip_allocation_policy {
    cluster_secondary_range_name = "${var.prefix}-pods"
    services_secondary_range_name = "${var.prefix}-services"
  }
  
  private_cluster_config {
    enable_private_endpoint = false
    enable_private_nodes    = true
    master_ipv4_cidr_block  = "10.3.0.0/28"
  }
  
  master_authorized_networks_config {
    cidr_blocks {
      cidr_block   = "0.0.0.0/0"
      display_name = "all"
    }
  }
}

# Node Pool
resource "google_container_node_pool" "pow" {
  name       = "${var.prefix}-node-pool"
  location   = var.region
  cluster    = google_container_cluster.pow.name
  node_count = var.node_count
  
  node_config {
    machine_type = var.machine_type
    disk_size_gb = 100
    disk_type    = "pd-standard"
    
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}

# Cloud Storage
resource "google_storage_bucket" "evidence" {
  name          = "${var.prefix}-evidence"
  location      = var.region
  force_destroy = false
  
  uniform_bucket_level_access = true
  
  versioning {
    enabled = true
  }
}

resource "google_storage_bucket" "reports" {
  name          = "${var.prefix}-reports"
  location      = var.region
  force_destroy = false
  
  uniform_bucket_level_access = true
  
  versioning {
    enabled = true
  }
}

# Memorystore (Redis)
resource "google_redis_instance" "pow" {
  name           = "${var.prefix}-redis"
  tier           = "BASIC"
  memory_size_gb = var.redis_memory_size
  region         = var.region
  
  location_id             = var.region
  alternative_location_id  = var.secondary_region
  
  authorized_network = google_compute_network.pow.id
  
  redis_version     = "REDIS_7_0"
  display_name      = "POW Redis"
  
  labels = var.labels
}

# Cloud Monitoring
resource "google_monitoring_dashboard" "pow" {
  dashboard_json = file("${path.module}/dashboard.json")
}

# Outputs
output "vpc_name" {
  value = google_compute_network.pow.name
}

output "gke_cluster_name" {
  value = google_container_cluster.pow.name
}

output "gke_cluster_endpoint" {
  value = google_container_cluster.pow.endpoint
}

output "evidence_bucket" {
  value = google_storage_bucket.evidence.name
}

output "reports_bucket" {
  value = google_storage_bucket.reports.name
}

output "redis_host" {
  value = google_redis_instance.pow.host
}
