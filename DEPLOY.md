# Deployment Guide

## Prerequisites

### Local Development
- Node.js 18+
- npm 9+
- Docker & Docker Compose
- Git

### On-Premises
- Kubernetes 1.24+
- Helm 3.x
- PostgreSQL 12+
- Redis 6+
- MinIO (or S3-compatible storage)

### Cloud Deployment
- Cloud provider account (Azure/AWS/GCP)
- kubectl configured
- Helm 3.x
- Terraform 1.5+
- Domain name (optional)

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/proof-of-work-anywhere.git
cd proof-of-work-anywhere
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Install Dependencies
```bash
npm install
```

## Local Development Deployment

### Using Docker Compose (Recommended)
```bash
# Start all services
npm run docker:up

# View logs
docker-compose -f infrastructure/docker-compose/docker-compose.yml logs -f

# Stop services
npm run docker:down
```

### Manual Setup
```bash
# Start Redis
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Start MinIO
docker run -d -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  --name minio \
  minio/minio server /data --console-address ":9001"

# Start backend services (in separate terminals)
cd backend/services/job-service && npm run dev
cd backend/services/session-service && npm run dev
cd backend/services/evidence-service && npm run dev
cd backend/services/config-service && npm run dev
cd backend/workers/ai-inspector && npm run dev
cd backend/workers/validation-worker && npm run dev

# Start frontend applications
cd frontend/admin && npm run dev
cd frontend/worker && npm run dev
```

## On-Premises Deployment

### 1. Prepare Kubernetes Cluster
```bash
# Verify cluster access
kubectl cluster-info
kubectl get nodes
```

### 2. Install Dependencies
```bash
# Install Redis (if not using external)
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis --set architecture=standalone

# Install MinIO (if not using external)
helm repo add minio https://charts.min.io/
helm install minio minio/minio --set persistence.enabled=true
```

### 3. Deploy Application
```bash
# Update Helm values
cp infrastructure/helm/pow-anywhere/values.yaml infrastructure/helm/pow-anywhere/values-custom.yaml
# Edit values-custom.yaml with your configuration

# Deploy
helm install pow-anywhere infrastructure/helm/pow-anywhere \
  --namespace production \
  --create-namespace \
  --values infrastructure/helm/pow-anywhere/values-custom.yaml
```

### 4. Verify Deployment
```bash
# Check pod status
kubectl get pods -n production

# Check services
kubectl get svc -n production

# View logs
kubectl logs -f deployment/pow-anywhere-job-service -n production
```

## Cloud Deployment

### Azure Deployment

#### 1. Configure Azure CLI
```bash
az login
az account set --subscription <subscription-id>
```

#### 2. Deploy Infrastructure
```bash
cd infrastructure/terraform/azure
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

#### 3. Get AKS Credentials
```bash
az aks get-credentials --resource-group pow-anywhere-rg --name pow-aks
```

#### 4. Deploy Application
```bash
helm install pow-anywhere infrastructure/helm/pow-anywhere \
  --namespace production \
  --create-namespace \
  --set runtimeMode=cloud \
  --set storage.type=azure_blob \
  --set storage.azure.connectionString=$AZURE_STORAGE_CONNECTION_STRING
```

### AWS Deployment

#### 1. Configure AWS CLI
```bash
aws configure
```

#### 2. Deploy Infrastructure
```bash
cd infrastructure/terraform/aws
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

#### 3. Get EKS Credentials
```bash
aws eks update-kubeconfig --name pow-eks --region us-east-1
```

#### 4. Deploy Application
```bash
helm install pow-anywhere infrastructure/helm/pow-anywhere \
  --namespace production \
  --create-namespace \
  --set runtimeMode=cloud \
  --set storage.type=s3 \
  --set storage.s3.bucket=$S3_BUCKET \
  --set storage.s3.region=$AWS_REGION
```

### GCP Deployment

#### 1. Configure GCP CLI
```bash
gcloud auth login
gcloud config set project <project-id>
```

#### 2. Deploy Infrastructure
```bash
cd infrastructure/terraform/gcp
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

#### 3. Get GKE Credentials
```bash
gcloud container clusters get-credentials pow-gke --region us-central1
```

#### 4. Deploy Application
```bash
helm install pow-anywhere infrastructure/helm/pow-anywhere \
  --namespace production \
  --create-namespace \
  --set runtimeMode=cloud \
  --set storage.type=gcs
```

## Post-Deployment Configuration

### 1. Configure Storage
```bash
# Create storage buckets/containers
# Configure access policies
# Test connectivity
```

### 2. Configure AI Services
```bash
# Add OpenAI API key
# Configure Azure OpenAI if using
# Test AI endpoints
```

### 3. Configure Authentication
```bash
# Set up OIDC provider
# Configure JWT secrets
# Create admin users
```

### 4. Configure Billing
```bash
# Add Stripe API keys
# Configure webhook endpoints
# Set up billing plans
```

### 5. Configure Monitoring
```bash
# Set up Prometheus
# Configure Grafana dashboards
# Configure alerting rules
```

## Verification

### Health Checks
```bash
# Check all services
for service in job session evidence config ai validation report delivery billing; do
  curl -f http://localhost:300${service_port}/health || echo "$service failed"
done
```

### Smoke Tests
```bash
# Create a test job
curl -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Job","description":"Test","clientId":"test","requiredPhotos":1}'

# Create a magic link
curl -X POST http://localhost:3002/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"jobId":"<job-id>","oneTimeUse":true}'
```

### Load Testing
```bash
# Use k6 or similar tool
k6 run tests/load/basic.js
```

## Upgrades

### Rolling Updates
```bash
# Build new images
docker build -t pow-anywhere:latest .

# Update deployment
helm upgrade pow-anywhere infrastructure/helm/pow-anywhere \
  --namespace production \
  --set image.tag=latest \
  --wait
```

### Database Migrations
```bash
# Run migrations
npm run migrate

# Verify migration
npm run migrate:status
```

## Rollback

### Helm Rollback
```bash
helm rollback pow-anywhere <revision> -n production
```

### Terraform Rollback
```bash
terraform destroy
terraform apply
```

## Troubleshooting

### Service Not Starting
```bash
# Check logs
kubectl logs <pod-name> -n production

# Check events
kubectl describe pod <pod-name> -n production

# Check resources
kubectl top nodes
kubectl top pods -n production
```

### Storage Issues
```bash
# Check storage connectivity
# Verify credentials
# Check bucket/container permissions
# Review storage service logs
```

### AI Service Issues
```bash
# Verify API keys
# Check rate limits
# Review token usage
# Test AI endpoints manually
```

## Monitoring Setup

### Prometheus
```bash
# Install Prometheus Operator
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/bundle.yaml

# Configure ServiceMonitors
kubectl apply -f infrastructure/monitoring/servicemonitors.yaml
```

### Grafana
```bash
# Install Grafana
helm install grafana bitnami/grafana

# Import dashboards
# Configure datasources
```

### Logging
```bash
# Install Loki
helm install loki grafana/loki

# Install Promtail
helm install promtail grafana/promtail
```

## Security Hardening

### Network Policies
```bash
# Apply network policies
kubectl apply -f infrastructure/security/network-policies.yaml
```

### Pod Security
```bash
# Apply PodSecurityPolicies
kubectl apply -f infrastructure/security/psp.yaml
```

### Secrets Management
```bash
# Use Sealed Secrets
kubectl apply -f infrastructure/security/sealed-secrets.yaml

# Or use external secret manager
# Configure Vault integration
```

## Backup Configuration

### Automated Backups
```bash
# Configure Velero
velero install --provider aws --bucket velero-backups --secret-file credentials-velero.yaml

# Create schedule
velero schedule create daily-backup --schedule "0 2 * * *"
```

### Disaster Recovery
```bash
# Restore from backup
velero restore create --from-backup daily-backup-<timestamp>
```

## Support

For deployment support:
- Documentation: https://docs.proof-of-work-anywhere.com
- Email: support@proof-of-work-anywhere.com
- Slack: #deployment-help
