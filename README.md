# MCP Server Starter (FluxCD + Istio)

This bundle contains:
- `container/` — a minimal Node-based MCP server (Dockerfile + TypeScript app)
- `apps/mcp-server/` — Kubernetes manifests (Namespace, ConfigMap for prompts, Deployment, Service, HTTPRoute)
- `clusters/prod/mcp-server-kustomization.yaml` — Flux Kustomization pointing to `./apps/mcp-server`
- `settings.local.example.json` — VS Code settings snippet for testing allow-listing your MCP server

## Build & Push
```
cd container
docker build -t <ACR>/mcp/mcp-server:0.1.0 .
az acr login -n <ACR_NAME>
docker push <ACR>/mcp/mcp-server:0.1.0
```

Then update `apps/mcp-server/deployment.yaml` image to your ACR path.

## GitOps
Commit `apps/mcp-server/*` and `clusters/prod/mcp-server-kustomization.yaml` to your Flux repo.
Flux will reconcile and expose the server at the hostname configured in `httproute.yaml`.

## VS Code (pilot)
Use `settings.local.example.json` as a starting point; in enterprise use managed policies to enforce the same keys.
