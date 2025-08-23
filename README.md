# Job Board MVP

Eine vollständige Job-Board-Anwendung mit Node.js/Express Backend und Next.js Frontend.

## 🚀 Features

### Benutzerrollen
- **Admin**: Kann Companies, Jobs und User verwalten
- **Company**: Kann eigene Jobs erstellen, bearbeiten und löschen
- **User**: Kann Jobs suchen, Details sehen und sich bewerben

### Backend Features
- JWT-basierte Authentifizierung
- Role-basierte Autorisierung
- File-Upload für CVs (PDF)
- RESTful API mit Express
- PostgreSQL-Datenbank mit Prisma ORM
- Validierung und Error Handling

### Frontend Features
- Moderne UI mit Tailwind CSS
- Responsive Design
- Role-gesteuerte Navigation
- File-Upload für Bewerbungen
- Toast-Benachrichtigungen

## 📁 Projektstruktur

```
job-board/
├── server/                 # Backend
│   ├── src/
│   │   ├── controllers/   # Business Logic
│   │   ├── middleware/    # Auth & Upload Middleware
│   │   ├── routes/        # API Routes
│   │   ├── utils/         # Utilities
│   │   └── index.js       # Server Entry Point
│   ├── prisma/            # Database Schema
│   ├── uploads/           # File Uploads
│   └── package.json
├── client/                # Frontend
│   ├── src/
│   │   ├── app/          # Next.js Pages
│   │   ├── components/   # React Components
│   │   └── utils/        # Utilities
│   └── package.json
└── README.md
```

## 🛠️ Installation

### Voraussetzungen
- Node.js (v16 oder höher)
- PostgreSQL
- npm oder yarn

### Backend Setup

1. **Datenbank einrichten**
```bash
# PostgreSQL-Datenbank erstellen
createdb job_board_db
```

2. **Backend-Dependencies installieren**
```bash
cd server
npm install
```

3. **Umgebungsvariablen konfigurieren**
```bash
# .env Datei erstellen (basierend auf env.example)
cp env.example .env
# DATABASE_URL und JWT_SECRET anpassen
```

4. **Datenbank-Migrationen ausführen**
```bash
npm run migrate
```

5. **Testdaten laden**
```bash
npm run seed
```

6. **Server starten**
```bash
npm run dev
```

### Frontend Setup

1. **Frontend-Dependencies installieren**
```bash
cd client
npm install
```

2. **Frontend starten**
```bash
npm run dev
```

## 🔧 API Endpoints

### Authentifizierung
- `POST /api/auth/register` - Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden
- `GET /api/auth/me` - Aktuellen Benutzer abrufen

### Companies (Admin)
- `GET /api/companies` - Alle Companies abrufen
- `GET /api/companies/:id` - Company Details
- `POST /api/companies` - Company erstellen
- `PUT /api/companies/:id` - Company bearbeiten
- `DELETE /api/companies/:id` - Company löschen

### Jobs
- `GET /api/jobs` - Jobs suchen (öffentlich)
- `GET /api/jobs/:id` - Job Details (öffentlich)
- `GET /api/jobs/company/my-jobs` - Eigene Jobs (Company/Admin)
- `POST /api/jobs` - Job erstellen (Company/Admin)
- `PUT /api/jobs/:id` - Job bearbeiten (Company/Admin)
- `DELETE /api/jobs/:id` - Job löschen (Company/Admin)

### Applications
- `GET /api/applications/my-applications` - Eigene Bewerbungen (User)
- `GET /api/applications/job/:jobId` - Job-Bewerbungen (Company/Admin)
- `POST /api/applications/jobs/:jobId/apply` - Bewerbung einreichen (User)
- `DELETE /api/applications/:id` - Bewerbung löschen

## 👥 Test Accounts

Nach dem Ausführen von `npm run seed` stehen folgende Test-Accounts zur Verfügung:

- **Admin**: admin@jobboard.com / admin123
- **Company**: company@jobboard.com / company123
- **User**: user@jobboard.com / user123

## 🎨 Frontend Pages

- `/` - Homepage mit Job-Suche
- `/login` - Login-Seite
- `/register` - Registrierungs-Seite
- `/dashboard` - Dashboard (rolle-basiert)
- `/jobs/:id` - Job-Details mit Bewerbungsformular
- `/applications` - Bewerbungsübersicht (User)
- `/company/jobs` - Job-Verwaltung (Company)
- `/admin/companies` - Company-Verwaltung (Admin)

## 🔒 Sicherheit

- JWT-basierte Authentifizierung
- Role-basierte Autorisierung
- Password-Hashing mit bcrypt
- Input-Validierung
- File-Type-Validierung für Uploads
- CORS-Konfiguration
- Helmet für Security-Headers

## 📝 Datenmodell

### User
- id, name, email, password, role, createdAt, updatedAt

### Company
- id, name, description, logoUrl, createdAt, updatedAt

### Job
- id, title, description, location, companyId, createdAt, updatedAt

### Application
- id, userId, jobId, cvUrl, appliedAt

## 🚀 Deployment

### Backend
```bash
cd server
npm install
npm run build
npm start
```

### Frontend
```bash
cd client
npm install
npm run build
npm start
```

## 🛠️ Entwicklung

### Backend Scripts
- `npm run dev` - Development Server
- `npm run migrate` - Database Migrationen
- `npm run seed` - Testdaten laden
- `npm run generate` - Prisma Client generieren

### Frontend Scripts
- `npm run dev` - Development Server
- `npm run build` - Production Build
- `npm run start` - Production Server

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📄 License

MIT License - siehe LICENSE Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:
1. Überprüfe die Dokumentation
2. Schaue in die Issues
3. Erstelle ein neues Issue mit detaillierter Beschreibung

---

**Entwickelt mit ❤️ für moderne Job-Boards** 