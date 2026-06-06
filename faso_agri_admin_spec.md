# Faso Agri – Spécification des modules Admin

**Stack :** Nuxt 3 · Firebase (Firestore, Auth, FCM) · Pinia

---

## M1 · Authentification

**Objectif :** Sécuriser l'accès au backoffice via Firebase Auth avec gestion des rôles.

### Fonctionnalités
- Connexion par email/mot de passe (Firebase Auth)
- Claim personnalisé `role: "admin"` ou `role: "superadmin"` stocké dans Firestore
- Middleware Nuxt (`/middleware/admin.ts`) protégeant toutes les routes `/admin/**`
- Déconnexion avec redirection vers `/login`
- Page de connexion dédiée (`/admin/login`)

### Structure Firestore
```
users/{uid}
  ├── email: string
  ├── role: "admin" | "superadmin"
  ├── displayName: string
  └── createdAt: timestamp
```

### Composable clé
```ts
// composables/useAuth.ts
const { user, signIn, signOut, isAdmin } = useAuth()
```

---

## M2 · Tableau de bord

**Objectif :** Vue d'ensemble de la plateforme avec indicateurs clés en temps réel.

### Fonctionnalités
- Compteurs : utilisateurs actifs, produits publiés, événements à venir, sujets de forum actifs
- Graphique d'évolutions (inscriptions par mois)
- Liste des 5 dernières publications (tous types confondus)
- Alertes : comptes signalés, contenus en attente de modération

### Données Firestore (requêtes agrégées)
```
stats/global
  ├── totalUsers: number
  ├── totalProducts: number
  ├── totalEvents: number
  └── totalForumTopics: number
```

---

## M3 · Utilisateurs

**Objectif :** Gérer les comptes agriculteurs et autres utilisateurs de la plateforme.

### Fonctionnalités
- Liste paginée avec recherche (nom, email, région)
- Détail d'un profil : infos, historique d'activité, statut du compte
- Actions : activer / désactiver / supprimer un compte
- Attribution de rôle (admin uniquement pour `superadmin`)
- Export CSV de la liste

### Structure Firestore
```
users/{uid}
  ├── displayName: string
  ├── email: string
  ├── phone: string
  ├── region: string         // ex : "Centre", "Hauts-Bassins"
  ├── role: string
  ├── status: "active" | "disabled"
  └── createdAt: timestamp
```

---

## M4 · Catalogue – Produits & Événements

Ce module regroupe deux sous-sections accessibles depuis la même navigation.

---

### M4a · Produits

**Objectif :** Gérer le catalogue des produits agricoles disponibles sur la plateforme.

#### Fonctionnalités
- Liste avec filtres (catégorie, statut, région)
- Création / modification / archivage d'un produit
- Upload image (encodée en base64, stockée dans Firestore)
- Prix en FCFA
- Catégories : intrants, semences, matériels, produits récoltés

#### Structure Firestore
```
products/{productId}
  ├── name: string
  ├── category: string
  ├── description: string
  ├── price: number          // en FCFA
  ├── imageBase64: string
  ├── region: string
  ├── status: "published" | "draft" | "archived"
  ├── createdBy: uid
  └── createdAt: timestamp
```

---

### M4b · Événements

**Objectif :** Publier et gérer les événements agricoles (foires, formations, marchés).

#### Fonctionnalités
- Création / modification / suppression d'événements
- Champs : titre, description, date, lieu, image, lien d'inscription
- Statut : brouillon / publié / terminé
- Filtres par date et région

#### Structure Firestore
```
events/{eventId}
  ├── title: string
  ├── description: string
  ├── date: timestamp
  ├── location: string
  ├── region: string
  ├── imageBase64: string
  ├── registrationLink: string
  ├── status: "draft" | "published" | "ended"
  ├── createdBy: uid
  └── createdAt: timestamp
```

---

## M5 · Forums

**Objectif :** Modérer les discussions entre utilisateurs de la plateforme.

### Fonctionnalités
- Liste des sujets avec : titre, auteur, date, nombre de réponses, statut
- Consulter le fil d'un sujet complet
- Épingler / désépingler un sujet
- Fermer un sujet (plus de nouvelles réponses)
- Supprimer un sujet ou un message signalé
- Tableau de modération : liste des contenus signalés

### Structure Firestore
```
forumTopics/{topicId}
  ├── title: string
  ├── content: string
  ├── authorId: uid
  ├── status: "open" | "closed" | "pinned"
  ├── replyCount: number
  ├── reported: boolean
  └── createdAt: timestamp

forumReplies/{replyId}
  ├── topicId: string
  ├── content: string
  ├── authorId: uid
  ├── reported: boolean
  └── createdAt: timestamp
```

---

## M6 · Publications

**Objectif :** Permettre à l'administrateur de créer et diffuser du contenu éditorial vers les utilisateurs.

### Fonctionnalités
- Éditeur de contenu riche (texte, image, lien)
- Types de publication : actualité, conseil agricole, alerte, annonce
- Statut : brouillon / publié / archivé
- Ciblage par région (ou diffusion nationale)
- Envoi d'une notification push FCM à la publication
- Liste des publications avec filtres (type, statut, date)
- Prévisualisation avant publication

### Structure Firestore
```
publications/{pubId}
  ├── title: string
  ├── body: string           // HTML ou Markdown
  ├── type: "news" | "advice" | "alert" | "announcement"
  ├── imageBase64: string
  ├── targetRegion: string | "all"
  ├── status: "draft" | "published" | "archived"
  ├── sendNotification: boolean
  ├── createdBy: uid
  ├── publishedAt: timestamp
  └── createdAt: timestamp
```

### Notification FCM (Cloud Function déclenchée à la publication)
```ts
// functions/src/onPublish.ts
export const onPublicationPublished = functions.firestore
  .document('publications/{pubId}')
  .onUpdate(async (change) => {
    const after = change.after.data()
    if (after.status === 'published' && after.sendNotification) {
      await admin.messaging().sendToTopic(after.targetRegion, {
        notification: { title: after.title, body: after.body.slice(0, 100) }
      })
    }
  })
```

---

## Structure des routes Nuxt

```
pages/admin/
  ├── login.vue
  ├── index.vue              # Tableau de bord
  ├── users/
  │   ├── index.vue          # Liste utilisateurs
  │   └── [uid].vue          # Détail profil
  ├── catalog/
  │   ├── products/
  │   │   ├── index.vue
  │   │   └── [id].vue
  │   └── events/
  │       ├── index.vue
  │       └── [id].vue
  ├── forum/
  │   ├── index.vue          # Liste sujets + modération
  │   └── [topicId].vue
  └── publications/
      ├── index.vue
      └── [id].vue           # Éditeur
```

---

## Composables partagés

| Composable | Rôle |
|---|---|
| `useAuth()` | Gestion session Firebase Auth |
| `useFirestore(collection)` | CRUD générique Firestore |
| `useStats()` | Lecture agrégats tableau de bord |
| `useNotifications()` | Envoi FCM via Cloud Function |
| `usePagination()` | Pagination Firestore (startAfter) |

---

*Document généré pour le projet Faso Agri – Yaangré Tech*
