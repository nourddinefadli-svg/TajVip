# LUMIÈRE — Client Scheduling App
### Documentation & Setup Guide

---

## Ce que fait cette app

**LUMIÈRE** est une application web single-page premium pour agences de voyage et entreprises de services. Elle tourne entièrement dans le navigateur avec Firebase comme backend.

**Stack :** HTML + CSS + Vanilla JS + Firebase v10  
**Aucun build tool requis** — un seul fichier `index.html`

---

## Structure des fichiers

```
lumiere-app/
└── index.html    ← Toute l'app (un seul fichier)
```

---

## Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🔐 Login | Accès par mot de passe (rôle unique) |
| 👤 Ajouter un client | Formulaire modal : nom, téléphone, pays, fichier |
| 🗂 Fiches clients | Cards glassmorphism avec toutes les infos |
| 📅 Assigner une date | Date unique ou plage de dates via mini-calendrier |
| 📆 Dashboard Calendrier | Vue mensuelle avec clients par jour |
| 🔍 Recherche & Filtre | Par nom, téléphone, pays |
| 🔥 Firebase Sync | Firestore temps réel + Storage pour les fichiers |
| 📱 Responsive | Desktop-first, optimisé mobile |

---

## Configuration Firebase (étape par étape)

### Étape 1 — Créer un projet Firebase

1. Aller sur [https://console.firebase.google.com](https://console.firebase.google.com)
2. Cliquer **Add project** → nommer le projet (ex: `lumiere-scheduling`)
3. Désactiver Google Analytics si non nécessaire → **Create project**

---

### Étape 2 — Activer Firestore

1. Dans la console Firebase → **Firestore Database**
2. Cliquer **Create database**
3. Choisir **Start in test mode**
4. Sélectionner votre région → **Done**

---

### Étape 3 — Activer Storage

1. Dans la console Firebase → **Storage**
2. Cliquer **Get started**
3. Choisir **Start in test mode** → **Done**

---

### Étape 4 — Enregistrer une Web App

1. Console Firebase → **Project Overview** → icône `</>` (web)
2. Nommer l'app (ex: `lumiere-web`)
3. Cliquer **Register app**
4. **Copier** l'objet `firebaseConfig` affiché

---

### Étape 5 — Coller la config dans index.html

Ouvrir `index.html` et trouver ce bloc (vers la ligne 60) :

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Remplacer avec votre vraie config. Exemple :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCxxx...",
  authDomain: "lumiere-app.firebaseapp.com",
  projectId: "lumiere-app",
  storageBucket: "lumiere-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

---

### Étape 6 — Changer le mot de passe de l'app

Dans `index.html`, trouver :

```javascript
const APP_PASSWORD = "lumiere2025"; // ← Change this!
```

Remplacer par un mot de passe fort et privé.

---

## Structure des données Firestore

L'app utilise **une seule collection** : `clients`

### Document client (exemple)

```json
{
  "firstName": "Sofia",
  "lastName": "Laurent",
  "phone": "+33 6 12 34 56 78",
  "country": "France",
  "notes": "VIP client",
  "hasAttachment": true,
  "attachmentName": "ticket_paris.pdf",
  "attachmentURL": "https://firebasestorage.googleapis.com/...",
  "createdAt": "<Firestore Timestamp>",
  "reservations": [
    {
      "id": "1700000000000",
      "start": "2025-03-10",
      "end": "2025-03-15",
      "status": "confirmed",
      "notes": "Vol PX244"
    }
  ]
}
```

### Valeurs de statut des réservations

| Valeur | Signification |
|---|---|
| `pending` | En attente (défaut) |
| `confirmed` | Confirmée |
| `cancelled` | Annulée |

---

## Règles de sécurité Firestore recommandées

Une fois l'app stable, remplacer les règles **test mode** par :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clients/{clientId} {
      allow read, write: if true; // Sécurisé par mot de passe dans l'app
    }
  }
}
```

> ⚠️ Pour une sécurité maximale à l'avenir : activer Firebase Authentication et lier les règles à un `uid`.

---

## Règles de sécurité Storage recommandées

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /attachments/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

---

## Mode démo (sans Firebase)

Si Firebase n'est **pas encore configuré**, l'app fonctionne automatiquement en **mode démo local** avec 3 clients pré-chargés. Toutes les données sont en mémoire (perdues au rechargement).

Pour activer Firebase, il suffit de coller la vraie config — aucune autre modification n'est nécessaire.

---

## Déploiement

### Option A — Firebase Hosting (recommandé)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Public directory: . (ou le dossier contenant index.html)
# Single-page app: Yes
firebase deploy
```

### Option B — Netlify (drag & drop)

1. Aller sur [https://app.netlify.com](https://app.netlify.com)
2. Glisser-déposer le dossier `lumiere-app/` dans la zone de déploiement
3. L'URL publique est générée instantanément

### Option C — GitHub Pages

1. Pousser le dossier sur un repo GitHub
2. Settings → Pages → Source: `main` branch → `/ (root)`
3. L'app est accessible sur `https://username.github.io/repo-name`

---

## Évolutions futures possibles

| Fonctionnalité | Comment l'ajouter |
|---|---|
| Authentification multi-utilisateurs | Activer Firebase Auth + règles Firestore par `uid` |
| Notifications email | Intégrer Firebase Functions + SendGrid |
| Export PDF des réservations | Ajouter la lib `jsPDF` dans le `<head>` |
| Vue hebdomadaire du calendrier | Ajouter un mode d'affichage `week` dans `renderCalendar()` |
| Statuts colorés sur le calendrier | Mapper les couleurs par statut dans les `cal-client-chip` |
| Multi-langue | Extraire les strings dans un objet `i18n` |

---

## Résumé rapide

```
1. Créer projet Firebase
2. Activer Firestore + Storage (test mode)
3. Copier firebaseConfig dans index.html
4. Changer APP_PASSWORD dans index.html
5. Ouvrir index.html dans un navigateur
6. ✅ L'app est opérationnelle
```

---

*LUMIÈRE © 2025 — Luxury Client Scheduling Platform*
