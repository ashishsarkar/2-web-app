# Frontend CD Pipeline

The **Frontend CD Pipeline** (`frontend-cd.yml`) runs after the Frontend CI Pipeline succeeds on `main`, `develop`, or `release/**`, or can be triggered manually with an environment choice.

## Required repository layout

The CD workflow expects these paths to exist (add them as you adopt Kubernetes/Istio/Argo):

| Path | Purpose |
|------|--------|
| `charts/frontend-app/` | Helm chart for the frontend app (with `values-dev.yaml`, `values-staging.yaml`, `values-prod.yaml`) |
| `k8s/rbac/` | ServiceAccount, Role, RoleBinding |
| `k8s/quota/` | ResourceQuota and LimitRange per env |
| `k8s/network-policies/` | NetworkPolicy manifests |
| `k8s/external-secrets/` | ExternalSecret resources (Vault/ESO) |
| `k8s/istio/` | PeerAuthentication, AuthorizationPolicy, VirtualService, DestinationRule per env |
| `k8s/policies/kyverno/` | Kyverno policies (validate/mutate) |
| `k8s/policies/opa/` | OPA/Conftest Rego policies |
| `k8s/zap/` | ZAP automation configs (`automation-dev.yaml`, etc.) |
| `k8s/falco/rules.yaml` | Falco custom rules |
| `k6/api-tests.js` | k6 API functional test script |
| `k6/load-test.js` | k6 load test script |

Until these exist, jobs that depend on them (e.g. Helm template, ArgoCD sync, k6, ZAP) will fail. You can add the structure gradually and re-enable jobs as you go.

## GitHub secrets (CD-specific)

- `KUBECONFIG` — base64-encoded kubeconfig
- `ARGOCD_SERVER`, `ARGOCD_TOKEN`
- `APP_URL_DEV`, `APP_URL_STAGING`, `APP_URL_PROD`
- `PROMETHEUS_URL`, `GRAFANA_URL`
- `DEFECTDOJO_CD_ENGAGEMENT_ID`
- `SLACK_WEBHOOK_DEPLOY_ALERTS`, `SLACK_WEBHOOK_ROLLBACK_ALERTS`, `SLACK_WEBHOOK_APPROVAL_ALERTS`

CI secrets (Harbor, Cosign, DefectDojo, DTrack, MinIO, etc.) are also used by the CD pipeline.

## Pipeline groups

0. **Setup** — Resolve environment (dev/staging/prod from branch) and image digest from Harbor  
1. **Pre-deploy security** — Trivy, Kubescape, Checkov, Helm lint, kubesec, Kyverno, OPA/Conftest, Cosign verify, DTrack CVE re-check  
2. **Environment provisioning** — Namespace, RBAC, ResourceQuota, NetworkPolicy, ESO/Vault sync, Istio config  
3. **Deploy** — Helm dry-run, ArgoCD sync, rollout status, Kyverno admission verify  
4. **Post-deploy verification** — Smoke tests, pod health, Istio mTLS, Prometheus, TLS cert, NetworkPolicy test  
5. **Functional + performance** — k6 API tests, k6 load tests, OWASP ZAP DAST (with auto-rollback on CRITICAL)  
6. **Runtime + compliance** — kube-bench, Polaris, Falco, Kubescape live scan  
7. **Promotion gate** — Deployment audit log, aggregate results, manual approval (prod), Argo Rollouts promote / rollback  
