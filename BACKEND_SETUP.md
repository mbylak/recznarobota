# Backend CMS - uruchomienie

## 1) Instalacja backendu

Przejdz do folderu `backend` i zainstaluj zaleznosci:

```bash
npm install
```

Skopiuj plik:

```bash
cp .env.example .env
```

W `.env` ustaw minimum:

- `JWT_SECRET` (wlasny losowy sekret)
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` lub bezpieczniej `ADMIN_PASSWORD_HASH`

## 2) Start API

```bash
npm run dev
```

Domyslnie backend dziala na:

- `http://localhost:4000`

Endpointy:

- `POST /api/auth/login`
- `GET /api/content`
- `PUT /api/content` (wymaga `Authorization: Bearer <token>`)

## 3) Podlaczenie frontendu

Frontend (`recznarobota.js`) czyta API z:

- `VITE_API_URL` (jesli ustawione)
- w przeciwnym razie `http://localhost:4000`

## 4) Dostep z innej sieci

Aby panel dzialal poza lokalna siecia:

1. Wystaw backend na serwerze VPS lub hostingu (Node.js).
2. Ustaw publiczny adres, np. `https://cms.twojadomena.pl`.
3. W frontendzie ustaw `VITE_API_URL=https://cms.twojadomena.pl`.
4. W backendzie ustaw `FRONTEND_ORIGIN` na domene strony.
5. Wlacz HTTPS (certyfikat SSL) i silne haslo admina.
