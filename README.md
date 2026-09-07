# Abricot

Abricot est une application collaborative de gestion de projets et de tâches.

Le projet est composé de deux parties :

- `OCR-P7` : frontend développé avec Next.js ;
- [`P7BACKEND`](https://github.com/OpenClassrooms-Student-Center/dev-react-P10) : API développée avec Express, TypeScript et Prisma.

## Prérequis

- Node.js 20 ou supérieur ;
- npm ;
- Git.

Les dossiers `OCR-P7` et [`P7BACKEND`](https://github.com/OpenClassrooms-Student-Center/dev-react-P10) doivent être installés séparément.


## Installation du backend

Les instructions d'installation du backend sont sur le [repo GitHub du projet](https://github.com/OpenClassrooms-Student-Center/dev-react-P10)

L’API est disponible sur [http://localhost:8000](http://localhost:8000) et sa documentation sur [http://localhost:8000/api-docs](http://localhost:8000/api-docs).

## Installation du frontend

Cloner le frontend :

```bash
git clone https://github.com/Xety/OCR-P7.git
```

Depuis le dossier `OCR-P7` :

```bash
npm install
```

Copier `.env.example` vers `.env.local` :

```env
API_BASE_URL=http://localhost:8000
```

Démarrer le frontend :

```bash
npm run dev
```

L’application est disponible sur [http://localhost:3000](http://localhost:3000).

## Compte de démonstration

Après avoir exécuté le seed du backend :

```text
Email : alice@example.com
Mot de passe : P@ssword123
```

## Vérifications

Depuis le dossier `OCR-P7` :

```bash
npm run lint
npm run build
```
