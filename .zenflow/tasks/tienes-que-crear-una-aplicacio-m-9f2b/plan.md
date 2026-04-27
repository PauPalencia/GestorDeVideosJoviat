# Pla d'implementació - Gestor de Vídeos

## Implementació completa

### [x] Step 1: Tipus, utilitats i context global
- `src/types/models.ts` — Video amb `listIds`, `ownerUid`, `description`; VideoList amb `memberUids`
- `src/utils/video.ts` — `extractThumbnail` per YouTube, `buildEmbedUrl` amb autoplay
- `src/context/PlayerContext.tsx` — estat global: currentVideo, activeList, allLists, isPlaying, refreshLists
- `App.tsx` — afegit `PlayerProvider`

### [x] Step 2: Firebase service
- `src/services/firebaseService.ts` — afegits: `fetchFavoriteVideos`, `fetchListById`, `getVideoById`, `createList`, `addMemberToList`, `addVideoIdToList`, `removeVideoIdFromList`, `updateVideoLists`, `updateUserData`, refactored `createVideo`

### [x] Step 3: Navegació i VideoPlayer
- `src/components/VideoPlayer.tsx` — pantalla completa en girar el mòbil (expo-screen-orientation)
- `src/components/FloatingMenu.tsx` — usa `useRouter` d'expo-router internament (sense props)

### [x] Step 4: Components
- `src/components/NowPlayingBar.tsx` — thumbnail, títol, llista activa, botó pausa, estrella favorit, botó editor
- `src/components/VideoEditorModal.tsx` — nou: afegir vídeo amb URL/títol/descripció + selecció de llistes
- `src/components/FavoriteListsEditorModal.tsx` — nou: gestió de llistes favorites (afegir per ID, crear nova)

### [x] Step 5: Pantalles
- `src/screens/HomeScreen.tsx` — càrrega des de Firebase, info de vídeo, lista de favorits, pull-to-refresh
- `src/screens/ListsScreen.tsx` — cerca, toggle favorit, modal detall de llista amb vídeos
- `src/screens/UserScreen.tsx` — camps editables (nom, telèfon), guardar a Firebase

### [x] Step 6: Migració a expo-router
- `package.json` — `"main": "expo-router/entry"`, expo-router ~4.0.0 afegit a dependencies
- `babel.config.js` — `'react-compiler': false` per evitar error de compiler-runtime
- `app.json` — afegit `scheme` i `web.bundler`
- `tsconfig.json` — `extends: "expo/tsconfig.base"`, path alias `@/*`
- `app/_layout.tsx` — root layout amb providers i AuthGate
- `app/(auth)/_layout.tsx` — Stack layout per auth
- `app/(auth)/index.tsx` — pantalla inicial (2 botons)
- `app/(auth)/login.tsx` — login amb popup de contrasenya oblidada
- `app/(auth)/register.tsx` — registre amb terms modal
- `app/(tabs)/_layout.tsx` — Stack layout (sense tab bar, FloatingMenu navega)
- `app/(tabs)/index.tsx` — HomeScreen
- `app/(tabs)/lists.tsx` — ListsScreen
- `app/(tabs)/user.tsx` — UserScreen
- `npm install --legacy-peer-deps` — dependències instal·lades

## Estructura Firebase necessària

### Col·lecció: `users/{uid}`
```
{
  uid: string,
  email: string,
  displayName: string,
  phone: string,
  createdAt: Timestamp
}
```

### Col·lecció: `lists/{listId}`
```
{
  title: string,
  description: string,
  coverUrl: string,           // URL de la imatge de portada (pot estar buit)
  ownerUid: string,
  memberUids: string[],       // UIDs dels usuaris que tenen accès
  isFavorite: boolean,
  videoIds: string[],         // IDs dels vídeos que pertanyen a la llista
  createdAt: Timestamp
}
```

### Col·lecció: `videos/{videoId}`
```
{
  title: string,
  description: string,
  url: string,                // URL original de YouTube o Instagram
  thumbnailUrl: string,       // URL de la miniatura (extreta automàticament per YouTube)
  source: 'youtube' | 'instagram',
  listIds: string[],          // IDs de les llistes a les que pertany + 'favorites' si és favorit
  ownerUid: string,
  authorName: string,
  authorAvatarUrl: string,
  duration: string,
  createdAt: Timestamp
}
```

## Índexs compostos de Firestore necessaris

A la consola de Firebase > Firestore > Índexos, crea aquests índexos compostos:

1. **Col·lecció `lists`**:
   - Camp 1: `memberUids` (Arrays)
   - Camp 2: `createdAt` (Descendent)

2. **Col·lecció `videos`**:
   - Camp 1: `listIds` (Arrays)
   - Camp 2: `createdAt` (Descendent)

3. **Col·lecció `videos`**:
   - Camp 1: `ownerUid` (Ascending)
   - Camp 2: `listIds` (Arrays)
   - Camp 3: `createdAt` (Descendent)
