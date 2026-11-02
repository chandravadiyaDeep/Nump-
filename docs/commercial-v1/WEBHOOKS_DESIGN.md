# NUMPA Webhook System Architecture & Security Specification

**Status:** Technical Architecture Specification (Planned / Awaiting Async Infrastructure)  
**Document Version:** 1.0.0  
**Phase:** Commercial V1 — Phase 6  
**Audience:** Security Architect, Backend Engineer, API Developers  

---

## 1. Overview & Event Principles

Webhooks allow external systems (CI/CD pipelines, automated data lakes, Zapier/Make automations) to receive real-time notifications when NUMPA asynchronous operations complete.

### Core Data Security Guarantees
1. **Zero Raw Data in Payloads:** Webhook payloads must **never** contain raw dataset rows, data samples, or uploaded records. Payloads contain strictly operational metadata, summary metrics, execution IDs, and status codes.
2. **Cryptographic Signing (HMAC-SHA256):** Every outgoing HTTP request carries a signature header computed over the payload using a per-endpoint secret shared only between NUMPA and the user.
3. **Replay & Timestamp Protection:** Payloads include a Unix timestamp. Receivers verify that the timestamp falls within an acceptable tolerance window (e.g., 300 seconds) to prevent replay attacks.
4. **Strict SSRF Immunity:** Destination URLs are rigorously validated before delivery to block Server-Side Request Forgery against internal cloud infrastructure.

---

## 2. Event Catalogue & Payload Schemas

### 2.1 Event Types
- `dataset.inspected` — Fired when tabular profiling and schema inference complete.
- `cleaning.completed` — Fired when automated cleaning generates a cleaned dataset.
- `ml_readiness.assessed` — Fired when an ML readiness evaluation finishes.
- `ml_models.compared` — Fired when baseline model comparison finishes.
- `usage.threshold_reached` — Fired when an account consumes 80% or 100% of plan quotas.

### 2.2 Standard Event Payload Format

```json
{
  "id": "evt_01HZX89J4K6N8V2Q1Z9P3C5M7R",
  "object": "event",
  "created_at": 1772615400,
  "type": "cleaning.completed",
  "data": {
    "job_id": "job_98a7b6c5d4e3f210",
    "filename": "synthetic_sales.csv",
    "format": "csv",
    "rows_before": 10000,
    "rows_after": 9850,
    "duplicates_removed": 150,
    "missing_values_filled": 420,
    "duration_ms": 312,
    "status": "succeeded"
  }
}
```

---

## 3. Cryptographic Signature & Verification Specification

### 3.1 Outgoing Headers
NUMPA signs each webhook request using HMAC-SHA256. The request includes:
- `NUMPA-Signature`: Formatted as `t=<timestamp>,v1=<signature_hex>`
- `NUMPA-Event-Id`: The unique ID of the event (`evt_...`)
- `User-Agent`: `NUMPA-Webhook-Delivery/1.0`

### 3.2 Signature Computation
```python
import hmac
import hashlib
import time

def sign_payload(payload_bytes: bytes, secret: str, timestamp: int) -> str:
    # 1. Prepare signed payload: timestamp.payload
    signed_payload = f"{timestamp}.".encode("utf-8") + payload_bytes
    # 2. Compute HMAC-SHA256 hex digest
    signature = hmac.new(secret.encode("utf-8"), signed_payload, hashlib.sha256).hexdigest()
    return f"t={timestamp},v1={signature}"
```

### 3.3 Consumer Verification Example (Python / FastAPI)
```python
import hmac
import hashlib
import time

def verify_numpa_webhook(raw_body: bytes, header: str, secret: str, max_age_seconds: int = 300) -> bool:
    elements = dict(item.split("=") for item in header.split(","))
    timestamp = int(elements.get("t", 0))
    signature = elements.get("v1", "")

    # Replay protection
    if abs(time.time() - timestamp) > max_age_seconds:
        return False

    # Constant-time comparison
    signed_data = f"{timestamp}.".encode("utf-8") + raw_body
    expected = hmac.new(secret.encode("utf-8"), signed_data, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
```

---

## 4. Destination URL Validation & SSRF Prevention

Allowing users to register arbitrary webhook URLs introduces critical SSRF (Server-Side Request Forgery) risks. The webhook dispatcher enforces:

1. **Protocol Restriction:** Only `https://` is permitted. Plain `http://` is strictly prohibited.
2. **Default Port Only:** Port must be 443. Non-standard ports (e.g., `:8080`, `:22`, `:6379`) are blocked.
3. **DNS Resolution & IP Range Check:** Before dispatching an HTTP POST, NUMPA resolves the destination hostname to its IPv4/IPv6 address and rejects:
   - Loopback: `127.0.0.0/8`, `::1`
   - Private Networks: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
   - Link-Local & Cloud Metadata: `169.254.0.0/16` (blocks AWS/Render metadata service access)
   - Multicast & Broadcast: `224.0.0.0/4`, `240.0.0.0/4`
4. **No Internal Hostnames:** Hostnames ending in `.local`, `.internal`, `.localhost`, or plain hostnames without a public TLD are rejected at registration time.
5. **No Redirects:** The HTTP client has `follow_redirects=False` enabled. If the receiver returns a 301/302 redirect, the delivery is marked failed to prevent redirect-based SSRF.

---

## 5. Delivery Retry Policy & Failure Handling

Webhooks are delivered asynchronously with bounded exponential backoff:

| Attempt | Delay | Backoff Strategy |
|---|---|---|
| **1** | Immediate | On event completion |
| **2** | 30 seconds | First retry |
| **3** | 2 minutes | Second retry |
| **4** | 15 minutes | Third retry |
| **5** | 1 hour | Final attempt |

- If all 5 attempts fail (non-2xx response or network timeout of 10s), the event is marked `dead_letter`.
- If an endpoint consistently fails 50 consecutive deliveries over 48 hours, it is automatically paused to prevent server resource waste, and an alert notification is emailed to the account owner.

---

## 6. Implementation Prerequisites & Status

- **Current Status:** `Planned · Not connected`.
- **Prerequisites for Launch:**
  1. Celery / Redis or BullMQ background worker queue on Render to handle asynchronous outgoing HTTP calls without blocking API request threads.
  2. Supabase schema for `webhook_endpoints` and `webhook_deliveries`.
  3. Formal security sign-off on SSRF network egress filters.
