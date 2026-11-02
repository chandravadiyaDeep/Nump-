# NUMPA Third-Party Integrations & Connectors Specification

**Status:** Technical Architecture Specification (Planned / Awaiting External App Verification)  
**Document Version:** 1.0.0  
**Phase:** Commercial V1 — Phase 6  
**Audience:** Security Architect, Frontend Engineer, Partner Integrations Lead  

---

## 1. Overview & Security Isolation Model

NUMPA's integrations architecture allows users to connect their data workflows with third-party automation tools (Zapier, Make.com, n8n) and cloud file providers (Google Drive, GitHub).

### Core Security Mandates
1. **Built on Public API:** Connectors communicate exclusively through NUMPA's documented, authenticated public REST API. They never access internal Python functions, private network endpoints, or database tables directly.
2. **Least Privilege Scopes:** Integrations request the absolute minimum permissions required. Full-account access (such as full Google Drive or root GitHub repository access) is strictly forbidden.
3. **Untrusted Data Boundary:** All files ingested from external providers are treated as untrusted user input, validated for size (≤50 MB) and structure, and passed through the standard in-memory ingestion pipeline.
4. **Transparent Disconnect & Revocation:** Every integration must provide a single-click disconnect button that purges access tokens, revokes OAuth grants with the provider, and removes any linked configuration.

---

## 2. Automation Connectors (Zapier, Make.com, n8n)

### 2.1 Capability Matrix
| Platform | Connector Type | Primary Triggers | Primary Actions | Authentication Method |
|---|---|---|---|---|
| **Zapier** | Official Partner App | `New Cleaned Dataset`, `Readiness Assessment Completed` | `Inspect Dataset`, `Clean Dataset & Impute`, `Score ML Readiness` | OAuth2 (Authorization Code with PKCE) |
| **Make.com** | Custom App / Community | `Webhook Trigger (Instant)` | `Upload & Clean File`, `Download Cleaned CSV` | API Key (`numpa_live_...`) |
| **n8n** | Community Node / Native | `NUMPA Webhook Node` | `Dataset Operations Node` | Header Bearer Token |

### 2.2 Trigger & Action Lifecycle
- **Trigger `New Cleaned Dataset`:** Delivered via Webhook (`cleaning.completed`). Contains only row counts, transformation audit details, and temporary signed download URLs (valid for 15 minutes).
- **Action `Clean Dataset`:** Accepts binary file stream or public URL, dispatches to `/api/v1/cleaning/execute`, and returns the cleaned CSV stream to the downstream workflow step.
- **Data Isolation:** Automations are tenant-isolated. An API key or OAuth token is strictly bound to the authenticated user's workspace.

---

## 3. Cloud File Ingestion (Google Drive & GitHub)

### 3.1 Google Drive Integration Specification

#### Scope & Permission Model
- **Requested OAuth Scope:** `https://www.googleapis.com/auth/drive.file`
- **Why this scope?** This scope grants NUMPA access **only** to the specific files the user selects using the Google Picker dialog. It does **not** grant access to view, search, or index the user's entire Google Drive.
- **Client Flow:**
  1. User clicks "Import from Google Drive" in NUMPA.
  2. The Google Picker UI opens in a secure iframe/popup.
  3. User explicitly selects a single CSV/XLSX/Parquet spreadsheet.
  4. Google Picker returns an ephemeral authorization token and file ID.
  5. The NUMPA backend streams the selected file directly into memory, executes inspection, and presents the tabular quality profile.
  6. The ephemeral token is discarded immediately.

#### Revocation
- Users can revoke access directly inside NUMPA Settings or via Google Account Security permissions (`myaccount.google.com/permissions`).

### 3.2 GitHub Repository Integration Specification

#### Scope & Permission Model
- **Mechanism:** GitHub App installation or fine-grained Personal Access Token scoped to a specific repository.
- **Scope:** Read-only access to repository contents (`contents:read`) on selected public or private repositories.
- **File Ingestion:**
  1. User selects a repository and navigates the tree to select a `.csv`, `.json`, or `.parquet` file.
  2. Backend fetches raw file content via the GitHub REST API (`GET /repos/{owner}/{repo}/contents/{path}`).
  3. File is ingested in-memory and processed according to standard NUMPA pipelines.
  4. Repository code, scripts, or non-tabular files are strictly ignored and never executed.

---

## 4. Current Implementation Status in Codebase

| Integration | Current Repository Status | Display Badge in Settings | Blocker / Next Step |
|---|---|---|---|
| **NUMPA API** | Core endpoints operational; docs published | `Planned · not connected` | Add API key management and auth middleware. |
| **Webhooks** | Architecture specified in `WEBHOOKS_DESIGN.md` | `Planned · not connected` | Implement background worker queue. |
| **Zapier** | Specification ready | `Planned · not connected` | Submit partner application to Zapier developer platform. |
| **Make.com** | Specification ready | `Planned · not connected` | Publish Make custom app definition. |
| **n8n** | Specification ready | `Planned · not connected` | Publish `n8n-nodes-numpa` npm package. |
| **Google Drive** | Specification ready | `Planned · not connected` | Create Google Cloud OAuth Client ID & configure Picker API. |
| **GitHub** | Specification ready | `Planned · not connected` | Register official NUMPA GitHub App. |

All catalog entries in the application UI must truthfully maintain the label:  
**`Planned · not connected`**.
