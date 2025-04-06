## 🚀 How to Run This App Locally (via Docker)

This project is fully containerized. Follow the steps below to clone, build, and run it from scratch.

---

### ✅ Prerequisites

Make sure the following are installed **before proceeding**:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/downloads)

---

###  Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/genstudio-app.git
cd genstudio-app
```

###  Step 2 — Build & Start the App

Use Docker Compose to spin up all services:

```bash
docker compose up --build
```

This will automatically build and start:

| Service         | Description                                 |
|-----------------|---------------------------------------------|
| `frontend`      | React app (UI) on port **3000**             |
| `backend`       | Express API on port **8080**                |
| `grafana-agent` | Pushes metrics/logs/traces to Grafana Cloud |

---

### **Step 3 — Access the Running App**

Once running, open your browser:

- 🖥️ **Frontend App** → [http://localhost:3000](http://localhost:3000)
- 🧠 **API Endpoint** → [http://localhost:8080/romannumeral?query=10](http://localhost:8080/romannumeral?query=10)
- 📊 **Metrics Endpoint** → [http://localhost:8080/metrics](http://localhost:8080/metrics)

---

### **Step 4 — Run Backend & Frontend Tests (Optional)**

To run all tests inside Docker:

```bash
docker compose up backend-tests frontend-tests
```

- ✅ Backend unit tests via **Jest + Supertest**
- ✅ Frontend component tests via **React Testing Library**

---

###  **Step 5 — Built-in Observability**

This app includes full observability out-of-the-box:

| Signal   | Tool                   | Notes                                                  |
|----------|------------------------|--------------------------------------------------------|
| Metrics  | Prometheus             | via `/metrics`, scraped by Grafana Agent              |
| Logs     | Winston → Loki         | Structured logs via log file, scraped by Grafana Agent |
| Traces   | OpenTelemetry → Tempo  | Express auto-instrumented spans                        |

All observability data is streamed to **Grafana Cloud** using a preconfigured `agent-config.yaml`.

---

### 🧾 **Notes**

- ✅ All environment-specific secrets are embedded for review (no manual setup required)
- 📄 Winston logs are stored at `/var/log/backend/app.log` and tailed by the Grafana Agent
- 🔗 Trace data is sent to Tempo using OpenTelemetry over OTLP (HTTP)

