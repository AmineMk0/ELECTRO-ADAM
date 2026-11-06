# Connexion administrateur

La page `/admin/login` utilise le logo existant du site et reste indépendante de
la navigation publique, du footer, du panier et du bouton WhatsApp. Le projet ne
contient pas de dossier `images/logo` ; le composant `BrandLogo` réutilise
`public/assets/logo-transparent.png`.

## Raccordement Laravel à prévoir

Définir `VITE_ADMIN_API_BASE_URL` dans un fichier `.env.local`, puis redémarrer
Vite (ou reconstruire le site). La valeur attendue est l'origine HTTP(S) du backend,
sans chemin, paramètres ni identifiants. Exemple local : `http://localhost:8000`.
Les variables `VITE_*` sont publiques : ne jamais y placer de secret.

Sans cette configuration, le formulaire affiche un message d'indisponibilité
après validation et n'envoie pas les identifiants. Il n'existe aucun compte de
démonstration, token inventé ou indicateur de connexion enregistré localement.

L'adaptateur `src/services/adminAuth.js` attend le contrat suivant :

1. `GET /sanctum/csrf-cookie` initialise le cookie `XSRF-TOKEN`.
2. `POST /login` reçoit `{ "email": "...", "password": "..." }`, avec le cookie
   de session et l'en-tête `X-XSRF-TOKEN` décodé. Réponse : `204`, ou JSON `2xx`.
3. `GET /api/admin/user` doit être protégé par `auth:sanctum` **et** une
   autorisation administrateur côté Laravel. Il doit répondre en JSON :

   ```json
   { "user": { "id": 1, "email": "admin@example.com", "is_admin": true } }
   ```

Le frontend redirige vers `/admin/dashboard` seulement après ces trois étapes
réussies et la vérification de cette réponse. La page dashboard est disponible ; le backend Laravel reste à implémenter. Le contrôle côté client ne remplace
jamais les autorisations côté serveur : toutes les futures routes admin doivent
être protégées dans Laravel.

Les réponses HTML (dont le fallback SPA), sessions non confirmées, utilisateurs
non administrateurs, erreurs `401/403/419/422/429`, pannes réseau et demandes de
double authentification ne déclenchent aucune redirection. Une double
authentification demanderait un écran complémentaire.

Configurer les domaines stateful de Sanctum, les cookies de session, CORS avec
credentials et les origines explicitement autorisées. Pour une SPA Sanctum, le
frontend et le backend doivent partager le même domaine racine ; inclure les
ports pour le développement local et utiliser le même nom d'hôte (`localhost`
des deux côtés, par exemple). Le cookie CSRF doit être lisible depuis le frontend.
Utiliser HTTPS en production, un cookie de session HttpOnly et un rate limit
côté serveur sur `/login`.

Référence : [documentation officielle Laravel Sanctum](https://laravel.com/framework/docs/12.x/sanctum#spa-authentication).


## Dashboard et prévisualisation locale

La route /admin/dashboard est isolée du storefront et protégée par AdminRoute.
Sans prévisualisation, elle vérifie GET /api/admin/user avant de rendre le contenu.
Une absence de configuration, un refus 401/403/419 ou un compte non administrateur
renvoie au Login. Les erreurs réseau/serveur et réponses invalides gardent le
contenu fermé et proposent une nouvelle tentative.

Pour examiner le design sans backend, définir VITE_ADMIN_DASHBOARD_PREVIEW=true
uniquement dans .env.local. La prévisualisation exige simultanément le mode DEV
et l'absence de VITE_ADMIN_API_BASE_URL. Elle est toujours désactivée dans un
build de production, même si le flag est true. Un bandeau visible précise qu'il
n'existe aucune session réelle. Aucun compte ou token de démonstration n'est créé.
Le fichier .env.local est ignoré par Git ; .env.example laisse le flag à false.

Les chiffres, commandes, produits et notifications fictifs sont regroupés dans
src/data/admin/dashboardDemo.js, sans lien avec les données publiques. Le bandeau
reste visible même avec une vraie session puisque les métriques ne sont pas
encore raccordées à MySQL. Les panneaux de la sidebar et les actions rapides
utilisent uniquement ces données temporaires. Les ajouts de produits restent en
mémoire pour la visite en cours et ne modifient jamais le catalogue public.

La déconnexion réelle utilise GET /sanctum/csrf-cookie puis POST /logout avec
X-XSRF-TOKEN et credentials include. Le backend doit invalider la session.
Une réponse 204, JSON 2xx ou un 401 confirmant l'absence de session renvoie au
Login ; une erreur maintient la page et affiche une possibilité de réessayer.
En prévisualisation, le bouton quitte uniquement la vue locale vers le Login.
La page Login et l'adaptateur authenticateAdmin existants restent inchangés.


## Gestion des commandes

/admin/orders réutilise AdminRoute, AdminLayout (sidebar/header/mobile/logout)
et OrdersTable. Le Dashboard conserve exactement son rendu ; ses liens vers les
commandes ouvrent désormais cette route. Les autres panneaux restent disponibles.

Les 128 commandes fictives proviennent de src/data/admin/ordersDemo.js.
Chaque DTO contient id, customer (id/name/phone/city/address), amount, currency,
status, created_at, payment_method, items et note. Les statistiques sont calculées
sur ces mêmes enregistrements. La recherche, les dates inclusives (fuseau
Africa/Casablanca), les statuts et la pagination utilisent src/utils/adminOrders.js.

Les changements de statut et ajouts restent dans l'état React de cette page.
Ils ne sont ni envoyés au serveur ni conservés après rechargement. L'impression
crée un document isolé RTL à partir du statut courant, avec le logo existant et
une mention de démonstration. Les textes clients passent par textContent ; aucun
HTML saisi par un client n'est interprété. Le document est retiré après impression.

Pour Laravel/MySQL, remplacer l'état fictif par un adaptateur serveur, avec :
- GET /api/admin/orders?search=&status=&from=&to=&page=1&per_page=5
- GET /api/admin/orders/{id}
- PATCH /api/admin/orders/{id}/status (JSON : status)
- POST /api/admin/orders pour la création manuelle éventuelle

Ces endpoints sont à implémenter et doivent imposer auth:sanctum et une
autorisation administrateur côté serveur. Le serveur doit valider les transitions
de statut et renvoyer les compteurs et métadonnées de pagination ; ne pas utiliser
la page courante seule pour calculer les totaux.

Vérifications métier : node --test tests/adminOrders.test.mjs
Build : npm.cmd run build


## Gestion des produits

/admin/products réutilise AdminRoute, AdminLayout, AdminDemoNotice et le composant
AdminPagination extrait de la page Commandes sans modifier son rendu. La sidebar
ouvre maintenant la nouvelle route Produits. Les autres pages restent inchangées.

Les 86 produits et 8 catégories fictifs sont dans src/data/admin/productsDemo.js.
Les compteurs proviennent des enregistrements : 78 produits ont du stock, dont 12
avec un stock faible (1 à 5 pièces), et 8 sont indisponibles. Le stock faible est
un sous-ensemble des disponibles ; les compteurs restent cohérents après un CRUD.
Le DTO produit contient id, reference, name, description, category_id, price,
promotional_price (nullable), stock, currency, images, created_at et updated_at.
Les helpers de recherche, validation et CRUD sont dans src/utils/adminProducts.js.

Les premiers visuels sont cadrés depuis desin/dash3.jpg. Ils sont uniquement des
images de démonstration. Le formulaire accepte jusqu'à 6 images JPEG/PNG/WebP/AVIF,
5 Mo par image, avec sélection de l'image principale et suppression d'une image.
Les fichiers choisis restent des objets File locaux avec des URL blob temporaires.
Les URL inutilisées sont libérées à la fermeture du formulaire, après suppression
ou au départ de la page. Aucun upload, changement du catalogue public ou stockage
persistant n'est effectué. Toute suppression nécessite une confirmation dédiée.

Pour Laravel/MySQL, remplacer cet état local par des réponses API autorisées :
- GET /api/admin/products?search=&category=&availability=&page=1&per_page=5
- GET /api/admin/products/{id}
- POST /api/admin/products (multipart/form-data pour les images)
- PATCH /api/admin/products/{id} (ou POST avec _method=PATCH pour multipart)
- DELETE /api/admin/products/{id}
- GET /api/admin/categories

Valider les références uniques, prix/promotions, quantités, fichiers et droits
côté serveur. Les URL blob et les descripteurs des images de démonstration ne
sont pas des fichiers distants : les remplacer par les images stockées par Laravel.
La vérification auth:sanctum et les permissions admin restent obligatoires pour
chaque endpoint ; ne jamais se fier uniquement au guard React.

Vérifications : node --test tests/adminProducts.test.mjs tests/adminOrders.test.mjs


## Gestion des catégories et association aux produits

/admin/categories réutilise le layout Admin, le guard, les modales, les actions de
ligne, le rendu d'images et la pagination. Les DTO fictifs sont dans
src/data/admin/categoriesDemo.js ; les validations et opérations sont dans
src/utils/adminCategories.js et les calculs hiérarchiques dans categoryTree.js.

La référence distingue 8 catégories principales (6 actives et 2 inactives) et
14 sous-catégories. Les statistiques principales concernent les racines ; le
sélecteur permet d'afficher les racines, les sous-catégories ou les 22 entrées.
Les nombres de produits sont calculés à partir des associations réelles du jeu
de démonstration, avec les descendants inclus, et ne sont pas des compteurs fixes.

Le DTO catégorie contient id, display_id, name, description, image, parent_id
(nullable), is_active (booléen), created_at et updated_at. Les IDs des huit racines
correspondent aux category_id déjà présents dans les produits fictifs. Les noms
sont uniques entre catégories sœurs ; les parents inexistants et cycles sont refusés.

AdminCatalogProvider partage les produits et catégories en mémoire entre les
routes Admin. Les catégories créées/renommées apparaissent immédiatement dans le
formulaire Produit et ses filtres. Une catégorie peut rester inactive tout en
étant associée à des produits dans l'administration ; aucun catalogue public
n'est modifié. Le statut ne modifie pas les quantités des produits.

La confirmation de suppression demande une catégorie de remplacement s'il existe
des produits directs ou des enfants. Produits et enfants directs sont réaffectés
atomiquement, sans IDs orphelins, sans cycles et sans doublons de noms entre frères.
Les descendants ne peuvent pas servir de destination. La suppression d'une catégorie
vide n'a pas besoin de réaffectation. Une annulation n'effectue aucune modification.

Les fichiers locaux restent des URL blob et objets File uniquement en mémoire.
Le provider conserve les images référencées entre pages Admin et libère celles
abandonnées, puis libère toutes les URL à la sortie de l'espace Admin. Les données
sont réinitialisées au rechargement ou après sortie de l'Admin : ni MySQL ni le
stockage local du navigateur ne sont utilisés.

Pour Laravel/MySQL, prévoir GET/POST /api/admin/categories et
GET/PATCH/DELETE /api/admin/categories/{id}, avec multipart pour les images.
Le DELETE doit recevoir un replacement_id quand nécessaire et réaliser les
réaffectations dans une transaction SQL. Imposer la validation de parent_id,
les contraintes d'intégrité, les permissions admin et la validation des images
côté serveur. Les autres pages publiques et le Login restent inchangés.

Tests : node --test tests/adminCategories.test.mjs tests/adminProducts.test.mjs tests/adminOrders.test.mjs

## Ajout détaillé d'un produit

`/admin/products/add` utilise la protection et le layout Admin existants. Un seul
formulaire présente tous les champs, sans onglets. Les catégories proviennent du
catalogue partagé, y compris celles créées pendant la session Admin.

Le bouton Enregistrer transmet au catalogue temporaire un DTO avec `name`,
`reference` (SKU unique), `category_id`, `brand`, `price`, `promotional_price`
(nullable), `stock`, `is_active`, `description_points: string[]`,
`specifications: { name, value }[]`, `package_contents: string[]`, et `images`.
Les images conservent leur objet File, leur ordre et `is_primary`; la première
détermine `primary_image_id`. Limite : 5 images, 5 MB chacune. Aucune limite de
nombre d'éléments pour les listes; les champs individuels ont une longueur maximale.
Un élément complet encore dans l'éditeur est inclus à l'enregistrement; une paire
de spécification incomplète bloque la sauvegarde sans effacer la saisie.

`saveFullDemoProduct` valide et conserve toutes ces données en mémoire. Le champ
`description` contient le premier point pour compatibilité avec l'ancienne liste
produits; `description_points` conserve la liste complète. Aucun appel réseau ni
stockage persistant n'est effectué. Le catalogue public reste indépendant.

`buildProductFormData` prépare le futur multipart Laravel : scalaires, listes
indexées, fichiers `images[i]`, `image_order[i]` et `image_is_primary[i]`.
Cet adaptateur refuse les images de démonstration et ne transmet aucune URL blob.
Il faudra le connecter au POST `/api/admin/products` et appliquer les validations
et autorisations côté Laravel avant l'utilisation réelle.

Vérifications : `node --test tests/*.test.mjs`,
`node tests/adminProductAddRender.mjs`, puis `npm.cmd run build`.
