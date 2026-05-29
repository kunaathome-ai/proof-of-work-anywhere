# Proof of Work Anywhere

A cloud-agnostic, enterprise-ready micro-SaaS for proof of work validation with AI-powered inspection, multi-cloud storage support, and comprehensive audit trails.

## 🚀 Features

- **Cloud-Agnostic Architecture**: Single codebase runs in Local, On-Prem, and Cloud modes
- **Enterprise Trust**: Per-client storage options, per-tenant CMK support, signed evidence manifests
- **AI Orchestration**: Pluggable AI Proxy routing to cloud LLM/vision or local multimodal models
- **Ops Console**: Full admin interface for configuring storage, AI, job templates, and runtime mode
- **Mobile-First Worker UI**: Offline-first PWA with resumable uploads and guided capture
- **Validation Pipeline**: Queue-driven validation with GPS verification, AI inspection, and compliance checking
- **Proof Reports**: Auto-generated PDF and JSON certificates with cryptographic signatures
- **Multi-Cloud Delivery**: Support for SaaS storage, client Azure Blob, S3, MinIO, SFTP, SharePoint
- **Billing Integration**: Stripe integration with usage metering and plan enforcement

## 📋 Architecture

### Backend Services

- **Job Service** (Port 3001): Job and template management
- **Session Service** (Port 3002): Magic link generation and session management
- **Evidence Service** (Port 3003): Evidence upload and storage management
- **Config Service** (Port 3004): Client configuration and system settings
- **AI Inspector** (Port 3005): AI-powered evidence analysis
- **Validation Worker** (Port 3006): Evidence validation pipeline
- **Report Service** (Port 3007): PDF/JSON report generation
- **Delivery Service** (Port 3008): Multi-cloud evidence delivery
- **Billing Service** (Port 3009): Usage tracking and invoicing

### Frontend Applications

- **Admin Console** (Port 3000): Operations and management interface
- **Worker UI** (Port 3010): Mobile-first worker application

## 🛠️ Quick Start

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-org/proof-of-work-anywhere.git
cd proof-of-work-anywhere
```

2. **Install dependencies**
```bash
npm install
```

3. **Start services with Docker Compose**
```bash
npm run docker:up
```

4. **Access the applications**
- Admin Console: http://localhost:3000
- Worker UI: http://localhost:3010
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)

### Manual Development Setup

1. **Start Redis**
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

2. **Start backend services**
```bash
# Terminal 1
cd backend/services/job-service
npm run dev

# Terminal 2
cd backend/services/session-service
npm run dev

# Repeat for other services...
```

3. **Start frontend applications**
```bash
# Terminal 1
cd frontend/admin
npm run dev

# Terminal 2
cd frontend/worker
npm run dev
```

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📦 Deployment

### Kubernetes (Helm)

```bash
# Install dependencies
helm dependency update infrastructure/helm/pow-anywhere

# Deploy to cluster
helm install pow-anywhere infrastructure/helm/pow-anywhere \
  --namespace production \
  --create-namespace \
  --values infrastructure/helm/pow-anywhere/values.yaml
```

### Azure Deployment

```bash
cd infrastructure/terraform/azure
terraform init
terraform plan
terraform apply
```

### AWS Deployment

```bash
cd infrastructure/terraform/aws
terraform init
terraform plan
terraform apply
```

### GCP Deployment

```bash
cd infrastructure/terraform/gcp
terraform init
terraform plan
terraform apply
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Runtime
NODE_ENV=development
RUNTIME_MODE=local

# Database
DB_PATH=./data

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-here

# AI Configuration
OPENAI_API_KEY=sk-...
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=...

# Storage
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Runtime Modes

- **Local**: SQLite, local filesystem, mock AI for development
- **On-Prem**: Postgres, MinIO, local AI inference, offline operation
- **Cloud**: Managed services, auto-scaling, cloud AI models

## 🔐 Security

- TLS encryption for all services
- OIDC authentication support
- Per-tenant customer-managed keys (CMK)
- Cryptographic evidence signing
- Private endpoints for cloud deployments
- Comprehensive audit logging

## 📊 Observability

- Prometheus metrics integration
- Distributed tracing support
- Structured JSON logging
- Health check endpoints
- Queue backlog monitoring
- AI cost spike alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@proof-of-work-anywhere.com or open an issue in the repository.

## 🙏 Acknowledgments

- Built with TypeScript, Node.js, React
- AI integration with OpenAI, Azure OpenAI
- Storage adapters for AWS S3, Azure Blob, MinIO
- Queue processing with Bull/Redis
- Kubernetes deployment with Helm
