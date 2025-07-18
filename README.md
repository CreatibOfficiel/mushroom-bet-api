# 🍄 Mushroom Bet API

Une API NestJS pour un système de paris sur Mario Kart avec gestion des skins et personnages.

## ⚡ Quick Start

```bash
# Clone + Setup en une commande
git clone <repository-url> && cd mushroom-bet-api && npm run setup

# L'API sera disponible sur http://localhost:3001
# Tests : npm run test:e2e
```

## 📋 Table des matières

- [Description](#description)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation rapide](#installation-rapide)
- [Installation manuelle](#installation-manuelle)
- [Utilisation](#utilisation)
- [Tests](#tests)
- [API Endpoints](#api-endpoints)
- [Base de données](#base-de-données)
- [Scripts disponibles](#scripts-disponibles)
- [Développement](#développement)

## 📖 Description

Cette API permet de gérer un système de paris sur Mario Kart avec :

- **Gestion des skins** : 127 skins de personnages Mario Kart disponibles
- **Système de joueurs** : Gestion des utilisateurs avec skins associés
- **Base de données** : PostgreSQL avec Prisma ORM
- **Tests** : Tests unitaires et e2e complets
- **Docker** : Environnement de développement containerisé

## 🛠 Technologies utilisées

- **Backend** : NestJS (Node.js + TypeScript)
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Conteneurisation** : Docker & Docker Compose
- **Tests** : Jest
- **Validation** : class-validator & class-transformer
- **Code quality** : ESLint, Prettier, Husky

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

## 🚀 Installation rapide

Pour les nouveaux développeurs qui clonent le projet pour la première fois :

```bash
# 1. Cloner le repository
git clone <repository-url>
cd mushroom-bet-api

# 2. Lancer le setup automatique (fait TOUT automatiquement)
npm run setup
```

Le script `npm run setup` va automatiquement :

- ✅ Créer le fichier `.env` depuis `.env.example` (si inexistant)
- ✅ Installer toutes les dépendances
- ✅ Démarrer les services Docker (PostgreSQL)
- ✅ Créer les bases de données (`mushroom` et `mushroom_test`)
- ✅ Appliquer toutes les migrations Prisma
- ✅ Seeder les deux bases avec 127 skins Mario Kart
- ✅ Générer le client Prisma

**C'est tout !** Votre environnement est prêt en une seule commande.

## 🔧 Installation manuelle

Si vous préférez faire étape par étape :

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer les services Docker
npm run docker:up

# 3. Attendre que PostgreSQL soit prêt (environ 10 secondes)

# 4. Créer les bases de données
npm run setup:db

# 5. Appliquer les migrations
npm run db:migrate
npm run db:test:migrate

# 6. Seeder les bases de données
npm run db:seed
npm run db:test:seed

# 7. Générer le client Prisma
npx prisma generate
```

## 🎯 Utilisation

### Démarrer l'application

```bash
# Mode développement (avec hot reload)
npm run start:dev

# Mode production
npm run start:prod

# Mode debug
npm run start:debug
```

L'API sera accessible sur : **http://localhost:3001**

### Vérifier que tout fonctionne

```bash
# Tester l'endpoint principal
curl http://localhost:3001

# Tester l'endpoint des skins
curl http://localhost:3001/skins
```

## 🧪 Tests

### Tests unitaires

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:cov
```

### Tests e2e (end-to-end)

```bash
# Lancer les tests e2e
npm run test:e2e
```

**Note** : Les tests e2e utilisent automatiquement la base `mushroom_test` qui est créée lors du setup.

## 🔗 API Endpoints

### Skins

| Méthode | Endpoint                 | Description              |
| ------- | ------------------------ | ------------------------ |
| `GET`   | `/skins`                 | Récupérer tous les skins |
| `GET`   | `/skins?character=MARIO` | Filtrer par personnage   |
| `POST`  | `/skins`                 | Créer un nouveau skin    |
| `POST`  | `/skins/bulk`            | Créer plusieurs skins    |

### Exemples

```bash
# Récupérer tous les skins
curl http://localhost:3001/skins

# Filtrer les skins de Mario
curl http://localhost:3001/skins?character=MARIO

# Créer un nouveau skin
curl -X POST http://localhost:3001/skins \
  -H "Content-Type: application/json" \
  -d '{"name": "Mario Fire", "character": "MARIO"}'
```

## 🗄️ Base de données

### Structure

```sql
-- Enum des personnages disponibles
enum Character {
  MARIO, LUIGI, PEACH, DAISY, ROSALINA, PAULINE,
  YOSHI, BIRDO, TOAD, TOADETTE,
  BABY_MARIO, BABY_LUIGI, BABY_PEACH, BABY_DAISY, BABY_ROSALINA,
  METAL_MARIO, PINK_GOLD_PEACH, GOLD_MARIO,
  WARIO, WALUIGI, DONKEY_KONG, DIDDY_KONG, BOWSER, BOWSER_JR,
  DRY_BONES, DRY_BOWSER, KING_BOO, PETEY_PIRANHA,
  KOOPA_TROOPA, SHY_GUY, LAKITU, TOADSWORTH, HAMMER_BRO,
  BOOMERANG_BRO, FIRE_BRO, ICE_BRO,
  KAMEK, MAGIKOOPA, CHARGIN_CHUCK, WIGGLER, SPIKE,
  INKLING_BOY, INKLING_GIRL, LINK, VILLAGER_BOY, VILLAGER_GIRL,
  ISABELLE, CAPTAIN_FALCON, ZERO_SUIT_SAMUS
}

-- Table des skins
model Skin {
  id        Int       @id @default(autoincrement())
  name      String
  character Character
  players   Player[]
}

-- Table des joueurs
model Player {
  id           String  @id @default(cuid())
  email        String  @unique
  passwordHash String
  displayName  String?
  skinId       Int?
  skin         Skin?   @relation(fields: [skinId], references: [id])
}
```

### Commandes Prisma utiles

```bash
# Voir l'état de la base de données
npx prisma studio

# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Réinitialiser la base de données
npx prisma migrate reset

# Générer le client Prisma
npx prisma generate
```

## 📝 Scripts disponibles

| Script                 | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `npm run setup`        | **Setup complet automatique** (recommandé pour nouveaux devs) |
| `npm run setup:db`     | Créer uniquement les bases de données                         |
| `npm run reset`        | **Reset complet de l'environnement** (supprime tout)          |
| `npm run start:dev`    | Démarrer en mode développement                                |
| `npm run build`        | Compiler l'application                                        |
| `npm test`             | Lancer les tests unitaires                                    |
| `npm run test:e2e`     | Lancer les tests e2e                                          |
| `npm run lint`         | Vérifier le code avec ESLint                                  |
| `npm run format`       | Formater le code avec Prettier                                |
| `npm run db:migrate`   | Appliquer les migrations                                      |
| `npm run db:seed`      | Seeder la base principale                                     |
| `npm run db:test:seed` | Seeder la base de test                                        |
| `npm run docker:up`    | Démarrer les services Docker                                  |
| `npm run docker:down`  | Arrêter les services Docker                                   |

## 🔧 Développement

### Structure du projet

```
mushroom-bet-api/
├── src/
│   ├── app.module.ts          # Module principal
│   ├── main.ts                # Point d'entrée
│   ├── prisma/                # Configuration Prisma
│   └── skin/                  # Module des skins
├── prisma/
│   ├── schema.prisma          # Schéma de base de données
│   ├── seed.ts                # Script de seeding
│   └── migrations/            # Migrations
├── test/                      # Tests e2e
├── scripts/                   # Scripts de setup
│   ├── setup.sh               # Setup complet automatique
│   ├── setup-db.sh            # Création des bases de données
│   └── reset.sh               # Reset de l'environnement
├── .env.example               # Template des variables d'environnement
├── .env                       # Variables d'environnement (auto-créé)
├── docker-compose.dev.yml     # Configuration Docker
└── Dockerfile                 # Image Docker
```

### Variables d'environnement

Le projet inclut un fichier `.env.example` avec toutes les variables nécessaires. Le script `npm run setup` copie automatiquement ce fichier vers `.env`.

Pour configuration manuelle :

```bash
# Copier le template
cp .env.example .env

# Puis éditer .env si nécessaire
```

**Variables principales :**

- `DATABASE_URL` : Base de données principale
- `DATABASE_URL_TEST` : Base de données de test
- `PORT` : Port de l'API (défaut: 3001)
- `NODE_ENV` : Environnement (development/production)

**Note** : Les valeurs par défaut dans `.env.example` fonctionnent parfaitement avec Docker Compose.

### Hooks Git

Le projet utilise Husky pour les hooks Git :

- **pre-commit** : Lint et format du code
- **commit-msg** : Validation des messages de commit (Conventional Commits)

### Ajout de nouvelles fonctionnalités

1. Créer une nouvelle branche : `git checkout -b feature/ma-feature`
2. Développer la fonctionnalité
3. Ajouter des tests
4. Vérifier que tout passe : `npm test && npm run test:e2e`
5. Créer une pull request

## 🐛 Dépannage

### Problèmes courants

**Docker n'est pas démarré :**

```bash
# Vérifier l'état de Docker
docker info

# Redémarrer Docker Desktop si nécessaire
```

**Base de données non créée :**

```bash
# Recréer les bases de données
npm run setup:db
```

**Client Prisma obsolète :**

```bash
# Régénérer le client
npx prisma generate
```

**Ports occupés :**

```bash
# Vérifier les ports utilisés
lsof -i :3001  # Port API
lsof -i :5432  # Port PostgreSQL
```

### Logs utiles

```bash
# Logs de l'application
npm run start:dev

# Logs Docker
docker-compose -f docker-compose.dev.yml logs -f

# Logs PostgreSQL
docker-compose -f docker-compose.dev.yml logs -f db
```

## 📞 Support

Pour toute question ou problème :

1. Vérifier cette documentation
2. Consulter les logs d'erreur
3. Tenter `npm run setup` pour réinitialiser l'environnement

---

**Happy coding! 🚀**
