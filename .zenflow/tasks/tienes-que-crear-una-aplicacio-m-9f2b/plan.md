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
- `src/navigation/RootNavigator.tsx` — tab bar amagada (`display: 'none'`), FloatingMenu és el nav
- `src/components/VideoPlayer.tsx` — pantalla completa en girar el mòbil (expo-screen-orientation)

### [x] Step 4: Components
- `src/components/FloatingMenu.tsx` — posició inicial basada en dimensions de pantalla
- `src/components/NowPlayingBar.tsx` — thumbnail, títol, llista activa, botó pausa, estrella favorit, botó editor
- `src/components/VideoEditorModal.tsx` — nou: afegir vídeo amb URL/títol/descripció + selecció de llistes
- `src/components/FavoriteListsEditorModal.tsx` — nou: gestió de llistes favorites (afegir per ID, crear nova)

### [x] Step 5: Pantalles
- `src/screens/AuthLandingScreen.tsx` — logo + botons estilitzats
- `src/screens/HomeScreen.tsx` — càrrega des de Firebase, info de vídeo, lista de favorits, pull-to-refresh
- `src/screens/ListsScreen.tsx` — cerca, toggle favorit, modal detall de llista amb vídeos
- `src/screens/UserScreen.tsx` — camps editables (nom, telèfon), guardar a Firebase

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
