# 🚀 EventSphere — AWS EC2 Deployment Guide

## Prerequisites
- An AWS account
- Your project pushed to GitHub (or ready to transfer via SCP)

---

## Step 1: Launch an EC2 Instance

1. Go to **AWS Console → EC2 → Launch Instance**
2. Configure:
   - **Name**: `EventSphere`
   - **AMI**: Ubuntu Server 24.04 LTS (Free Tier eligible)
   - **Instance Type**: `t2.micro` (Free Tier) or `t2.small` for better performance
   - **Key Pair**: Create a new key pair → download the `.pem` file → save it safely
   - **Security Group** (Network settings → Edit):
     - ✅ Allow SSH (port 22) — Source: My IP
     - ✅ Allow HTTP (port 80) — Source: Anywhere (0.0.0.0/0)
     - ✅ Allow HTTPS (port 443) — Source: Anywhere (0.0.0.0/0)
   - **Storage**: 20 GB gp3 (default 8GB may be tight for Docker images)
3. Click **Launch Instance**

---

## Step 2: Connect to Your EC2

Open **PowerShell** on your Windows machine:

```powershell
# Move to the folder where your .pem file is saved
cd C:\Users\YourName\Downloads

# Set permissions (Windows doesn't need chmod, but do this for WSL/Git Bash)
ssh -i "your-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```

> 💡 Find your Public IP in **EC2 Dashboard → Instances → Your Instance → Public IPv4 address**

---

## Step 3: Install Docker on EC2

Run these commands **inside the EC2 terminal** (after SSH):

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose-plugin

# Add your user to docker group (avoids needing 'sudo' for docker)
sudo usermod -aG docker $USER

# Logout and reconnect for group changes to take effect
exit
```

Then SSH back in:
```powershell
ssh -i "your-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```

Verify Docker works:
```bash
docker --version
docker compose version
```

---

## Step 4: Transfer Your Project to EC2

### Option A: Using GitHub (Recommended)
```bash
# On EC2
sudo apt install -y git
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### Option B: Using SCP (Direct File Transfer)
```powershell
# On your Windows machine (PowerShell)
scp -i "your-key.pem" -r "C:\Users\Gaman a rai\Desktop\Grind" ubuntu@<YOUR_EC2_PUBLIC_IP>:~/eventsphere
```

---

## Step 5: Configure Environment Variables

```bash
# Navigate to your project
cd ~/eventsphere   # or whatever folder name

# Create the backend .env file
nano backend/.env
```

Paste the following (change the passwords!):
```env
DB_HOST=db
DB_PORT=5432
DB_NAME=eventsphere
DB_USER=postgres
DB_PASSWORD=YourStrongPassword123!
ADMIN_API_KEY=your-secret-admin-key-here
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

---

## Step 6: Update docker-compose.yml Port (if needed)

The current config uses port `8080:80`. For EC2, change it to `80:80`:

```bash
nano docker-compose.yml
```

Change this line:
```yaml
    ports:
      - "80:80"    # <-- Change 8080 to 80
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

---

## Step 7: Build & Launch 🚀

```bash
# Build and start all containers
docker compose up -d --build

# Wait ~60 seconds for everything to initialize, then check status
docker ps
```

You should see 3 containers running:
| Container | Purpose |
|---|---|
| `eventsphere-db` | PostgreSQL database |
| `eventsphere-backend` | FastAPI backend |
| `eventsphere-nginx` | Nginx (frontend + reverse proxy) |

---

## Step 8: Seed the Admin Account

```bash
# Create the superadmin user
docker exec eventsphere-backend python seed_admin.py
```

Expected output:
```
Seeding Superadmin...
Seeding Dept Admin (CSE)...
Seeding completed.
```

---

## Step 9: Access Your App! 🎉

Open your browser and go to:
```
http://<YOUR_EC2_PUBLIC_IP>
```

Admin login:
- **URL**: `http://<YOUR_EC2_PUBLIC_IP>/admin`
- **Email**: `admin@eventsphere.com`
- **Password**: `admin123`

---

## 🔧 Useful Commands

```bash
# View logs
docker compose logs -f              # All services
docker compose logs -f backend      # Backend only
docker compose logs -f nginx        # Nginx only

# Restart services
docker compose restart

# Stop everything
docker compose down

# Rebuild after code changes
docker compose down
docker compose up -d --build

# Check container health
docker ps

# Access the database directly
docker exec -it eventsphere-db psql -U postgres -d eventsphere

# Re-seed admin (if database was reset)
docker exec eventsphere-backend python seed_admin.py
```

---

## 🔒 Production Security Checklist

- [ ] Change `DB_PASSWORD` to a strong password
- [ ] Change `ADMIN_API_KEY` to a unique secret
- [ ] Change the default admin password after first login
- [ ] Consider adding HTTPS with Let's Encrypt (free SSL):
  ```bash
  sudo apt install certbot
  # Then update nginx.conf to handle SSL
  ```
- [ ] Restrict SSH access to your IP only in Security Group
- [ ] Set up regular database backups:
  ```bash
  docker exec eventsphere-db pg_dump -U postgres -d eventsphere > backup_$(date +%Y%m%d).sql
  ```

---

## 📁 Final Project Structure

```
Grind/
├── backend/
│   ├── Dockerfile          # Python 3.12 + FastAPI
│   ├── .env                # Environment variables (NOT committed)
│   ├── .env.example        # Template for .env
│   ├── .dockerignore       # Excludes __pycache__, .venv
│   ├── main.py
│   ├── database.py
│   ├── seed_admin.py
│   ├── requirements.txt
│   ├── routers/
│   ├── middleware/
│   └── utils/
├── frontend/
│   ├── Dockerfile          # Multi-stage: Node build → Nginx serve
│   ├── .dockerignore       # Excludes node_modules, dist
│   ├── nginx.conf          # Nginx config baked into image
│   ├── package.json
│   └── src/
├── db/
│   └── init.sql            # Auto-creates tables on first startup
├── nginx/
│   └── nginx.conf          # Shared nginx config
├── docker-compose.yml      # Orchestrates all 3 services
├── .gitignore
└── DEPLOY.md               # This file
```
