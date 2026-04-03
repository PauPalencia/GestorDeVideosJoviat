# Gestor de vídeos (React Native + Expo + Firebase)

Aplicació mòbil base que compleix el flux del teu disseny:
- Login/Register amb recuperació de contrasenya i modal de termes.
- Pantalla principal amb reproductor, favorits i editor per afegir vídeos.
- Pantalla d'usuari amb dades del compte i logout.
- Pantalla de llistes amb cercador, crear llista i marcar com a favorita.
- Menú flotant morat arrossegable amb 3 accessos ràpids.

## 1) Instal·lació

```bash
npm install
npm run start
```

## 2) Configuració Firebase

Edita `src/firebase/config.ts` amb les dades reals del teu projecte Firebase.

### Col·leccions recomanades (Cloud Firestore)

#### `users/{uid}`
```json
{
  "uid": "abc123",
  "email": "user@mail.com",
  "displayName": "user",
  "phone": "+34123456789",
  "createdAt": "timestamp"
}
```

#### `lists/{listId}`
```json
{
  "title": "Favorits",
  "description": "Llista principal",
  "coverUrl": "https://...",
  "createdAt": "timestamp",
  "ownerUid": "abc123",
  "memberUids": ["abc123"],
  "isFavorite": true,
  "videoIds": ["video1", "video2"]
}
```

#### `videos/{videoId}`
```json
{
  "title": "Nom vídeo",
  "url": "https://www.youtube.com/watch?v=...",
  "thumbnailUrl": "https://img.youtube.com/...",
  "duration": "10:04",
  "authorName": "Canal/autor",
  "source": "youtube",
  "ownerUid": "abc123",
  "listIds": ["favorites", "llistaX"],
  "createdAt": "timestamp"
}
```

## 3) Regles mínimes Firestore (proposta)

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    match /lists/{listId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.ownerUid;
    }

    match /videos/{videoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.ownerUid;
    }
  }
}
```

## 4) Notes d'arquitectura

- El menú flotant és un component reutilitzable (`FloatingMenu`) i es mostra a totes les pantalles principals.
- El reproductor fa servir `react-native-webview` per incrustar YouTube i URLs compatibles.
- La pantalla Home inclou un modal tipus “editor” per afegir vídeos ràpidament a favorits.
- Quan no hi ha dades, es mostren estats buits com al mockup.

