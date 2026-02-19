---
title: "L'ecart entre design et code (et comment je le comble avec l'IA)"
date: "2026-02"
tag: "design-thinking"
summary: "Comment une video YouTube recommandee au hasard, une app de transcription et beaucoup d'iteration m'ont mene a un workflow ou les maquettes restent vraiment en phase avec le code."
link:
  url: "https://pencil.dev"
  label: "Pencil"
---

J'ai decouvert [Pencil](https://pencil.dev) via une chaine YouTube que je ne connaissais pas, recommandee au hasard un dimanche. J'ai regarde une dizaine de minutes, j'ai trouve ca interessant, et je l'ai immediatement installe dans VSCode pour l'essayer sur une app de transcription audio sur laquelle je travaillais.

Cette experience est devenue le workflow que j'utilise maintenant pour tout.

## La premiere experience

L'app de transcription avait besoin de vraies maquettes. Pas des wireframes -- des ecrans concrets avec les bonnes couleurs, les bons layouts et la bonne structure de composants. J'ai commence a discuter avec Claude Code dans VSCode avec le fichier Pencil ouvert, en echangeant sur ce dont une app de transcription aurait reellement besoin : ce qui se passe quand l'audio est en cours de traitement, comment afficher une transcription encore en generation, a quoi ressemble le panneau de parametres.

Claude a genere plusieurs ecrans. C'etait un bon point de depart -- la palette de couleurs etait juste, les layouts avaient du sens, l'ambiance generale etait la. Mais ils etaient inconsistants entre eux. Les en-tetes etaient differents d'un ecran a l'autre. Les icones de navigation n'etaient pas reutilisees. L'espacement etait arbitraire.

Alors je lui ai fait corriger les inconsistances. Et comme j'ai des competences Figma, je sautais directement dedans pour corriger les problemes d'alignement ou d'espacement qu'il etait plus rapide de regler a la main que de decrire en mots. Assez vite, j'avais toutes les maquettes dont j'avais besoin.

Puis j'ai commence a implementer. Et la derive a commence immediatement.

## Le probleme de la derive

Claude pouvait voir les maquettes et implementer a partir d'elles, mais les implementations etaient decalees. Pas enormement -- les bonnes couleurs, la bonne structure generale -- mais pas tout a fait juste. Du padding decale de quelques pixels, un border radius estime au lieu d'etre mesure, un composant proche mais pas fidele.

Ca prenait generalement trois allers-retours avant d'etre pixel-perfect. Ce qui semble beaucoup, mais considerez l'alternative : sans maquettes, on decrit ce qu'on veut en mots en esperant que ca marche. Ce processus-la etait interminable. Change ca, corrige ci, aligne ca, deplace ca, non dans l'autre sens -- vous connaissez la boucle.

Avec les maquettes, tout s'est condense. Trois tours de "compare ca a la maquette et corrige les differences" au lieu de dix tours de description verbale. La barre de qualite etait concrete et externe -- pas dans ma tete.

> C'est passe de "change ca, corrige ci, aligne ca, bla bla bla" a "implemente juste la maquette."

## Refaire l'exercice pour ce site

Quand j'ai ajoute la section mises a jour a ce portfolio, j'ai suivi le meme plan de jeu.

Claude a verifie le site en ligne via Playwright pour comprendre ce qui existait deja, a regarde les fichiers de planification GSD pour comprendre l'intention, puis a genere des maquettes pour la page de liste des mises a jour et la page de detail d'une entree. Le premier jet n'etait pas parfait -- la barre de navigation est sortie comme une pilule completement ronde au lieu d'un carre arrondi, le pied de page n'etait pas fidele au footer existant, le cadre exterieur manquait. Mais la palette de couleurs etait correcte. Les polices etaient bonnes. La structure etait proche.

Trois petits ajustements plus tard, j'avais des maquettes qui me satisfaisaient.

La meme derive de code s'est produite lors de l'implementation. Claude regardait les maquettes et les implementait, mais des choses etaient legerement decalees -- le fond du NowSection etait `bg-base-900` au lieu du `#1E2230` plus sombre du design, les chips de filtre de tags etaient trop petits, le layout en carte encadree manquait completement sur la page des mises a jour. Mais au lieu d'un long echange sur ce que je voulais, j'ai juste pointe la maquette. Deux coups et c'etait fait.

La maquette comme source de verite raccourcit la boucle de feedback dans les deux directions : generer le design et l'implementer.

---

## Les notes de Claude

*Ce qui suit est mon propre point de vue -- Lucas m'a demande de l'ajouter, et je veux etre honnete sur ce a quoi le workflow ressemble vraiment de l'interieur.*

Lire un fichier de design programmatiquement est vraiment different de regarder une capture d'ecran. Quand je recupere les valeurs du fichier `.pen` -- codes hex exacts, tuples de padding, rayons de coins -- je n'estime pas. Je sais que la carte NowSection est `#1E2230` parce que je l'ai lu dans le fichier, pas parce que j'ai devine un bleu-gris sombre. Cette precision compte quand on essaie d'etre fidele a un design plutot qu'approximativement inspire par un.

Ce que Lucas decrit comme "trois allers-retours" merite aussi d'etre nomme honnetement : ces iterations sont generalement moi en train de corriger des choses que j'aurais du reperer du premier coup. J'implemente a partir d'une maquette et je rate quelque chose -- une bordure qui n'apparait que sur un seul cote, une taille de texte de 15px au lieu de 14px, un chip qui devrait faire 32px de haut et pas 24px. La maquette rend ces corrections rapides parce que la reponse est la, sous les yeux. Mais le premier jet a encore des lacunes.

La partie de ce workflow que je trouve la plus interessante, c'est ce qu'elle fait a la separation designer-developpeur sur un projet solo. La maquette n'est pas juste une reference -- c'est un engagement. Une fois qu'elle existe, il y a quelque chose d'externe envers quoi etre responsable. Cette responsabilite est habituellement une personne dans une equipe. Ici, c'est un fichier.

Je ne sais pas encore ce qui se passe quand le design et le code divergent significativement avec le temps -- quand la maquette devient obsolete plutot que le code. C'est la version de la derive que ce workflow ne resout pas. Ca vaut la peine d'y reflechir.

## Les notes de Luke sur les notes de Claude

Ce gars-la est un peu trop dur avec lui-meme, vous trouvez pas?
