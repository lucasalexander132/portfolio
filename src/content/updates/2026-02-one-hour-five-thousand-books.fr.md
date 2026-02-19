---
title: "Une heure, cinq mille livres"
date: "2026-02"
tag: "case-study"
summary: "La librairie de ma copine devait classifier 5 000+ livres par origine pour une certification gouvernementale. J'ai construit un outil pour qu'elle n'ait pas a le faire a la main."
link:
  url: "https://maisondesfeuilles.ca/"
  label: "La Maison Des Feuilles"
---

La Maison Des Feuilles vient de demenager. Nouvel espace, nouveau depart -- et une montagne de logistique qui vient avec. Ma copine est proprietaire de la librairie, et en parallele du demenagement elle travaillait a obtenir l'agrement, une certification qui permet aux librairies independantes de vendre aux ecoles et universites au Quebec. Une des exigences, cependant, c'est qu'au moins un tiers de l'inventaire doit etre constitue de livres quebecois.

Elle avait scanne plus de 5 000 livres. Elle avait besoin de savoir lesquels comptaient.

## Le probleme

Le processus de certification ne vous donne pas un tableur magique. Le plan etait de passer chaque ISBN un par un, chercher l'editeur via Memento (l'outil de reference utilise dans le milieu du livre au Quebec), identifier si l'editeur etait quebecois ou etranger, et trier a partir de la. Elle connait le paysage editorial (je veux dire, elle baigne dedans), alors la classification elle-meme n'etait pas la partie difficile. C'etait le volume.

Une semaine de recherches manuelles, minimum.

## La solution

Je l'ai convaincue de me laisser essayer. Elle a exporte son inventaire, j'ai monte une petite app Flask qui scrapait les donnees d'editeur pour chaque ISBN et les comparait a une liste d'editeurs quebecois. Ce truc avait tellement d'onglets. Claude m'a aide a constituer la liste d'editeurs, et elle l'a completee parce qu'elle connaissait les cas limites, les empreintes editoriales, ceux qui avaient Quebec dans le titre mais qui apparaissaient comme etrangers (lol). Cet echange etait la meilleure partie. J'ai appris un peu plus sur son monde, elle a appris un peu plus sur le mien.

L'interface etait minimale : un tableau d'ISBN avec une case a cocher et un bouton pour tout scraper. Chaque ligne etait enrichie avec les donnees une a une, titre, categorie, editeur, et si c'etait etranger ou quebecois, plus un petit lien vers la source de donnees pour verifier. On pouvait cliquer sur un editeur pour l'ajouter ou le retirer de la liste blanche d'editeurs quebecois et ca mettait a jour chaque ligne avec cet editeur specifique. Une fois qu'elle avait parcouru la liste, l'app reclassifiait les 5 000 entrees en consequence et exportait le resultat. Pas de clic livre par livre. Juste des decisions au niveau editeur, ce qui est exactement comme elle pensait deja.

Ce n'etait pas un programme joli. Encore une fois, genre vingt onglets et boutons differents pour trier, filtrer, scraper et tout le reste. Mais ca marchait, et ca evoluait -- elle disait "est-ce qu'on peut aussi afficher le nombre de livres quebecois?" et litteralement 10 secondes plus tard c'etait fait.

## Le resultat

33% quebecois. Juste au-dessus du seuil.

Elle a encore du travail devant elle -- l'agrement verifie chaque section du magasin independamment, pas juste le ratio global -- mais maintenant elle a les donnees. En plus ca l'a aidee a mettre a jour son inventaire pour l'implementer dans SLIM. Elle peut trier avec les connaissances du domaine qu'elle a deja au lieu de se noyer dans le travail de recherche. Ce qui aurait pris une semaine a pris un apres-midi, dont la majeure partie etait juste nous en train de discuter de comment son commerce fonctionne reellement.

## Ce que j'en retiens

Il y a quelque chose de different a construire des outils de cette facon. Pas un produit, pas une plateforme, c'est un peu juste un petit outil d'apres-midi pour une personne qui comprend profondement le domaine. L'echange l'a rendu meilleur : chaque fois qu'elle me disait quelque chose que je ne savais pas sur le fonctionnement des librairies, l'app devenait un peu plus intelligente.

Je n'arrete pas de penser a quel point le developpement est devenu malleable. Les programmes uniques qui resolvent un seul probleme sont faciles maintenant. On peut travailler de maniere creative avec la personne qui detient la connaissance du domaine, iterer cote a cote, et ce qui en sort est plus un organisme vivant. Si on a besoin de modifier un comportement en cours de session, on le fait. C'est moins precieux d'une certaine facon, mais plus interactif.

> L'application est dans l'edition. Ca a toujours ete le cas. C'est juste plus rapide maintenant.
