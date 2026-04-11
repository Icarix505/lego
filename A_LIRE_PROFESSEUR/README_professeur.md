# README professeur

Bonjour,

Je mets ici quelques explications pour lancer mon projet, avec quelques captures d'écran, au cas où jamais il y aurait un petit problème au lancement que ce soit à cause du cookie ou autre

Je préfère préciser aussi que je m'excuse pour ne pas avoir réussi à faire le déploiement sur la solution de déploiement demandée. J'ai essayé, mais certaines fonctionnalités ne fonctionnaient pas correctement une fois dans ce cadre, donc j'ai préféré laisser une version locale qui fonctionne normalement mieux.

---

## 1. Idée générale du projet

Le projet a pour but de récupérer des informations sur des sets LEGO depuis Internet, puis de les afficher dans une interface web.

Il y a en gros deux parties principales :

- une partie de scraping / récupération de données depuis des sites web ;
- une partie API + interface pour afficher les deals et les ventes.

---

## 2. scraping d'un site de type Dealabs

Dans un premier temps, j'ai travaillé sur le scraping d'un site de type Dealabs, pour récupérer des offres LEGO.

Capture d'écran correspondante :

![Scraping Dealabs](./dealabs_scraping.png)

---


## 3. Lancement du projet

### Pour lancer le site

Il faut se placer dans le dossier `server`, puis lancer :

```bash
node sandbox_v2.js https://www.dealabs.com/groupe/lego
```

Ensuite, il faut ouvrir le site dans le navigateur (par exemple Google Chrome / Google) à l'adresse locale affichée.

### Pour lancer l'API

Il faut lancer :

```bash
node api.js
```

---

## 4. À propos du cookie

Si jamais le cookie ne marche pas, il peut être nécessaire de le changer / de le remplacer dans le code avec une valeur valide.

c'est dans vinted.js, la première ligne dans les guillemets vous pouvez le changer

## 5. Excuses pour l'étape 5

Je m'excuse encore pour le fait de ne pas avoir pu faire un déploiement propre sur la plateforme demandée.

j'ai eu pas mal de pb avec les fonction boot notamment qui ne se lancent pas et la page html qui bug quand lancer toute seule
