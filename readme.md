# Anti Gravity IDE

A browser-based insurance policy management application where users can sign up, sign in, view their insurance policies, download policy PDFs, and renew policies via a payment gateway.

---

## Features

- User registration and login (email + password)
- Dashboard showing all policies linked to the logged-in user
- Download policy PDFs (served via secure Azure Blob Storage URLs)
- Renew policy button redirecting to a payment gateway
- No CAPTCHA or OTP — fully compatible with Playwright automation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, HTML, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB / Azure Cosmos DB (MongoDB API) |
| File Storage | Azure Blob Storage |
| Authentication | Email + Password (bcrypt hashing) |
| Testing | Playwright |
| Deployment | Azure App Service |
| CI/CD | Azure DevOps Pipelines |

---

## Architecture

```
User → React UI → Express API → MongoDB / Cosmos DB
                      ↓
               Azure Blob Storage (PDFs)
```

### Request flow

1. User signs up or logs in via the React frontend.
2. Express backend validates credentials against the database.
3. On success, policies linked to the user's email are fetched.
4. UI renders the policy list with download and renew actions.
5. PDF downloads are served as time-limited SAS URLs from Azure Blob Storage.
6. Renew button redirects the user to the configured payment gateway.

---

## Database Schema

### `users` collection

| Field | Type | Notes |
|---|---|---|
| `email` | String | Primary key |
| `passwordHash` | String | bcrypt hashed |
| `createdDate` | Date | |

### `policies` collection

| Field | Type | Notes |
|---|---|---|
| `policyId` | String | |
| `email` | String | Foreign key → users |
| `policyType` | String | |
| `policyName` | String | |
| `pdfBlobUrl` | String | Azure Blob Storage URL |
| `expiryDate` | Date | |
| `renewalStatus` | String | |

---

## PDF Storage

PDFs are **not** stored in the database. The strategy is:

1. Upload PDFs to Azure Blob Storage.
2. Store the Blob URL in the `policies` collection.
3. Generate a **SAS (Shared Access Signature)** URL at download time.
4. SAS links expire after a configured duration for security.

---

## Security

- Passwords hashed with **bcrypt** — never stored in plain text.
- HTTPS enforced across all endpoints.
- Secrets (DB connection strings, storage keys) stored in **Azure Key Vault** — never hardcoded.
- Role-based access control (Admin / User).
- Azure Blob Storage is private; files are only accessible via signed URLs.

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local) or an Azure Cosmos DB connection string
- Azure Storage account
- Azure Key Vault (for production secrets)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/anti-gravity-ide.git
cd anti-gravity-ide

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AZURE_STORAGE_ACCOUNT=your_storage_account_name
AZURE_STORAGE_KEY=your_storage_key
AZURE_BLOB_CONTAINER=policy-pdfs
PAYMENT_GATEWAY_URL=https://your-payment-gateway.com
PORT=5009
```

> In production, load these from **Azure Key Vault** instead of a `.env` file.

### Running Locally

```bash
# Start backend
cd server
npm start

# Start frontend (separate terminal)
cd client
npm run dev
```

The API will be available at `http://localhost:5009` and the Vite frontend at `http://localhost:5173`.

### Quick MongoDB setup

1. Copy `server/.env.example` to `server/.env`
2. Set `MONGO_URI` to your local MongoDB instance or MongoDB Atlas connection string
3. Set a real `JWT_SECRET`
4. Start the API from `server/`
5. Optionally seed sample users and policies with `node seed.js`

---

## Recommended Development Order

1. Build the Node.js / Express API skeleton
2. Connect MongoDB and define schemas
3. Create the React UI (login, signup, dashboard)
4. Implement login and signup with bcrypt + JWT
5. Upload sample PDFs to Azure Blob Storage
6. Wire up policy-fetch endpoints
7. Display downloadable PDF links with SAS URLs
8. Add Playwright automation tests
9. Deploy to Azure App Service
10. Configure custom domain and CI/CD pipeline

---

## CI/CD Pipeline (Azure DevOps)

```
Developer pushes code to Azure Repo
        ↓
  Stage 1 – Build
    • npm install
    • React production build

  Stage 2 – Test
    • Run Playwright test suite

  Stage 3 – Package
    • Build Docker image (optional)

  Stage 4 – Deploy
    • Deploy to Azure App Service
    • Secrets injected from Azure Key Vault
```

---

## Playwright Tests

Tests can be run locally against any deployed URL, or automatically within the Azure DevOps pipeline.

Recommended test coverage:

- Sign-up flow
- Login flow
- Policy list display
- PDF download
- Renew button navigation

```bash
# Run tests
cd tests
npx playwright test
```

---

## Deployment

### Option 1 — Azure App Service (recommended)

Deploy the Node.js backend and React frontend together as a single Azure App Service. Connect to Azure Cosmos DB and Azure Blob Storage as external services.

### Option 2 — Docker / Container Apps

Split into separate containers for the API and frontend, deployed via Azure Container Apps or AKS.

---

## Custom Domain (Optional)

1. Purchase a domain from GoDaddy (or any registrar).
2. Add a CNAME record pointing to your Azure App Service URL.
3. Map the custom domain inside Azure App Service settings.

```
app.yourdomain.com  →  yourapp.azurewebsites.net
```

---

## License

MIT
