# Secret Registry — Frontend CI Pipeline

All secrets must be configured as GitHub Actions Repository Secrets before the pipeline will run successfully.

## Secret Inventory

| Secret | Source | Jobs | Scope | Rotation Policy |
|--------|--------|------|-------|-----------------|
| `DOCKERHUB_USERNAME` | Docker Hub bot account | 6.1 | Repo-scoped | On personnel change |
| `DOCKERHUB_TOKEN` | Docker Hub — single repo read/write | 6.1–6.5 | Single repo only | Every 90 days |
| `COSIGN_PRIVATE_KEY` | `cosign generate-key-pair` | 6.2 | Never leaves Vault | Annually |
| `COSIGN_PASSWORD` | Cosign key passphrase | 6.2 | Never leaves Vault | Annually |
| `DEFECTDOJO_URL` | Self-hosted DefectDojo URL | 1.4, 1.6, 5.1 | Internal network | On infra change |
| `DEFECTDOJO_API_KEY` | DefectDojo → API → User profile | 1.4, 1.6, 5.1 | User token | Every 90 days |
| `DEFECTDOJO_ENGAGEMENT_ID` | DefectDojo engagement ID | 1.4, 1.6, 5.1 | Per-product | Quarterly |
| `DTRACK_URL` | Self-hosted Dependency-Track URL | 1.7, 5.1, 5.3 | Internal network | On infra change |
| `DTRACK_API_KEY` | Dependency-Track API key | 1.7, 5.1, 5.3 | Project-scoped | Every 90 days |
| `MINIO_ENDPOINT` | MinIO server URL | All report uploads | Internal network | On infra change |
| `MINIO_ACCESS_KEY` | MinIO access key | All report uploads | Bucket-scoped | Every 90 days |
| `MINIO_SECRET_KEY` | MinIO secret key | All report uploads | Bucket-scoped | Every 90 days |
| `NVD_API_KEY` | nvd.nist.gov — free registration | 1.4 | Public API key | Annually |
| `SLACK_WEBHOOK_SEC_ALERTS` | Slack incoming webhook `#sec-alerts` | 1.1, 1.4, 5.1, 6.5 | Channel-scoped | On channel change |
| `SLACK_WEBHOOK_BUILD_ALERTS` | Slack incoming webhook `#build-alerts` | 4.1, 6.5 | Channel-scoped | On channel change |
| `SLACK_WEBHOOK_DEV_ALERTS` | Slack incoming webhook `#dev-alerts` | 1.6, 2.1 | Channel-scoped | On channel change |
| `REKOR_SERVER` | Optional — defaults to `https://rekor.sigstore.dev` | 6.2, 6.3, 6.5 | Public | On infra change |

## Setup Instructions

### Docker Hub
1. Create a bot account at [hub.docker.com](https://hub.docker.com)
2. Generate a Personal Access Token with **Read/Write** scope for the target repository
3. Set `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`

### Cosign Key Pair
```bash
cosign generate-key-pair
# Creates cosign.key (private) and cosign.pub (public)
# Store cosign.key content as COSIGN_PRIVATE_KEY
# Store the passphrase as COSIGN_PASSWORD
```

### DefectDojo
1. Navigate to your DefectDojo instance → **API v2** → **User profile**
2. Copy the API key → set as `DEFECTDOJO_API_KEY`
3. Create a Product and Engagement → note the engagement ID → set as `DEFECTDOJO_ENGAGEMENT_ID`
4. Set `DEFECTDOJO_URL` to the base URL (e.g., `http://localhost:8080`)

### Dependency-Track
1. Navigate to Dependency-Track → **Administration** → **Access Management** → **Teams**
2. Generate an API key → set as `DTRACK_API_KEY`
3. Set `DTRACK_URL` to the base URL (e.g., `http://localhost:8081`)

### MinIO
1. Use the MinIO console or `mc` CLI to create an access key
2. Set `MINIO_ENDPOINT` (e.g., `http://localhost:9000`)
3. Set `MINIO_ACCESS_KEY` and `MINIO_SECRET_KEY`

### NVD API Key
1. Register at [nvd.nist.gov](https://nvd.nist.gov/developers/request-an-api-key)
2. Set `NVD_API_KEY` with the received key

### Slack Webhooks
1. In Slack workspace → **Apps** → **Incoming Webhooks**
2. Create webhooks for channels: `#sec-alerts`, `#build-alerts`, `#dev-alerts`
3. Set each webhook URL as the corresponding secret

### Rekor (Optional)
- Defaults to `https://rekor.sigstore.dev` (public Sigstore instance)
- Set `REKOR_SERVER` only if using a private Rekor instance
