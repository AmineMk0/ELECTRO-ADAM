# Publication GitHub et déploiement Vercel

Le site utilise React 19, Vite 7, Tailwind CSS 4 et React Router avec
`BrowserRouter`. Le code du site n'a pas été modifié pour le déploiement.

## Configuration prête

- Installation reproductible : `npm ci` avec `package-lock.json`.
- Build : `npm run build`.
- Répertoire publié : `dist`.
- Framework Vercel : Vite.
- Réécriture des routes vers `/index.html` dans `vercel.json`.
- `.gitignore` exclut les dépendances, le build, les fichiers d'environnement,
  les credentials habituels et les fichiers locaux de Vercel.
- `.env.example` est un modèle vide qui peut être versionné.
- Les images importées depuis `desin/` doivent être versionnées avec le code.

Documentation : https://vercel.com/docs/frameworks/frontend/vite

## État de cette préparation

Le build de production réussit. Git a été initialisé sur une branche locale
`main`, mais cette session n'autorise pas l'écriture de `.git/config` ni la
création de `.git/index.lock`. La connexion Git HTTPS à GitHub échoue également.
La page publique GitHub indique un dépôt vide au moment de la vérification,
mais aucun historique distant n'a pu être récupéré par Git. Le dépôt distant
n'a pas pu être configuré localement, et aucun commit ni push n'a été effectué
par cette session. Revérifier l'état distant avant la publication.

## Publier le code depuis un terminal disposant des accès nécessaires

Ouvrir PowerShell dans le dossier du projet. Sur Windows, utiliser `npm.cmd`
si l'exécution des scripts PowerShell est désactivée.

1. Vérifier l'état du dépôt et la branche :

   ```powershell
   git status
   git branch --show-current
   git remote -v
   ```

2. Si `origin` n'existe pas, l'ajouter :

   ```powershell
   git remote add origin https://github.com/AmineMk0/ELECTRO-ADAM.git
   ```

   Si `origin` existe déjà, vérifier son URL avant toute modification.

3. Inspecter les fichiers exclus et préparer le commit :

   ```powershell
   git status --short --ignored
   git add -- .gitignore .env.example README.md DEPLOYMENT.md package.json package-lock.json index.html vite.config.js vercel.json src public desin
   git diff --cached --stat
   git diff --cached --check
   ```

   Vérifier les fichiers préparés et leur contenu avant le commit. Ne jamais
   inclure de mot de passe, token, clé privée ou fichier `.env` réel.

   ```powershell
   git commit -m "Prepare ELECTRO ADAM storefront for Vercel deployment"
   ```

4. Récupérer l'historique GitHub avant le push :

   ```powershell
   git fetch origin
   git branch --remotes
   git log --oneline --all --graph -20
   ```

   Si `origin/main` existe, intégrer son historique par une fusion :

   ```powershell
   git merge origin/main --allow-unrelated-histories
   ```

   Cette fusion conserve les deux historiques. En cas de conflits, examiner
   chaque fichier, conserver les changements souhaités, puis terminer la fusion
   avec `git add` et `git commit`. Ne pas sélectionner automatiquement une
   version pour tous les fichiers. Si seule une autre branche distante existe,
   examiner son historique et fusionner cette branche avant de publier `main`.
   Si le dépôt distant est vide, aucune fusion n'est nécessaire.

5. Construire puis pousser normalement :

   ```powershell
   npm run build
   git push -u origin main
   ```

   Ne pas utiliser de force-push. Si Git refuse le push parce que GitHub contient
   de nouveaux commits, récupérer et fusionner ces commits avant de réessayer.

## Connecter GitHub à Vercel

1. Se connecter à https://vercel.com/new avec son compte GitHub.
2. Autoriser l'accès au dépôt `AmineMk0/ELECTRO-ADAM`, puis l'importer.
3. Choisir la racine du dépôt comme Root Directory et le preset **Vite**.
   Le fichier `vercel.json` définit `npm ci`, `npm run build` et `dist`.
4. Facultatif : ajouter `VITE_WHATSAPP_NUMBER` avec le numéro professionnel
   international, chiffres uniquement, dans les variables d'environnement Vercel.
   Les variables `VITE_*` sont publiques dans le navigateur : ne jamais y placer
   de secret. Sans numéro configuré, le comportement actuel reste inchangé.
5. Lancer le déploiement et vérifier le journal de build.
6. Dans les paramètres du projet, vérifier la connexion GitHub, puis
   **Environments > Production > Branch Tracking** : sélectionner `main`.
7. Tester l'accueil, les images, les liens et l'actualisation directe de
   `/catalogue`, `/info/returns` et `/info/payment`.

Après cette connexion, un push sur `main` déclenche un déploiement de production.
Les autres branches produisent normalement des déploiements de prévisualisation.
Il n'est pas nécessaire d'ajouter un workflow GitHub Actions ni un token Vercel
au dépôt pour ce fonctionnement.

Documentation : https://vercel.com/docs/git

## Mises à jour suivantes

Après vérification des fichiers modifiés :

```powershell
git add -- chemin/du/fichier-modifie
git commit -m "Décrire la modification"
git push origin main
```
