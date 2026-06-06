# Documentation des Modèles - Faso Agri

Ce document liste l'ensemble des modèles de données utilisés dans l'application Faso Agri, ainsi que leurs attributs et méthodes principales. Ces modèles sont situés dans le dossier `lib/data/models/`.

---

## 1. Announcement (Annonce)
**Fichier:** `announcement.dart`

**Attributs:**
- `id` (String)
- `title` (String)
- `description` (String)
- `type` (AnnouncementType)
- `category` (String)
- `status` (AnnouncementStatus)
- `price` (String)
- `province` (String)
- `location` (String)
- `eventDate` (String?)
- `startDate` (DateTime?)
- `endDate` (DateTime?)
- `authorId` (String)
- `authorName` (String)
- `authorPhone` (String)
- `hasImage` (bool) - *Indique si au moins une image existe.*
- `imageCount` (int) - *Nombre total d'images.*
- `likes` (int)
- `isLiked` (bool)
- `views` (int)
- `contacts` (int)
- `createdAt` (DateTime)

**Méthodes & Getters:**
- `Announcement.fromFirestore(DocumentSnapshot doc)` : Constructeur d'usine (factory) depuis Firestore.
- `toFirestore()` : Convertit l'objet en Map pour Firestore.
- `relativeDate` (String) : Retourne le temps écoulé depuis la création (ex: "Il y a 2h").
- `validityRange` (String?) : Retourne la période de validité (ex: "12 fév. 2026 → 15 fév. 2026").
- `isCurrentlyValid` (bool) : Vérifie si l'annonce est valide à la date actuelle.
- `isActive` (bool) : Vérifie si le statut est actif.
- `copyWith(...)` : Crée une copie de l'objet avec de nouvelles valeurs.

---

## 2. AppNotification (Notification)
**Fichier:** `app_notification.dart`

**Attributs:**
- `id` (String)
- `title` (String)
- `message` (String)
- `category` (NotificationCategory)
- `isRead` (bool)
- `createdAt` (DateTime)

**Méthodes & Getters:**
- `AppNotification.fromFirestore(DocumentSnapshot doc)` : Constructeur d'usine depuis Firestore.
- `relativeTime` (String) : Retourne le temps écoulé depuis la création.
- `copyWith(...)` : Crée une copie de l'objet.

---

## 3. Discussion
**Fichier:** `discussion.dart`

**Attributs:**
- `id` (String)
- `title` (String)
- `description` (String)
- `category` (String)
- `authorId` (String)
- `authorName` (String)
- `tags` (List<String>)
- `replies` (int)
- `views` (int)
- `likes` (int)
- `isPinned` (bool)
- `createdAt` (DateTime)
- `lastActivity` (DateTime)
- `hasImage` (bool)
- `isLiked` (bool) - *Uniquement côté client.*

**Méthodes & Getters:**
- `Discussion.fromFirestore(DocumentSnapshot doc)` : Constructeur d'usine depuis Firestore.
- `toFirestore()` : Convertit l'objet en Map pour Firestore.
- `relativeDate` (String) : Retourne le temps écoulé depuis la création.
- `lastActivityRelative` (String) : Retourne le temps écoulé depuis la dernière activité.
- `copyWith(...)` : Crée une copie de l'objet.

---

## 4. PracticalInfoItem (Information Pratique)
**Fichier:** `practical_info.dart`

**Attributs:**
- `id` (String)
- `title` (String)
- `description` (String)
- `content` (String)
- `category` (InfoCategory?)
- `author` (String)
- `tags` (List<String>)
- `readMinutes` (int)
- `createdAt` (DateTime)
- `isFavorite` (bool)

**Méthodes & Getters:**
- `PracticalInfoItem.fromFirestore(DocumentSnapshot doc, {bool isFavorite})` : Constructeur d'usine depuis Firestore.
- `readTime` (String) : Retourne le temps de lecture formaté (ex: "3 min de lecture").
- `relativeDate` (String) : Retourne le temps écoulé depuis la création.
- `copyWith(...)` : Crée une copie de l'objet.

*(Note : Ce fichier contient également un `PracticalInfoService` pour la gestion des informations pratiques et favoris).*

---

## 5. Product (Produit)
**Fichier:** `product.dart`

**Attributs:**
- `id` (String)
- `title` (String)
- `description` (String)
- `category` (ProductCategory)
- `status` (ProductStatus)
- `price` (String)
- `province` (String)
- `location` (String)
- `authorId` (String)
- `authorName` (String)
- `authorPhone` (String)
- `hasImage` (bool)
- `imageCount` (int)
- `likes` (int)
- `isLiked` (bool)
- `expirationDate` (DateTime?)
- `createdAt` (DateTime)

**Méthodes & Getters:**
- `Product.fromFirestore(DocumentSnapshot doc)` : Constructeur d'usine depuis Firestore.
- `toFirestore()` : Convertit l'objet en Map pour Firestore.
- `relativeDate` (String) : Retourne le temps écoulé depuis la création.
- `expirationLabel` (String?) : Retourne la date d'expiration formatée.
- `isExpired` (bool) : Vérifie si le produit est expiré.
- `isActive` (bool) : Vérifie si le statut est actif.
- `copyWith(...)` : Crée une copie de l'objet.

---

## 6. Reply (Réponse à une discussion)
**Fichier:** `reply.dart`

**Attributs:**
- `id` (String)
- `discussionId` (String)
- `authorId` (String)
- `authorName` (String)
- `content` (String)
- `hasImage` (bool)
- `isExpert` (bool)
- `likes` (int)
- `isLiked` (bool) - *Uniquement côté client.*
- `createdAt` (DateTime)

**Méthodes & Getters:**
- `Reply.fromFirestore(DocumentSnapshot doc)` : Constructeur d'usine depuis Firestore.
- `toFirestore()` : Convertit l'objet en Map pour Firestore.
- `relativeDate` (String) : Retourne le temps écoulé depuis la création.
- `initials` (String) : Retourne l'initiale du nom de l'auteur.
- `copyWith(...)` : Crée une copie de l'objet.

---

## 7. Settings (Paramètres)
**Fichier:** `settings.dart`

**Attributs:**
- `notificationsEnabled` (bool)
- `language` (String)
- `lastUpdated` (DateTime?)

**Méthodes & Getters:**
- `Settings.fromJson(Map<String, dynamic> json)` : Constructeur d'usine depuis du JSON.
- `toJson()` : Convertit l'objet en Map (JSON).
- `defaultSettings` (static) : Retourne les paramètres par défaut.
- `copyWith(...)` : Crée une copie de l'objet.
- `languageDisplay` (String) : Affiche le nom complet de la langue (ex: "Français").
- `toString()` : Retourne une représentation JSON de l'objet en chaîne.

---

## 8. User (Utilisateur)
**Fichier:** `user.dart`

**Attributs:**
- `id` (String?)
- `phone` (String)
- `firstName` (String)
- `lastName` (String)
- `email` (String?)
- `username` (String?)
- `residence` (String)
- `role` (UserRole)
- `roles` (List<UserRole>?)
- `password` (String)
- `createdAt` (DateTime?)
- `updatedAt` (DateTime?)
- `avatarUrl` (String?)
- `savedPosts` (List<String>?)
- `followers` (List<String>?)
- `following` (List<String>?)
- `authProvider` (String) - *ex: 'phone', 'google', 'facebook'*

**Méthodes & Getters:**
- `formattedPhone` (String) : Téléphone formaté avec l'indicatif "+226".
- `fullName` (String) : Prénom et Nom complets.
- `roleDisplay` (String) : Nom affiché du rôle.
- `isSocialAccount` (bool) : Vérifie s'il s'agit d'un compte social (Google/Facebook).
- `domain` et `domainValue` (String?) : Getters pour le domaine (liés au rôle).
- `generateUsername()` (String) : Génère un nom d'utilisateur aléatoire.
- `toFirestore()` : Convertit l'objet en Map pour Firestore.
- `User.fromJson(Map<String, dynamic> json)` : Constructeur d'usine depuis JSON.
- `User.fromFirestore(String documentId, Map<String, dynamic> data)` : Constructeur d'usine depuis Firestore.
- `copyWith(...)` : Crée une copie de l'objet.
- `toString()` : Retourne une représentation JSON de l'objet.
- `User.fromSignUpForm(Map<String, dynamic> formData)` (static) : Crée un utilisateur depuis les données du formulaire d'inscription.
- `validateUserData(Map<String, dynamic> data)` (static) : Valide les données utilisateur requises.

---

## 9. Weather (Météo)
**Fichier:** `weather.dart`

**Attributs:**
- `town` (String)
- `currentTemperature` (double)

**Méthodes & Getters:**
- `Weather.fromJson(Map<String, dynamic> json)` : Constructeur d'usine depuis JSON.
- `toJson()` : Convertit l'objet en Map (JSON).
- `copyWith(...)` : Crée une copie de l'objet.
- `toString()` : Représentation sous forme de chaîne (ex: "Weather(town: ..., currentTemperature: ...)").
