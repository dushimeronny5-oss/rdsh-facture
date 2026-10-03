# 📑 Documentation Technique & Guide de Référence — FACTURE RDSH

> **Fichier généré pour les développeurs et agents IA**  
> Ce document fournit une vue d'ensemble complète, exhaustive et fidèle de l'application **FACTURE RDSH** (aussi identifiée comme `creatinf RDSH`) : ses fonctionnalités, son architecture de données, ses technologies, ses choix de conception et ses consignes d'évolution pour tout futur modèle IA.

---

## 1. 🌟 Vue d'ensemble du Projet

**FACTURE RDSH** est un logiciel SaaS moderne de **facturation professionnelle, gestion de clients et suivi de trésorerie**, spécialement optimisé pour les entreprises, PME et prestataires de services opérant au **Burundi** et dans la région est-africaine.

### Principales propositions de valeur :
- **Adaptation locale burundaise intégrale** : gestion native du Franc Burundais (**BIF / FBu**) sans centimes, intégration visuelle et fonctionnelle des canaux de paiement mobiles (**Lumicash**, **Ecocash**) et bancaires (**Interbank Burundi - IBB**), respect des mentions légales (**NIF**, **RC**) et du taux de TVA standard (15%).
- **Éditeur de facture interactif à double volet** : saisie en temps réel à gauche et rendu PDF imprimable instantané à droite.
- **Architecture de stockage hybride et résiliente (Dual-Layer Storage)** : synchronisation transparente avec **Supabase (PostgreSQL Cloud/Local)** lorsque configuré, doublée d'un **Fallback Store persistant** (singleton mémoire + fichier local `.custom_invoices.json`) permettant une utilisation complète et fluide même sans connexion ou sans Docker.
- **Expérience utilisateur Fintech soignée** : design haut de gamme avec palette Slate / Blue / Emerald, dark mode automatique/manuel, animations fluides, composants Radix UI et conformité mobile totale.

---

## 2. 🚀 Fonctionnalités Implémentées

### A. Tableau de Bord Financier (`/dashboard`)
1. **Cartes KPIs dynamiques** :
   - **Total encaissé** : somme des factures marquées comme `paid`.
   - **Facture en attente** : somme des factures envoyées en cours (`sent`) dont la date d'échéance n'est pas encore dépassée.
   - **En retard** : somme des factures envoyées dont la date d'échéance est antérieure à aujourd'hui (calculé selon le fuseau horaire `Africa/Bujumbura`).
   - **Total client** : nombre total de clients enregistrés dans l'application.
2. **Graphique de Trésorerie Mensuelle (Recharts)** :
   - Graphique linéaire/courbe double représentant la progression du volume facturé vs règlements encaissés mois par mois.
3. **Widget des Canaux de Paiement Locaux** :
   - Visualisation active des comptes marchands de l'entreprise : Lumicash Marchand, Ecocash Marchand, Virement IBB (Interbank Burundi).
4. **Tableau des Factures Récentes avec Pagination** :
   - Affichage paginé (jusqu'à 3 pages de navigation interactive), tri chronologique inverse, badges d'état colorés et liens rapides d'action.

### B. Gestion du Cycle de Vie des Factures (`/invoices`)
1. **Filtrage par onglets interactifs** :
   - Tous, Brouillons (`draft`), Envoyées (`sent`), En retard (`overdue`), Payées (`paid`).
   - Badges de comptage d'éléments en temps réel sur chaque onglet.
2. **Cycle de vie et transition d'états** :
   - `Brouillon (draft)` ➔ `Envoyée (sent)` ➔ `Payée (paid)`.
   - Statut dynamique `En retard (overdue)` calculé automatiquement si `status === 'sent'` et `due_date < date_du_jour`.
   - `Annulée (cancelled)` : archivage hors des calculs de trésorerie active.
3. **Actions contextuelles** :
   - Changement instantané de statut via Server Action (`updateInvoiceStatusAction`) avec rafraîchissement automatique (`revalidatePath`).

### C. Éditeur & Créateur de Factures (`/invoices/new`)
1. **Formulaire d'édition guidé** :
   - Sélection parmi les clients enregistrés avec auto-complétion immédiate (adresse, email, NIF).
   - Ajout dynamique d'un nouveau client directement dans le formulaire (créé automatiquement en base s'il n'existe pas).
   - Sélecteur de date innovant **Wheel Date Picker** (roulette tactile/cliquable pour jour/mois/année) pour la date d'émission et la date d'échéance.
   - Sélection des devises : **BIF (FBu)** par défaut, USD ($), EUR (€), CAD ($ CA).
   - Lignes de facturation modulaires : ajout, suppression, calcul automatique du montant unitaire * quantité.
   - Taux de TVA personnalisable (15% par défaut, configurable ou exonéré à 0%).
2. **Prévisualisation PDF en temps réel (`InvoicePdfPreview`)** :
   - Volet latéral synchronisé à chaque frappe de touche.
   - Respect scrupuleux des normes de facturation (coordonnées émetteur, client, mentions NIF/RC, tableau des lignes HT, TVA, Total TTC, consignes de règlement bancaire et mobile).
   - Bouton d'impression et d'export direct en PDF (`window.print` avec styles d'impression CSS `@media print` nettoyés sans header ni sidebar).

### D. Répertoire des Clients (`/clients`)
- Vue en grille (cartes modernes) de l'ensemble des clients.
- Affichage des NIF fiscaux, emails, téléphones, adresses physiques et villes.
- Avatars générés avec initiales aux couleurs de l'entreprise.

### E. Paramètres de l'Entreprise (`/settings`)
- Configuration des métadonnées de l'entreprise émettrice :
  - Raison sociale, NIF, RC (Registre de Commerce).
  - Coordonnées : Email, Téléphone, Adresse, Ville (Bujumbura), Pays (Burundi).
  - Paramètres financiers : Devise par défaut, Taux de TVA standard (15%), délai de paiement accordé (ex. 30 jours), préfixe des factures (`FAC`), prochain numéro séquentiel.
  - Instructions de paiement et mentions légales en pied de facture.

### F. Navigation & Accessibilité (A11y)
- **Desktop** : Sidebar latérale persistante avec navigation intuitive et indicateur de page active.
- **Mobile** : Header sticky avec menu hamburger, backdrop avec flou d'arrière-plan, tiroir slide-over animé fermable au clic sur un lien ou sur la croix.
- Attributs ARIA complets : `role="dialog"`, `aria-label`, `aria-expanded`, gestion du focus.
- Support du Dark Mode avec bascule instantanée.

### G. Landing Page d'Accueil & Vitrine SaaS (`/`)
- Point d'entrée public de l'application accessible sans redirection forcée vers `/login`.
- Architecture modulaire complète dans `components/landing/` :
  - `LandingNavbar` : Barre de navigation sticky avec flou d'arrière-plan, logo avec badge "Afrique", liens d'ancrage et menu drawer mobile responsive.
  - `LandingHero` : En-tête percutant avec micro-animations flottantes (`animate-float-slow`, `animate-pulse-glow`), CTA principal animé au survol et au clic, preuve sociale multi-villes et maquette dynamique de facture SaaS avec widget de trésorerie mensuelle.
  - `LandingStats` : 3 métriques clés de conversion (15 000+ factures, conformité TVA, paiements 3x plus rapides).
  - `LandingProblems` : 3 cartes de friction (factures artisanales, erreurs de TVA, retards de paiement).
  - `LandingFeatures` : 4 cartes de fonctionnalités fintech (multi-devises FCFA, BIF, $, €, CAD, conformité fiscale, suivi temps réel, annuaire clients).
  - `LandingHowItWorks` : Parcours d'onboarding en 3 étapes claires (inscription, création facture, encaissement).
  - `LandingTestimonials` : Témoignages vérifiés d'entrepreneurs africains avec notation 5 étoiles.
  - `LandingPricing` : Sélecteur réactif multi-devises avec bascule facturation annuelle (-20%) et formules Gratuit / Pro ⭐ / Business.
  - `LandingCta` : Bannière de conversion finale avec halo lumineux et badges de réassurance (support 7j/7, conformité légale).
  - `LandingFooter` : Pied de page complet avec liens, réseaux et mention "Fait avec fierté en Afrique 🌍".
- Fichier de style dédié sans styles inline : [`app/landing.css`](file:///c:/Users/User/Downloads/facture%20RDSH/app/landing.css).

---

## 3. 🛠️ Stack Technique & Dépendances

| Couche | Technologie / Bibliothèque | Utilisation principale |
| :--- | :--- | :--- |
| **Framework Web** | Next.js 14 (v14.2.35) | App Router, Server Components, Server Actions |
| **Langage** | TypeScript 5 | Typage strict et modèles de données |
| **Styling** | Tailwind CSS v3 | Design system sur mesure, utilitaires CSS, Dark Mode |
| **Composants Primitifs**| Radix UI (`@radix-ui/react-*`) | Dialog, Dropdown, Tabs, Select, Separator, Slot |
| **Icônes** | Lucide React | Iconographie moderne et vectorielle |
| **Graphiques** | Recharts v3 | Courbes d'évolution du chiffre d'affaires et encaissements |
| **Dates & Heures** | date-fns v4 & Intl | Formatage des dates en français, timezones |
| **Base de Données** | Supabase / PostgreSQL | Tables `organizations`, `clients`, `invoices`, `invoice_items` |
| **Client Supabase** | `@supabase/ssr` & `@supabase/supabase-js` | Clients serveur et navigateur avec gestion des cookies |
| **Validation** | Zod v4 | Validation des schémas d'environnement et données |
| **Notifications** | Sonner | Toasts d'alerte et de confirmation d'action |
| **Tests** | Vitest v5 & React Testing Library | Tests unitaires (calculs, statuts, interactions) |
| **Polices** | Geist Sans & Geist Mono | Typographie moderne optimisée |

---

## 4. 📁 Structure des Fichiers et Dossiers

```text
facture-rdsh/
├── app/
│   ├── (app)/                       # Groupe de routes sous layout applicatif (avec Sidebar)
│   │   ├── clients/
│   │   │   └── page.tsx             # Page Annuaire Clients (grille de clients)
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Tableau de bord principal (stats, chart, factures)
│   │   ├── invoices/
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # Page de création de facture (formulaire + PDF preview)
│   │   │   └── page.tsx             # Liste filtrable des factures
│   │   ├── settings/
│   │   │   └── page.tsx             # Page des paramètres d'entreprise
│   │   └── layout.tsx               # Layout applicatif avec intégration de la Sidebar
│   ├── actions/
│   │   └── invoices.ts              # Server Actions (création facture, mise à jour statut)
│   ├── globals.css                  # Variables CSS, thème Tailwind, styles print
│   ├── layout.tsx                   # Root HTML layout avec polices Geist et Toaster
│   └── page.tsx                     # Racine du site -> redirection automatique vers /dashboard
│
├── components/
│   ├── dashboard/
│   │   ├── dashboard-invoices-table.tsx # Tableau paginé des factures récentes
│   │   ├── revenue-chart.tsx        # Courbe Recharts facturé vs encaissé
│   │   └── stat-card.tsx            # Carte KPI (fintech aesthetic)
│   ├── invoices/
│   │   ├── invoice-form.tsx         # Grand formulaire de saisie réactif (2 volets)
│   │   ├── invoice-pdf-preview.tsx  # Aperçu visuel de la facture A4 / Export PDF
│   │   └── status-badge.tsx         # Badge de statut (couleurs selon état)
│   ├── layout/
│   │   └── sidebar.tsx              # Sidebar desktop + drawer mobile responsive & accessible
│   ├── settings/
│   │   └── settings-form.tsx        # Formulaire d'édition des infos entreprise
│   └── ui/                          # Composants UI atomiques (Button, Input, Card, Dialog, WheelPicker...)
│
├── lib/
│   ├── currency.ts                  # Définition des devises (BIF, USD, EUR, CAD) et décimales
│   ├── env.ts                       # Validation des variables d'environnement avec Zod
│   ├── format.ts                    # Formatage monétaire (FBu sans centimes) et dates (français)
│   ├── types.ts                     # Interfaces TypeScript (Invoice, Client, Organization, Stats)
│   ├── utils.ts                     # Helper cn() (clsx + tailwind-merge)
│   ├── data/
│   │   ├── clients.ts               # Récupération et écriture des clients (Supabase / Mock)
│   │   ├── dashboard.ts             # Calcul des statistiques globales du dashboard
│   │   ├── invoices.ts              # CRUD et requêtes factures (Supabase / Mock)
│   │   └── organization.ts          # Récupération et sauvegarde des données de l'organisation
│   ├── i18n/
│   │   └── fr.ts                    # Dictionnaires et libellés français
│   ├── invoice/
│   │   ├── calc.ts                  # Moteur pur de calcul comptable BIF / TVA / Totaux
│   │   └── status.ts                # Logique de calcul du statut 'overdue' selon Bujumbura GMT+2
│   ├── mock/
│   │   ├── .custom_invoices.json    # Persistance fichier locale des factures hors Supabase
│   │   └── store.ts                 # Store in-memory singleton de secours avec jeu de démo complet
│   └── supabase/
│       ├── client.ts                # Client Supabase pour Client Components (navigateur)
│       ├── is-configured.ts         # Détection intelligente si Supabase Cloud/Local est configuré
│       └── server.ts                # Client Supabase pour Server Components & Server Actions
│
├── supabase/
│   ├── config.toml                  # Configuration du CLI Supabase local
│   └── schema.sql                   # Schéma SQL complet PostgreSQL (tables, index, RLS, seeds)
│
├── tests/
│   └── unit/
│       ├── calc.test.ts             # Tests unitaires des calculs de facturation
│       ├── invoice-creation.test.ts # Tests d'intégration création de facture & mise à jour stats
│       ├── mobile-sidebar.test.tsx  # Tests du drawer mobile et de l'accessibilité
│       └── status.test.ts           # Tests du calcul dynamique des retards (Bujumbura)
│
├── .env.example                     # Exemple de variables d'environnement
├── .env.local                       # Configuration locale (Supabase URL, Anon Key, App URL)
├── package.json                     # Dépendances et scripts de build/test/dev
├── tailwind.config.ts               # Configuration du thème, animations et polices Tailwind
├── tsconfig.json                    # Configuration du compilateur TypeScript
└── vitest.config.ts                 # Configuration de Vitest avec environnement JSDOM
```

---

## 5. 📐 Règles Métier & Choix de Conception Critiques

### A. Règle du Franc Burundais (BIF / FBu)
- Le Franc Burundais **ne comporte pas de centimes**.
- Tous les montants en BIF manipulés dans l'application sont obligatoirement **des nombres entiers**.
- La fonction `calculateInvoice` dans [`lib/invoice/calc.ts`](file:///c:/Users/User/Downloads/facture%20RDSH/lib/invoice/calc.ts) utilise `Math.round()` à chaque étape :
  - `ligne = Math.round(quantité * prixUnitaire)`
  - `sousTotal = somme(lignes)`
  - `taxe = Math.round((sousTotal * tauxTVA) / 100)`
  - `total = sousTotal + taxe`
- Le formatage monétaire [`lib/format.ts`](file:///c:/Users/User/Downloads/facture%20RDSH/lib/format.ts) applique le pattern standardisé : `1 250 000 FBu`.

### B. Fuseau Horaire & Calcul du Retard de Paiement
- Le fuseau horaire de référence est **`Africa/Bujumbura` (GMT+2)**.
- Une facture stockée avec le statut `sent` devient visuellement **`overdue` (En retard)** si et seulement si :
  `due_date < date_actuelle_à_Bujumbura`.
- Les factures `draft`, `paid` ou `cancelled` ne passent **jamais** en retard, même si leur date d'échéance est passée.

### C. Architecture Dual-Storage (Supabase + Fallback Store)
- Pour garantir un développement fluide sans obliger l'utilisateur à démarrer Docker ou avoir une connexion active permanente, l'application utilise une détection automatique via `isSupabaseConfigured()` ([`lib/supabase/is-configured.ts`](file:///c:/Users/User/Downloads/facture%20RDSH/lib/supabase/is-configured.ts)) :
  1. Si des clés valides Supabase Cloud ou locales sont renseignées dans `.env.local`, les Server Actions et requêtes écrivent et lisent en priorité dans Supabase PostgreSQL.
  2. En cas d'absence de configuration ou d'erreur réseau, le système bascule immédiatement sans crash sur le store interne `mockStore` avec persistance locale dans [`lib/mock/.custom_invoices.json`](file:///c:/Users/User/Downloads/facture%20RDSH/lib/mock/.custom_invoices.json).

### D. Prévisualisation et Impression PDF
- L'aperçu [`InvoicePdfPreview`](file:///c:/Users/User/Downloads/facture%20RDSH/components/invoices/invoice-pdf-preview.tsx) adopte un ratio A4 professionnel.
- L'impression via `window.print()` est accompagnée de classes CSS utilitaires :
  - `.no-print` : masque la sidebar, le header et les boutons de navigation.
  - Le titre du document HTML est temporairement ajusté (`FAC-2026-XXXX_NomClient.pdf`) lors de l'impression pour nommer automatiquement le fichier lors de la sauvegarde PDF du navigateur.

---

## 6. 🤖 Consignes et Instructions pour un Futur Modèle IA

Si vous êtes un modèle IA invité à modifier, étendre ou déboguer ce projet, veuillez respecter impérativement les règles suivantes :

1. **Vérification de l'état du serveur de dev** :
   - Avant de tester un lien ou une page, vérifiez si le serveur tourne sur `http://localhost:3000`.
   - Lancez-le si nécessaire avec `npm run dev`.

2. **Préservation du Dual-Storage** :
   - Lorsque vous ajoutez une nouvelle entité ou modifiez une Server Action, implémentez systématiquement les deux voies : la requête Supabase ET la méthode miroir dans `mockStore`.
   - Ne cassez jamais le fallback local.

3. **Respect strict des calculs monétaires** :
   - Pour toute manipulation de montants en BIF, n'introduisez jamais de décimales ou de centimes. Utilisez toujours `calculateInvoice()` ou `Math.round()`.
   - Conservez les tests unitaires de [`tests/unit/calc.test.ts`](file:///c:/Users/User/Downloads/facture%20RDSH/tests/unit/calc.test.ts) au vert.

4. **Exécution systématique des tests et du typecheck** :
   - Après toute modification de code :
     ```bash
     npm run typecheck
     npm run test
     ```
   - Tous les tests Vitest (calculs, statuts, création de facture, accessibilité sidebar) doivent être exécutés et passer avec succès.

5. **Design System & A11y** :
   - N'utilisez pas de styles ad-hoc désordonnés. Réutilisez les tokens Tailwind et les composants existants dans `components/ui/`.
   - Assurez-vous que les éléments interactifs possèdent des `aria-label`, `aria-expanded` appropriés et restent navigables au clavier et sur mobile.
   - Préservez les adaptations culturelles burundaises (Lumicash, Ecocash, FBu, NIF, RC, Bujumbura).

---

*Document maintenu pour la continuité du projet **FACTURE RDSH**.*
