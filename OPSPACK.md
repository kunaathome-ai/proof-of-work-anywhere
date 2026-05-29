# Operations Pack

## System Overview

Proof of Work Anywhere is a cloud-agnostic micro-SaaS platform consisting of:
- 9 backend microservices
- 2 frontend applications
- Redis for queue management
- MinIO/S3 for object storage
- PostgreSQL/SQLite for data persistence

## Runtime Modes

### Local Development
- **Storage**: Local filesystem
- **Database**: SQLite
- **AI**: Mock AI service
- **Queue**: Redis (Docker)
- **Networking**: localhost

### On-Premises
- **Storage**: MinIO
- **Database**: PostgreSQL
- **AI**: Local inference server
- **Queue**: Redis
- **Networking**: Private network

### Cloud
- **Storage**: Cloud-native (S3/Azure Blob/GCS)
- **Database**: Managed PostgreSQL
- **AI**: Cloud AI services
- **Queue**: Managed Redis
- **Networking**: VPC with private endpoints

## Service Dependencies

```
┌─────────────┐
│   Redis     │
└──────┬──────┘
       │
       ├──────────────────────────────────────┐
       │                                      │
┌──────▼──────┐  ┌──────────────┐  ┌────────▼────────┐
│ Job Service │  │Session Service│  │Evidence Service │
└──────┬──────┘  └──────┬───────┘  └────────┬────────┘
       │                │                   │
       └────────────────┼───────────────────┘
                        │
                ┌───────▼────────┐
                │ Config Service │
                └────────────────┘

┌──────────────┐  ┌──────────────┐
│ AI Inspector │  │Validation Wkr │
└──────┬───────┘  └──────┬───────┘
       │                  │
       └────────┬─────────┘
                │
        ┌───────▼────────┐
        │ Report Service │
        └───────┬────────┘
                │
        ┌───────▼────────┐
        │Delivery Service│
        └────────────────┘
```

## Health Checks

All services expose a `/health` endpoint:

```bash
curl http://localhost:3001/health
# Response: {"status":"healthy","service":"job-service"}
```

## Monitoring

### Metrics (Prometheus)
- Service health status
- Queue backlog size
- API response times
- AI token usage
- Storage capacity
- Error rates

### Logging
- Structured JSON logs
- Log levels: DEBUG, INFO, WARN, ERROR
- Centralized log aggregation
- Log retention: 30 days

### Alerts
- Queue backlog > 1000 items
- API error rate > 5%
- AI cost spike detection
- Storage capacity < 20%
- Service health check failures

## Backup & Recovery

### Database Backups
```bash
# SQLite
cp data/*.db /backup/

# PostgreSQL
pg_dump -h localhost -U postgres pow_db > backup.sql
```

### Storage Backups
- Enable versioning on S3 buckets
- Configure lifecycle policies
- Cross-region replication for critical data

### Recovery Procedures
1. Stop all services
2. Restore database from backup
3. Verify data integrity
4. Restart services
5. Run health checks
6. Monitor for errors

## Scaling

### Horizontal Scaling
- Stateless services can be scaled horizontally
- Use Kubernetes HPA or equivalent
- Configure appropriate resource limits

### Vertical Scaling
- Monitor resource utilization
- Adjust CPU/memory limits
- Consider storage I/O for evidence service

### Queue Scaling
- Monitor Redis memory usage
- Scale Redis cluster if needed
- Implement queue partitioning for high throughput

## Troubleshooting

### Common Issues

#### Service won't start
```bash
# Check logs
docker logs <container-name>

# Check port conflicts
lsof -i :<port>

# Check dependencies
docker ps
```

#### Queue backlog growing
```bash
# Check queue status
redis-cli
> LLEN validation-pipeline

# Check worker status
# Scale workers if needed
kubectl scale deployment validation-worker --replicas=5
```

#### Storage connection failures
```bash
# Test storage connection
# Check credentials
# Verify network connectivity
# Review storage service logs
```

#### AI service errors
```bash
# Check API key validity
# Verify rate limits
# Review token usage
# Check model availability
```

## Performance Tuning

### Database Optimization
- Add appropriate indexes
- Optimize slow queries
- Configure connection pooling
- Enable query caching

### Cache Configuration
- Redis memory allocation
- TTL settings for cached data
- Cache invalidation strategy

### AI Optimization
- Implement response caching
- Batch AI requests
- Use appropriate model sizes
- Monitor token usage

## Security Operations

### Key Rotation
- Rotate JWT secrets quarterly
- Update API keys regularly
- Rotate CMKs annually
- Document rotation procedures

### Access Control
- Review IAM policies monthly
- Audit user access quarterly
- Implement principle of least privilege
- Use temporary credentials where possible

### Incident Response
1. Detect and contain
2. Investigate and assess
3. Notify stakeholders
4. Remediate and recover
5. Document and learn

## Maintenance Windows

### Scheduled Maintenance
- Database maintenance: Monthly
- Security updates: Weekly
- Dependency updates: Monthly
- Full system backup: Daily

### Rolling Updates
- Use blue-green deployment
- Health check validation
- Gradual traffic shift
- Rollback capability

## Capacity Planning

### Resource Planning
- Monitor growth trends
- Project capacity needs
- Plan for peak loads
- Maintain buffer capacity

### Cost Optimization
- Right-size instances
- Use spot instances for workers
- Implement lifecycle policies
- Monitor and control AI costs

## Documentation

### Runbooks
- Service startup/shutdown
- Backup/restore procedures
- Scaling operations
- Incident response

### SOPs
- Deployment procedures
- Monitoring setup
- Security hardening
- Compliance checks

## Contact

For operations support:
- Email: ops@proof-of-work-anywhere.com
- Slack: #operations
- On-call: +1-555-OPS-HELP
