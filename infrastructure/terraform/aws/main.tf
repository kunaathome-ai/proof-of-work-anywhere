terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# VPC
resource "aws_vpc" "pow" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.tags, {
    Name = "${var.prefix}-vpc"
  })
}

# Public Subnets
resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.pow.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = merge(var.tags, {
    Name = "${var.prefix}-public-${count.index}"
  })
}

# Private Subnets
resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.pow.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, length(var.availability_zones) + count.index)
  availability_zone = var.availability_zones[count.index]

  tags = merge(var.tags, {
    Name = "${var.prefix}-private-${count.index}"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "pow" {
  vpc_id = aws_vpc.pow.id

  tags = merge(var.tags, {
    Name = "${var.prefix}-igw"
  })
}

# NAT Gateway
resource "aws_eip" "nat" {
  count = length(var.availability_zones)
  vpc   = true

  tags = merge(var.tags, {
    Name = "${var.prefix}-eip-${count.index}"
  })
}

resource "aws_nat_gateway" "pow" {
  count         = length(var.availability_zones)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(var.tags, {
    Name = "${var.prefix}-nat-${count.index}"
  })

  depends_on = [aws_internet_gateway.pow]
}

# Route Tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.pow.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.pow.id
  }

  tags = merge(var.tags, {
    Name = "${var.prefix}-public-rt"
  })
}

resource "aws_route_table" "private" {
  count  = length(var.availability_zones)
  vpc_id = aws_vpc.pow.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.pow[count.index].id
  }

  tags = merge(var.tags, {
    Name = "${var.prefix}-private-rt-${count.index}"
  })
}

# Route Table Associations
resource "aws_route_table_association" "public" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# EKS Cluster
resource "aws_eks_cluster" "pow" {
  name     = "${var.prefix}-eks"
  role_arn = aws_iam_role.eks_cluster.arn
  version  = "1.28"

  vpc_config {
    subnet_ids              = concat(aws_subnet.public[*].id, aws_subnet.private[*].id)
    security_group_ids      = [aws_security_group.eks_cluster.id]
    endpoint_public_access  = true
    endpoint_private_access = true
  }

  tags = merge(var.tags, {
    Name = "${var.prefix}-eks"
  })
}

# EKS Node Group
resource "aws_eks_node_group" "pow" {
  cluster_name    = aws_eks_cluster.pow.name
  node_group_name = "${var.prefix}-node-group"
  node_role_arn   = aws_iam_role.eks_nodes.arn
  subnet_ids      = aws_subnet.private[*].id

  scaling_config {
    desired_size = var.node_count
    max_size     = var.node_count + 2
    min_size     = var.node_count - 1
  }

  instance_types = [var.instance_type]

  tags = merge(var.tags, {
    Name = "${var.prefix}-node"
  })
}

# S3 Buckets
resource "aws_s3_bucket" "evidence" {
  bucket = "${var.prefix}-evidence"
  
  tags = merge(var.tags, {
    Name = "${var.prefix}-evidence"
  })
}

resource "aws_s3_bucket" "reports" {
  bucket = "${var.prefix}-reports"
  
  tags = merge(var.tags, {
    Name = "${var.prefix}-reports"
  })
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "pow" {
  name       = "${var.prefix}-redis-subnet"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_replication_group" "pow" {
  replication_group_id = "${var.prefix}-redis"
  description          = "Redis for POW Anywhere"
  node_type            = var.redis_instance_type
  number_cache_clusters = length(var.availability_zones)
  subnet_group_name    = aws_elasticache_subnet_group.pow.name
  security_group_ids    = [aws_security_group.redis.id]
  
  tags = var.tags
}

# CloudWatch
resource "aws_cloudwatch_log_group" "pow" {
  name              = "/aws/eks/${var.prefix}-eks"
  retention_in_days = 7
}

# Outputs
output "vpc_id" {
  value = aws_vpc.pow.id
}

output "eks_cluster_endpoint" {
  value = aws_eks_cluster.pow.endpoint
}

output "eks_cluster_name" {
  value = aws_eks_cluster.pow.name
}

output "evidence_bucket" {
  value = aws_s3_bucket.evidence.id
}

output "reports_bucket" {
  value = aws_s3_bucket.reports.id
}

output "redis_endpoint" {
  value = aws_elasticache_replication_group.pow.primary_endpoint_address
}
