# <img width="32px" src="./public/kaizen.png" alt="Kaizen"></img> Kaizen

**Kaizen** is a modern, premium self-hosted manga downloader and manager. This project was born to continue the legacy of the original **Kaizoku**, which was abandoned by its creator. Kaizen introduces a complete visual overhaul, advanced responsiveness, and a smart scheduling system to keep your library always up to date.

![Kaizen Dashboard](./screenshots/dashboard.png)

## ✨ Features

- **🚀 Premium UI/UX**: A stunning "Glassmorphism" interface based on Mantine UI v5, featuring curated Indigo themes and fully localized elements.
- **🧩 Modular Analytics Dashboard**: Beautiful statistics widgets, real-time download activity feeds, and comprehensive repository volume growth charts.
- **⚙️ Configurable Fallback Architecture**: Seamlessly switch or prioritize sequential API providers (**AniList First** vs. **MangaDex First**) dynamically directly from the user Settings menu to guarantee maximum artwork/summary discovery.
- **✏️ Manual Metadata Control**: Surgical editing capabilities for covers (direct external URLs or local physical Base64 image file uploads) and custom synopses, with automated disk-level persistence for third-party file indexing systems.
- **📱 Ultra-Stable Layout Integration**: Verified horizontal and vertical viewport rendering logic leveraging smart hook memoization to completely prevent mobile rotation panics.
- **🔗 Universal Reader Interoperability**: Automatic byte buffer extraction writes standard physical `cover.jpg` files directly to disk libraries to maintain absolute native compatibility with external media platforms like **Kavita** and **Komga**.
- **📅 Smart Background Scheduler**: Optimized asynchronous concurrency checks preventing database connection pool saturation or remote host rate-limiting.

## 📸 Interface Previews

| Dashboard | Library | Planner |
| :---: | :---: | :---: |
| ![Dashboard](./screenshots/dashboard.png) | ![Library](./screenshots/library.png) | ![Planner](./screenshots/planner.png) |

## 🔄 Migration & Compatibility

Kaizen is fully backward compatible with existing Kaizoku deployments. 

- **Environment Variables**: You can now use `KAIZEN_` as a prefix for all application-specific variables. If these are not found, the app will automatically fall back to the original `KAIZOKU_` variables.
  - `KAIZEN_PORT` (falls back to `KAIZOKU_PORT`)
  - `KAIZEN_LOG_PATH` (falls back to `KAIZOKU_LOG_PATH`)
- **Database & Data**: All existing data, configurations, and database records from Kaizoku are preserved and fully compatible with Kaizen.
- **Persistent Volumes**: Two distinct Docker Compose layouts are provided out of the box:
  - **Fresh Installations**: Use the default `docker-compose.yml` mapped cleanly to `./kaizen/...` folders for pure brand consistency.
  - **Upgrading Legacy Kaizoku**: Use `docker-compose.kaizoku-upgrade.yml` to seamlessly launch with existing `./kaizoku/...` host mappings, ensuring absolute zero-downtime transition for your established data and libraries.

## 🚀 Deployment

### Fresh Installation

Deploy clean Kaizen instances out of the box using the standard `docker-compose.yml` file:

```yaml
version: '3'

volumes:
  db:
  redis:

services:
  app:
    container_name: kaizen
    image: d4nj3s/kaizen:latest
    environment:
      - DATABASE_URL=postgresql://kaizoku:kaizoku@db:5432/kaizoku
      - KAIZEN_PORT=3000
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
    volumes:
      - <path_to_library>:/data
      - <path_to_config>:/config
      - <path_to_logs>:/logs
    depends_on:
      db:
        condition: service_healthy
    ports:
      - '3000:3000'
  redis:
    image: redis:7-alpine
    volumes:
      - redis:/data
  db:
    image: postgres:alpine
    restart: unless-stopped
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U kaizoku']
      interval: 5s
      timeout: 5s
      retries: 5
    environment:
      - POSTGRES_USER=kaizoku
      - POSTGRES_DB=kaizoku
      - POSTGRES_PASSWORD=kaizoku
    volumes:
      - db:/var/lib/postgresql/data
```

### Upgrading Legacy Kaizoku

For existing production deployments, launch seamlessly using the dedicated upgrade layout to preserve your host directory bindings without manual file migrations:

```bash
docker compose -f docker-compose.kaizoku-upgrade.yml up -d
```

## 🛠️ Development

### Requirements

- Node.js 18
- pnpm
- Docker
- [mangal](https://github.com/metafates/mangal)

### Getting Started

```bash
git clone https://github.com/kaizen-Architecture/Kaizen-Manga-Downloader.git
cd Kaizen-Manga-Downloader
cp .env.example .env
pnpm i
docker compose up -d redis db
pnpm prisma migrate deploy
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the page.

## 🙏 Credits

Kaizen is a complete evolution of the original [Kaizoku](https://github.com/oae/kaizoku) by [@oae](https://github.com/oae). Following the archiving and abandonment of the original project, Kaizen was created to maintain and improve the codebase, ensuring it remains compatible with modern environments and aesthetics.

Special thanks to [@metafates](https://github.com/metafates) for the incredible [mangal](https://github.com/metafates/mangal) downloader which powers the core of this application.
