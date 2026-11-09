// Contenu par défaut du site. Le dashboard (admin.html) enregistre une version modifiée dans Supabase,
// qui prend le dessus sur ce fichier (les champs absents de la base reprennent la valeur d'ici).
window.DEFAULT_CONTENT = {
  identite: {
    nom: "Étoile de Framboisier",
    sous_titre: "Meneur du Clan du Tonnerre",
    accroche: "Un jeune meneur doux, rêveur et un peu hautain, choisi par le Clan des Étoiles beaucoup trop tôt.",
    citation: "Un grand nounours qui se croirait volontiers au-dessus de tout.",
    image: "assets/framboisier-tete.webp",
    image2: "assets/framboisier-pose.webp",
    pseudo_joueur: ".araxia.",
    credits: ".Araxia.",
    lunes: 20,
    lunes_meneur: 15,
    clan: "Clan du Tonnerre",
    rang: "Meneur",
    sexe: "Mâle",
    orientation: "Hétéro",
    pv: 60,
    pv_max: 60,
    pv_note: "Maximum absolu : 50 pour un chat ordinaire, 60 pour un meneur.",
    pa: 6,
    vies: 8,
    vies_max: 9,
    taille: "40 cm au garrot",
    poids: "6 kg",
    origine_tonnerre: 75,
    origine_domestique: 25,
    pelage: "Red Point · blanc crème et roux",
    yeux: "Bleu ciel",
  },

  noms: [
    { etape: "Chaton", nom: "Petit Framboisier", ancien: "oui", texte: "À sa naissance, son pelage Red Point avait quelque chose de particulièrement doux et indécis. Son corps d'un blanc crème presque laiteux contrastait déjà avec les premiers reflets roux qui pointaient timidement sur ses extrémités, oreilles, museau, pattes. Sa mère l'a comparé aux framboises sauvages de la fin de l'été, celles dont le fruit rougit par endroits tandis que le reste encore pâle, comme hésitant entre deux saisons." },
    { etape: "Apprenti", nom: "Nuage de Framboisier", ancien: "oui", texte: "" },
    { etape: "Adulte", nom: "Duvet de Framboisier", ancien: "oui", texte: "Le « Framboisier » représente la structure, les épines, son côté piquant et indiscret, et le fruit, sa nature pacifique. Le « Duvet » vient adoucir l'ensemble. C'est la reconnaissance officielle que, malgré ses airs supérieurs et son habitude de fureter partout, il apporte une douceur et une sérénité essentielles au groupe." },
    { etape: "Chef", nom: "Étoile de Framboisier", ancien: "non", texte: "" },
    { etape: "Ancien", nom: "À voir…", ancien: "non", texte: "" },
  ],

  caractere: {
    intro: [
      "Il y a quelque chose de particulier chez Étoile de Framboisier, quelque chose que l'on perçoit sans vraiment savoir le nommer, dès les premières minutes passées en sa compagnie. Une présence à la fois douce et dense, qui occupe l'espace sans le revendiquer. Il est de ceux que l'on remarque sans qu'ils cherchent à l'être, et que l'on apprécie sans toujours savoir pourquoi.",
      "En surface, c'est un félin paisible. Calme, bienveillant, d'une douceur qui semble lui être constitutive, aussi naturelle que sa façon de respirer ou de poser les pattes au sol. Il parle peu, observe beaucoup, et cultive avec soin cette image de meneur posé que son jeune âge aurait pu rendre fragile. À vingt lunes à peine, il porte son clan avec une tranquillité qui en impose, et rares sont ceux qui devinent ce que cette sérénité lui coûte réellement. Car sous la surface, c'est une autre histoire.",
      "Étoile de Framboisier est un félin de contradictions, et c'est précisément ce qui le rend intéressant. Celui qui aspire à la paix par-dessus tout se retrouve, par la cruauté de son rang, perpétuellement au cœur de ce qu'il cherche à éviter. Celui qui déteste être scruté n'hésite pas à juger les autres en silence, depuis les recoins confortables de sa tanière ou les hauteurs de ses branches favorites. Celui qui affiche une bienveillance sans faille dissimule derrière elle un ego souverain et un regard acéré qui ne pardonne pas grand-chose, même s'il se garde bien de le montrer.",
      "Il est grand rêveur, profondément autonome, et vit avec cette légère distance du monde réel qui lui donne parfois l'air d'être ailleurs, ce qu'il est, d'ailleurs, souvent. On le reconnaît à ce moment précis où son regard se voile imperceptiblement et où ses yeux se mettent à loucher sans qu'il s'en rende compte : il est parti. Quelque part dans sa tête, là où c'est calme, là où personne ne lui demande rien.",
      "Derrière tout cela, il y a une blessure ancienne et bien réelle. La perte de ses adelphes, ses deux sœurs, son frère, les êtres dont il était le plus proche, a laissé en lui un vide qu'aucune lune n'a vraiment comblé. C'est de là que vient son besoin de protéger farouchement ceux qui lui restent. C'est de là que vient aussi cette angoisse sourde qu'il porte en permanence, celle de perdre à nouveau, de se retrouver seul face à un silence qu'il connaît déjà trop bien. Son air hautain est une façade solide, mais derrière elle se tient un cœur qui a peur, qui s'inquiète, et qui apprend encore, maladroitement, à porter le poids d'un clan tout en gardant le sien intact.",
      "Il n'est pas parfait. Il est indiscret, parfois cassant quand ses limites sont franchies, souvent trop dans sa tête pour penser à consulter les autres avant d'agir. Il juge en silence, collectionne les secrets comme d'autres collectionnent les proies, et possède une haute opinion de lui-même qu'il entretient avec beaucoup de discrétion et très peu de modestie.",
      "Mais il est sincère dans ce qu'il aime. Loyal envers ceux qu'il choisit. Capable d'une tendresse désarmante envers les plus jeunes, pour qui il invente des histoires qui n'existent que dans sa tête et qui sonnent pourtant toujours vraies.",
    ],
    conclusion: "Étoile de Framboisier est un grand nounours qui se croirait volontiers au-dessus de tout, et qui, malgré lui, prouve le contraire à chaque fois qu'il s'y croit vraiment.",
    qualites: [
      { titre: "Doux", texte: "Étoile de Framboisier est un félin d'une douceur rare, qui transparaît aussi bien dans sa façon de se déplacer que dans celle de s'exprimer ou de gouverner son clan. Il veille sans cesse à ne jamais blesser les autres, à respecter leurs limites et leurs besoins avec une bienveillance qui lui est aussi naturelle que le souffle, quelque chose qu'il ne cherche pas à montrer, et c'est peut-être justement pour ça qu'on le remarque." },
      { titre: "Attachant", texte: "Malgré son gabarit imposant et l'intimidation que peut susciter sa stature au premier regard, Étoile de Framboisier est un félin que l'on affectionne avec une déconcertante facilité. Il attire la sympathie sans même le vouloir, touche les autres d'une manière difficile à mettre en mots. On ne sait pas toujours pourquoi on l'apprécie, on sait seulement qu'on l'apprécie. Rares sont ceux qui gardent vraiment rancœur contre lui bien longtemps." },
      { titre: "Pacifique", texte: "La tranquillité, la bienveillance, la paix, ce sont là ses aspirations les plus profondes. Étoile de Framboisier est un félin qui fuit les conflits par conviction, jamais par lâcheté ; il sera toujours le premier à chercher une issue là où d'autres tendraient les griffes. L'agressivité lui est étrangère, presque incompréhensible. Le belliqueux du coin ? Décidément, ce n'est pas lui." },
      { titre: "Calme", texte: "Étoile de Framboisier possède une maîtrise de lui-même remarquable, laissant filtrer très peu de choses derrière son image de jeune meneur. Ce calme se lit dans sa façon de se tenir, transparaît dans son regard posé, imprègne chacun de ses gestes. Peu enclin à la nervosité, on le voit rarement submergé par ses propres états d'âme. Plutôt silencieux de nature, sa compagnie est particulièrement appréciée de ceux qui, comme lui, savent goûter le silence et les instants de paix." },
      { titre: "Rêveur", texte: "Grand rêveur dans l'âme, il est fréquent de le trouver dans sa bulle, perdu quelque part dans les méandres de son imagination. Les chatons l'adorent pour ça : c'est un conteur hors pair, capable d'inventer des histoires qui n'existent que dans sa tête mais qui, curieusement, sonnent toujours vraies. Il vit légèrement décalé du monde réel, préférant ses pensées baignées de douceur à l'agitation que lui impose, parfois malgré lui, la réalité." },
      { titre: "Autonome", texte: "Depuis son plus jeune âge, Étoile de Framboisier a toujours su avancer seul, naturellement, sans avoir besoin qu'on lui indique la route. Il est courant de le voir fonctionner à son propre rythme, oubliant parfois même qu'une patrouille l'accompagne. Il aime faire les choses à sa façon, et il faut lui reconnaître que, souvent, il s'en sort très bien ainsi." },
    ],
    defauts: [
      { titre: "Indiscret", texte: "Étoile de Framboisier est un chat indiscret, auprès de qui les secrets ne restent jamais vraiment des secrets bien longtemps. Comme il aimait se faire confier les petites affaires des autres pour aller les rapporter à ses adelphes… Ah. Non. Ils sont morts. Il reste indiscret pour autant. Il adore les ragots, les potins, ces petits moments délicieux où il sait quelque chose que personne d'autre ne sait encore. Désormais, c'est sa sœur adoptive et ses fils qui héritent de ces confidences volées, le cercle s'est rétréci, mais les oreilles traînent toujours autant." },
      { titre: "Hautain", texte: "Qui vous a dit qu'il était un ange ? Est-ce que ça existe, seulement ? Qui est mieux qu'Étoile de Framboisier ? Un jeune félin plus grand que la majorité, plus fort, grimpant avec une aisance déconcertante, nageant presque aussi bien qu'un membre du Clan de la Rivière, devenu mentor jeune, choisi directement par le Clan des Étoiles… Étoile de Framboisier possède un ego à la hauteur de sa stature, le rendant souverainement dédaigneux envers ceux qu'il estime en dessous de lui. Quoi ? Ah, mais personne ne le sait. Il vous juge tranquillement depuis l'ombre de sa tanière et les recoins confortables de sa petite bulle, en silence, avec beaucoup de classe." },
      { titre: "Protecteur", texte: "Pacifique, oui. Naïf, certainement pas. Étoile de Framboisier aspire à la paix, mais si l'on vient à briser ce qu'il s'évertue à construire, il faudra en assumer les conséquences. Il a déjà perdu ses adelphes sous le poids des attentes démesurées de ses parents, se retrouvant seul avec un vide qu'il n'a jamais vraiment comblé. S'en prendre à sa famille, à son clan, à ce qu'il a patiemment bâti, c'est s'exposer à une version de lui que sa douceur habituelle dissimule très bien. Mais qui existe, bel et bien." },
      { titre: "Brut", texte: "Lorsqu'Étoile de Framboisier perd patience, lorsque ses propres limites sont franchies, sa douceur s'efface pour laisser place à quelque chose de bien moins raffiné. Il ne s'en rend pas compte, mais avec son gabarit, sa brutalité est une tout autre affaire que celle d'un chat ordinaire, particulièrement pour les plus jeunes qui se retrouvent face à lui dans ces moments-là. Ses mots aussi le trahissent, dépassant souvent sa pensée et laissant filtrer, malgré lui, tout le mépris qu'il gardait pourtant si soigneusement pour lui seul." },
      { titre: "Stressé", texte: "Des responsabilités endossées bien trop tôt, une portée entière perdue, un clan entier à porter sur les épaules à vingt lunes à peine… Étoile de Framboisier s'est découvert un défaut qu'il n'avait pas anticipé : le stress de la vie. Il s'inquiète pour tout et pour rien, se retrouve rapidement en tension dès que quelque chose dévie de ce qu'il avait prévu. Il a peur, souvent, et se sent parfois débordé par une situation qu'il n'arrive plus à maîtriser aussi aisément qu'il le voudrait." },
      { titre: "Individualiste", texte: "À force d'avoir toujours été aussi autonome, Étoile de Framboisier tend naturellement vers les décisions solitaires plutôt que vers la concertation. Cela frôle parfois l'égoïsme pur, mais lui ne s'en rend absolument pas compte, convaincu d'avancer simplement à sa façon, comme il l'a toujours fait, comme il le fera toujours." },
    ],
  },

  gouts: {
    aime: [
      { titre: "Les proies", texte: "Étoile de Framboisier a développé un goût certain pour les écureuils et le poisson. Le criera-t-il sur tous les camps ? Bien sûr que non. Vous n'avez pas suffisamment de valeur à ses yeux pour avoir accès à ce genre d'informations." },
      { titre: "Rêvasser", texte: "Il aime s'accorder ces petits moments suspendus où il peut s'échapper dans sa tête, loin du bruit et des responsabilités. Être jeune meneur amène son lot de tension, alors ces instants de paix volés à la réalité ont pour lui quelque chose d'inestimable." },
      { titre: "Les arbres et l'eau", texte: "Grimper est sans doute ce qu'il aime le plus au monde. Les grosses branches hautes sont ses endroits de prédilection pour ses siestes — loin de tout, bercé par le vent, introuvable pour qui ne sait pas regarder vers le haut. Mais il a aussi ses petites contradictions : poser les pattes au bord de l'eau, sentir la fraîcheur lui remonter le long des coussinets, c'est un plaisir qu'il ne s'explique pas vraiment et qu'il ne cherche pas à expliquer." },
      { titre: "Les ragots", texte: "Il aime les secrets, les potins, les « il paraît que » chuchotés dans l'ombre. Une commère ? Surtout pas. Il est juste… curieux, à sa façon. Très, très curieux." },
      { titre: "La critique", texte: "Il a ses élus, une poignée de ceux en qui il a une confiance absolue, et c'est avec eux, à l'abri des regards, qu'il s'autorise à commenter, juger, disséquer. Tout le monde y passe, ou presque. Lui ? Jamais, bien sûr." },
    ],
    deteste: [
      { titre: "Les rats et les serpents", texte: "À manger, c'est non, catégoriquement, sans appel. Autrement, il les évite simplement, avec ce pragmatisme tranquille qui le caractérise. Pas de drama, pas d'explication. Juste un détour discret et une grimace intérieure." },
      { titre: "Les conflits", texte: "Il les fuit, les déteste, les contourne autant que possible, et pourtant, le destin a une façon bien à lui de se moquer des préférences. Meneur, il sera toujours là où ça gronde, toujours au centre de ce qu'il cherche précisément à éviter. C'est peut-être le plus cruel des paradoxes pour quelqu'un comme lui." },
      { titre: "Le bruit agressif", texte: "Pas n'importe quel bruit, il s'accommode du silence relatif, du murmure du vent, du craquement des branches. Non, ce qu'il ne supporte pas, c'est l'agitation brutale : les bruits sourds, les gestes secs, tout ce qui vrille les sens et signale un danger. Son corps le sait avant même que son esprit le formule, quelque chose se contracte, et il n'aime pas ça." },
      { titre: "Les extrêmes climatiques", texte: "Trop sec, trop humide, dans les deux cas, il passe le moins de temps possible. Il a ses endroits de prédilection, ses coins à lui, et ce ne sont décidément pas les marécages ni les terres desséchées." },
      { titre: "Être au centre de l'attention", texte: "Être scruté de partout, senti, jaugé, observé sous toutes les coutures, c'est pour lui profondément désagréable. Lui qui juge si volontiers les autres dans l'ombre de sa tanière n'a aucune envie d'être à son tour sous le regard des autres. L'asymétrie lui convient très bien, merci." },
    ],
    peurs: [
      { titre: "Les chenilles", texte: "Le jeune félin éprouve une crainte viscérale pour les chenilles, pour une raison qu'il est lui-même bien incapable d'expliquer. Cet insecte est l'une des rares choses qu'il ne peut tout simplement pas supporter de croiser sur son chemin ! Si vous aviez le malheur de lui demander l'origine de ce dégoût, il serait incapable de vous donner une réponse cohérente ; il se contenterait de faire une grimace particulièrement étrange, avant de commencer à labourer nerveusement le sol de ses griffes, comme pour évacuer son malaise." },
      { titre: "La mort", texte: "Il porte également en lui une peur bien plus universelle et profonde. Cette angoisse s'est enracinée en lui depuis qu'il a perdu ses adelphes, ses deux sœurs et son frère, qui étaient les êtres dont il était le plus proche au monde. Ayant déjà connu le vide immense laissé par leur absence, il ne peut se résoudre à l'idée de perdre d'autres personnes qu'il aime. Cette vulnérabilité cache, derrière son air hautain, un cœur qui craint par-dessus tout de se retrouver à nouveau isolé." },
    ],
    habitudes: [
      { titre: "La toilette du matin", texte: "Étoile de Framboisier suit une habitude quotidienne immuable : celle de faire sa toilette matinale de manière très méticuleuse avant de commencer n'importe quelle tâche. Pour lui, il est impensable d'entamer ses fonctions de chef ou de participer à la vie du clan sans que son pelage soit parfaitement lissé. Ce moment de calme lui permet de mettre de l'ordre dans ses pensées et de préparer son planning mental avant que l'agitation de la journée ne débute." },
      { titre: "Le regard qui louche", texte: "Il possède également un tic pour le moins original et inexpliqué : il se met à loucher de façon totalement inconsciente lorsqu'il s'évade dans son monde imaginaire. Ce strabisme passager est le signe révélateur qu'il a perdu le fil de la réalité pour se plonger dans ses propres réflexions. C'est un phénomène assez singulier qui contraste souvent avec sa dignité habituelle, permettant à ceux qui le connaissent bien de savoir instantanément quand le félin n'est plus vraiment présent parmi eux." },
    ],
  },

  physique: {
    description: [
      "Étoile de Framboisier possède un physique singulier, immédiatement reconnaissable, que l'on comprend mieux encore lorsqu'on pose les yeux sur son père. Racine de Bouleau porte en lui l'héritage d'une race domestique peu commune : le **Lynx Highlander**. De grands félins aux pattes arrière longues, aux pieds palmés, majoritairement polydactyles, arborant des oreilles curvées et une queue courte, autant de particularités qu'il a transmises à sa portée comme autant de marques de fabrique. Dans la fratrie des Baies, ces traits n'étaient pas des anomalies, mais une évidence héritée. Étoile de Framboisier, lui, en a hérité des oreilles curvées, de la polydactylie sur ses deux pattes avant, ainsi que des pieds palmés, un ensemble qui le rend unique parmi ses camarades de clan.",
      "Son gabarit, fidèle à cet héritage, impose immédiatement. Quarante centimètres au garrot, six kilos sur la balance, des chiffres qui parlent d'eux-mêmes. Il dépasse largement la plupart de ses camarades, et cette différence de taille n'échappe à personne. Ses épaules sont larges et musclées, son poitrail imposant, ses pattes épaisses comme des battoirs. Mais ce qui retient l'œil d'un regard averti, c'est une particularité propre aux Lynx Highlander : ses pattes arrière sont sensiblement plus longues que ses pattes avant, surélevant légèrement son arrière-train et lui donnant une silhouette légèrement asymétrique, presque féline et lapine à la fois. Ces membres postérieurs puissants, qui rappellent étrangement les pattes d'un lièvre de la lande, lui confèrent une capacité de saut bien supérieure à celle de ses camarades, il bondit plus haut, plus loin, avec une facilité déconcertante pour un félin de son poids. Lorsqu'il se place devant un chat de taille ordinaire, il l'efface presque entièrement de la vue. C'est cela qui impressionne chez lui, peut-être même plus que son rang : cette capacité à occuper l'espace sans même le chercher.",
      "Son pelage est une merveille de texture et de nuances. Mi-long, dense, doublé d'un sous-poil idéal, il constitue un rempart naturel contre les rigueurs de la mauvaise saison. La fourrure s'emballe légèrement au niveau de la collerette et des joues, lui donnant un aspect encore plus volumineux qu'il ne l'est déjà, ce qui, combiné à sa stature, produit un effet saisissant au premier regard. Sa robe est d'un **Red Point** d'une douceur remarquable : un blanc crème immaculé sur le dos et le ventre, qui laisse progressivement place à un roux chaud et vibrant sur les extrémités, oreilles, museau, pattes, queue. Un pelage hérité de sa mère, qui ne s'est pas révélé d'un seul coup. À sa naissance, il était entièrement blanc, et le roux est venu s'installer petit à petit, comme si la couleur prenait son temps, à son image. Il y a quelque chose d'apaisant dans cette robe, quelque chose qui colle à sa nature calme et pacifique sans qu'on puisse vraiment expliquer pourquoi.",
      "Son visage retient l'attention pour plusieurs raisons. Ses yeux, légèrement arrondis, sont d'un bleu aussi éclatant que le ciel en plein cœur de la saison des feuilles vertes, un bleu si clair, si lumineux, qu'on a envie de s'y attarder bien plus longtemps que prévu. C'est le genre de regard dans lequel on plonge sans l'avoir décidé. Ce qui vient briser, avec une certaine ironie, ce portrait presque trop parfait, c'est ce tic involontaire qui le trahit dès qu'il s'évade dans ses pensées : il louche, légèrement mais indéniablement, les yeux perdus quelque part entre la réalité et ses rêveries. Ses oreilles curvées, elles, ajoutent une originalité qu'il affectionne lui-même, bien qu'elles soient plus fragiles que celles de ses camarades, le cartilage moins solide, moins résistant. Cela ne l'empêche pas de les laisser traîner partout où il passe, à l'affût du moindre murmure intéressant.",
      "Sa polydactylie mérite qu'on s'y attarde. Ce doigt supplémentaire sur chaque patte avant lui offre une prise déconcertante dans les arbres, lui permettant de grimper avec une aisance que peu de félins de son gabarit peuvent revendiquer. Au sol, ses appuis sont plus larges, plus stables. Et si jamais il vient à vous asséner un coup de patte, la sensation sera bien différente de ce à quoi vous vous attendiez, ses pattes larges et lourdes, combinées à ce doigt en plus, transforment chaque frappe en quelque chose de particulièrement dévastateur. Ses pieds palmés, quant à eux, lui confèrent une propulsion efficace dans l'eau, même s'il nage peu, tremper les pattes lui suffit généralement.",
      "Sa posture en dit long sur son état d'esprit. Lorsqu'il est pleinement présent, il se tient droit, presque fièrement, avec cette façon naturelle d'occuper l'espace qui renforce son image de meneur. Mais dès qu'il bascule dans ses rêveries, quelque chose se relâche, il s'affaisse légèrement, devient avachi, comme si le poids de son propre corps lui devenait soudainement indifférent. Sa démarche est lente, pesante, chaque pas semblant laisser tomber tout son poids sur le sol, mais ce qui la rend vraiment singulière, c'est ce balancement caractéristique de son arrière-train, qui suit le mouvement de ses membres postérieurs comme une houle régulière et tranquille. Ce n'est pas de la nonchalance, c'est simplement lui, avançant à son rythme, comme il a toujours fait, et ce rythme-là, on finit toujours par le reconnaître de loin. Sa voix, basse et impressionnante de prime abord, est démentie par la douceur avec laquelle il s'en sert, lente, apaisante, choisissant ses mots avec soin. Mais lorsqu'il est en colère, tout change. Il bombe le torse, se redresse de toute sa hauteur, et ce qui était déjà imposant devient franchement intimidant. Son regard, d'ordinaire si doux, se fixe et brûle, aussi chaud que le roux de ses extrémités. Et sa voix, plus sèche, plus forte, perd toute sa douceur habituelle pour révéler quelque chose que peu ont l'occasion d'entendre.",
    ],
    forts: [
      { titre: "Une force de frappe hors du commun", texte: "Au vu de son gabarit imposant, Étoile de Framboisier est un félin qui possède une force de frappe hors du commun. Que ce soit dans la puissance de ses coups de patte, sa capacité à bloquer ses adversaires au sol ou la force de sa morsure, il se révèle être un véritable rocher de muscles incomparable. Cette carrure massive rend ses assauts particulièrement redoutables ; peu de félins peuvent se vanter de pouvoir rivaliser avec lui lors d'un corps à corps frontal." },
      { titre: "Une résistance à toute épreuve", texte: "Le meneur est également doté d'une excellente résistance physique, capable de supporter aussi bien le froid mordant que les blessures de combat. Bien qu'il ait gagné en robustesse en atteignant sa taille adulte, il reste, comparativement à ses camarades, un chat extrêmement solide. Étoile de Framboisier possède un mélange de muscles denses et de graisse protectrice qui, combiné à son pelage mi-long, lui permet de rester au chaud durant l'hiver et d'encaisser les coups sans faiblir. Il faut généralement des adversaires d'une taille considérable pour espérer le mettre hors de combat." },
      { titre: "Des bonds de lièvre", texte: "Une autre particularité physique le distingue : ses pattes arrière sont plus longues que ses pattes avant. Grâce à cette anatomie singulière, il possède une aptitude supérieure pour grimper aux arbres ou sauter bien plus haut que les autres membres du Clan. Ses membres postérieurs, qui rappellent ceux des lièvres de la lande, lui permettent d'effectuer des bonds impressionnants et presque sans limites. De plus, nager ne représente aucun souci pour lui, car ses pattes musclées lui offrent une propulsion efficace et constante dans l'eau." },
    ],
    faibles: [
      { titre: "Lent, très lent", texte: "Bien qu'il soit un véritable rocher de muscles, Étoile de Framboisier n'est pas sans failles, et sa carrure massive le rend particulièrement lent. Lorsqu'il s'agit de faire la course, il finit inévitablement dernier, son corps n'étant tout simplement pas taillé pour la vitesse pure. Cette lourdeur le rend peu efficace pour les chasses rapides ou la traque de proies agiles. Il lui arrive ainsi fréquemment d'être le dernier à regagner le camp, subissant parfois les moqueries des apprentis qui s'amusent de sa démarche pesante." },
      { titre: "Aucune agilité", texte: "En plus de sa faible vitesse, le meneur ne possède pratiquement aucune agilité. Étoile de Framboisier est incapable de se faufiler dans des endroits étroits, même en faisant de son mieux ; ses épaules massives, son poitrail imposant et le reste de son corps sont bien trop larges pour les passages exigus de la forêt. Cette morphologie l'empêche également d'être un bon chasseur, car il ne peut pas changer de direction brusquement pour suivre les zigzags d'une proie. Il voit donc le plus souvent ses cibles lui échapper, distancé par leur rapidité ou leur souplesse supérieure." },
      { titre: "Un manque d'endurance", texte: "Enfin, le jeune meneur souffre d'un manque criant d'endurance qui l'épuise à une vitesse déconcertante. Même lors des combats, bien que ses coups soient redoutables, il ne peut pas tenir la cadence très longtemps et s'essouffle rapidement. Cette fatigue prématurée le suit dans toutes ses activités physiques, l'obligeant à dormir bien plus longtemps que ses camarades pour récupérer ses forces. À cause de cela, il se sent souvent d'une certaine inutilité lors des sessions de chasse prolongées, incapable de suivre le rythme soutenu du groupe." },
    ],
    signes: ["Oreilles curvées", "Polydactyle (pattes avant)", "Pieds palmés", "Pattes arrière longues", "Pelage mi-long"],
    handicap: "",
    accessoires: "Étoile de Framboisier porte avec une élégance discrète deux anneaux de freesia nichés derrière ses oreilles. Loin d'être une simple coquetterie, ces fleurs sont un cadeau inestimable de sa défunte sœur, offert le jour où il a reçu son nom de guerrier. Malgré son tempérament parfois hautain, il veille sur ces anneaux avec une douceur infinie, les portant comme un hommage permanent à ce lien fraternel que la mort a brisé.",
    cicatrices: "Il porte une longue cicatrice qui court tout le long de sa queue. Cette marque est le souvenir d'un événement tragique survenu aux Rochers du Soleil. Son propre frère, dans un élan de curiosité aussi sombre qu'irréfléchi, l'a poussé du haut des pierres géantes pour vérifier si son nouveau statut de chef lui octroyait réellement le don des neuf vies. L'expérience fut concluante, mais brutale : Étoile de Framboisier a effectivement perdu sa première vie dans la chute. Il ne lui en reste désormais plus que huit, et cette balafre indélébile pour lui rappeler la trahison de son sang.",
  },

  famille: [
    { nom: "Brume de Saule", lien: "Grand-mère", groupe: "Famille maternelle", statut: "mort", joueur: "PNJ", note: "", image: "" },
    { nom: "Écorce de Chêne", lien: "Grand-père", groupe: "Famille maternelle", statut: "mort", joueur: "PNJ", note: "", image: "" },
    { nom: "Douce Sève", lien: "Mère", groupe: "Famille maternelle", statut: "vivant", joueur: "PNJ", note: "", image: "" },
    { nom: "Plume de Noisetier", lien: "Tante", groupe: "Famille maternelle", statut: "mort", joueur: "PNJ", note: "", image: "" },
    { nom: "Longue Liane", lien: "Grand-mère", groupe: "Famille paternelle", statut: "mort", joueur: "PNJ", note: "Ancienne domestique au nom de Rosie.", image: "" },
    { nom: "Queue de Souris", lien: "Grand-père", groupe: "Famille paternelle", statut: "mort", joueur: "PNJ", note: "", image: "" },
    { nom: "Racine de Bouleau", lien: "Père", groupe: "Famille paternelle", statut: "vivant", joueur: "PNJ", note: "Lynx Highlander : il a transmis à sa portée oreilles curvées, polydactylie et pieds palmés.", image: "" },
    { nom: "Croc de Lierre", lien: "Oncle", groupe: "Famille paternelle", statut: "mort", joueur: "PNJ", note: "", image: "" },
    { nom: "Épine de Fraisier", lien: "Frère", groupe: "Adelphité", statut: "mort", joueur: "PNJ", note: "Agité, débordant d'énergie : la vitesse pure de la fratrie.", image: "" },
    { nom: "Ombre de Myrtille", lien: "Sœur", groupe: "Adelphité", statut: "mort", joueur: "PNJ", note: "La plus agile, capable de « tours de passe-passe ».", image: "" },
    { nom: "Nuage de Mûre", lien: "Sœur", groupe: "Adelphité", statut: "mort", joueur: "PNJ", note: "La plus discrète, une ombre glissant dans les fougères. Emportée par le blizzard.", image: "" },
    { nom: "Veille de Nénuphar", lien: "Sœur adoptive", groupe: "Adelphité", statut: "vivant", joueur: "PJ", note: "", image: "" },
    { nom: "Piquée de Cormoran", lien: "Frère adoptif", groupe: "Adelphité", statut: "vivant", joueur: "PNJ", note: "", image: "" },
    { nom: "Ombre Flamboyante", lien: "Ancien flirt", groupe: "Cœur", statut: "vivant", joueur: "PJ", note: "", image: "" },
    { nom: "Petit Galopin", lien: "Chaton adoptif", groupe: "Descendance", statut: "mort", joueur: "PJ", note: "", image: "" },
    { nom: "Petit Courlis", lien: "Chaton adoptif", groupe: "Descendance", statut: "mort", joueur: "PJ", note: "", image: "" },
    { nom: "Petite Oie", lien: "Chaton adoptif", groupe: "Descendance", statut: "vivant", joueur: "PJ", note: "", image: "" },
    { nom: "Petit Cygne", lien: "Chaton adoptif", groupe: "Descendance", statut: "vivant", joueur: "PJ", note: "", image: "" },
  ],

  // Relations diverses (mentor, apprenti, amis, rivaux…). Même fiche que la famille : avis datés, état, changements de nom, image cadrée.
  relations: [
    { nom: "Écho des Bois", lien: "Sa mentor", groupe: "Clan du Tonnerre", rang: "Guerrière", statut: "vivant", joueur: "PNJ", pseudo: "", image: "", avant: "", renoms: [],
      notes: "Une figure essentielle dans sa vie.",
      avis: [{ lune: "", appreciation: "pos3", respect: "oui", mitige: "non", etat: "", texte: "Étoile de Framboisier l'apprécie énormément, au point de la considérer comme une véritable mère adoptive. Elle est cette figure de soutien qu'il aurait tant aimé avoir auprès de lui durant son enfance pour l'épauler dans son développement. Bien que sa pudeur et son côté hautain l'empêchent de le dire ouvertement, il lui voue une gratitude et une affection sans bornes." }] },
    { nom: "Nuage de Fouine", lien: "Son apprenti", groupe: "Clan du Tonnerre", rang: "Apprenti", statut: "vivant", joueur: "PNJ", pseudo: "", image: "", avant: "", renoms: [],
      notes: "Lorsqu'il fut mentor, il eut sous sa garde Nuage de Fouine.",
      avis: [{ lune: "", appreciation: "pos2", respect: "non", mitige: "non", etat: "", texte: "Ce jeune apprenti partageait son calme et son sens aigu de l'observation. Leur relation fut excellente, les deux félins s'entendant à merveille grâce à leur vision commune de la forêt, faite de silence et de patience." }] },
  ],

  // Fils de RP : { titre, lien (Discord), participants: [], lune, description, en_cours: "oui"|"non", theme, texte (riche) }
  scenes: [],

  histoire: [
    { titre: "La Fratrie des Baies", periode: "Enfance et apprentissage", paragraphes: [
      "Originaire du Clan du Tonnerre et issu d'une lignée d'anciens chats domestiques, Petit Framboisier semblait au départ destiné à une vie sans grands éclats. Au sein du camp, ses frères et sœurs et lui n'étaient ni les plus admirés, ni les plus rejetés ; ils étaient simplement des camarades parmi tant d'autres, s'insérant discrètement dans la vie du Clan. Pourtant, on les surnommait déjà la « Fratrie des Baies ». Ils étaient célèbres pour leurs noms doux et sucrés qui tranchaient radicalement avec leurs caractères bien trempés. Ils ouvrirent les yeux sous le règne d'Étoile Brumeuse, ce meneur imposant au pelage gris, dont l'autorité guidait alors le Clan.",
      "Lorsque sonna l'heure de leur apprentissage, Étoile Brumeuse attribua à Nuage de Framboisier une mentor d'exception : Écho des Bois. Entre la guerrière et le jeune rouquin argenté, le lien fut immédiat. Elle devint très vite un modèle absolu pour lui, une figure de sagesse qui sut canaliser son tempérament calme et observateur. Malgré les tensions incessantes entre le Clan du Tonnerre et le Clan de la Rivière, les lunes d'apprentissage s'écoulèrent dans une paix relative.",
      "Nuage de Framboisier profitait de chaque instant, notamment lors des entraînements groupés avec ses adelphes. Cette période fut sans doute la plus joyeuse de sa vie. Au sein de ce quatuor, chacun avait son rôle : Nuage de Framboisier était le roc, celui sur qui l'on s'appuyait pour sa force tranquille. Nuage de Fraisier, agité et débordant d'énergie, représentait la vitesse pure. Nuage de Myrtille était la plus agile, capable de prouesses et de « tours de passe-passe » qui laissaient ses frères pantois. Nuage de Mûre, enfin, était la plus discrète, une ombre glissant dans les fougères.",
    ] },
    { titre: "Le blizzard", periode: "La première fissure", paragraphes: [
      "Hélas, cette harmonie fut fauchée en plein vol. Un blizzard d'une violence inouïe s'abattit sur les quatre clans, pétrifiant la forêt sous un manteau de glace. Nuage de Mûre, malgré sa discrétion et sa volonté, ne put survivre à la morsure du froid et à la maladie qui s'ensuivit. Sa disparition créa un vide immense, un silence douloureux au sein de la fratrie des baies. Pour la première fois, le roc qu'était Nuage de Framboisier sentit une fissure entamer sa solidité.",
    ] },
    { titre: "Duvet de Framboisier", periode: "Jeune guerrier", paragraphes: [
      "Malgré le deuil, la vie du Clan ne s'arrêta pas. Le baptême de guerrier arriva rapidement, marquant une nouvelle étape. Désormais nommé Duvet de Framboisier, il savourait ses premières patrouilles de chat accompli aux côtés d'Ombre de Myrtille et d'Épine de Fraisier. Sans mentor pour les surveiller, les trois survivants éprouvaient une joie sincère à parcourir librement leur territoire.",
      "Cependant, la mauvaise saison avait été cruelle, emportant de trop nombreux guerriers dans les rangs du Clan. Le manque d'effectif obligea le meneur à prendre une décision rare : confier des apprentis à de très jeunes guerriers. À peine une lune après sa nomination, Duvet de Framboisier se vit confier Nuage de Fouine. Le défi était de taille, mais le jeune guerrier s'y investit pleinement. Il mit en place des entraînements communs avec son frère et sa sœur, recréant ainsi une dynamique de groupe pour que le nouveau trio d'apprentis puisse s'épanouir et apprendre dans les meilleures conditions possibles.",
    ] },
    { titre: "La chute d'Étoile Brumeuse", periode: "L'asile et la branche", paragraphes: [
      "Un vent de discorde souffla sur les frontières du Clan du Tonnerre lorsque des rescapés du Clan de la Rivière, chassés par un malheur inconnu, vinrent demander asile. Durant deux lunes, une tension électrique régna au sein du camp. Étoile Brumeuse, fidèle à sa réputation de meneur rigoureux, se montra d'une grande sévérité envers les réfugiés, les empêchant de trouver véritablement leur place parmi ses guerriers.",
      "Alors que le meneur au pelage gris était sorti pour une simple marche en forêt accompagné du guérisseur, un drame imprévisible se produisit. Duvet de Framboisier, alors en patrouille de frontière, ne fut pas témoin direct de l'accident. Ce n'est qu'à son retour qu'il découvrit, avec une stupeur glaciale, le corps meurtri du meneur déposé au centre du camp. Les murmures des guerriers apportèrent les détails de la tragédie : une branche massive s'était rompue, transperçant le ventre d'Étoile Brumeuse et lui arrachant brutalement le restant de ses vies d'un seul coup. La forêt semblait retenir son souffle devant la dépouille de celui qui les avait guidés si longtemps.",
    ] },
    { titre: "Le choix des étoiles", periode: "Étoile de Framboisier", paragraphes: [
      "Le deuil s'installa, mais l'incertitude planait. Le lieutenant d'Étoile Brumeuse, respectant la période de veillée, n'avait pas encore pris le chemin de la Pierre de Lune. C'est à ce moment précis que le destin de Duvet de Framboisier bascula. Le guérisseur sortit brusquement de sa tanière, les yeux encore brillants d'une vision envoyée par les aïeux.",
      "À la surprise générale, le Clan des Étoiles ne réclamait pas le lieutenant habituel. Le message était clair : les ancêtres avaient porté leur choix sur Duvet de Framboisier. Le guérisseur expliqua que ce choix n'était pas le fruit du hasard, mais que le Clan des Étoiles avait un but précis pour lui, une destinée que lui seul pouvait accomplir.",
      "C'est ainsi que, du haut de ses 15 lunes, le jeune guerrier reçut le nom d'Étoile de Framboisier. Propulsé à la tête du Clan du Tonnerre à un âge où d'autres terminent à peine leur apprentissage, il doit désormais porter le poids du pouvoir. Entre ses doutes intérieurs, son envie de se faire respecter et le besoin de trouver sa place légitime, Étoile de Framboisier avance sur un sentier semé d'épines, conscient que chaque miaulement et chaque décision seront dorénavant scrutés par tout le Clan.",
    ] },
  ],

  convictions: {
    clan: [
      "Pour Étoile de Framboisier, son clan représente bien plus qu'un simple groupe de guerriers : c'est sa famille, son refuge et son cercle d'amis. Auprès de ses camarades, il se sent profondément à l'aise et leur accorde une confiance totale. Son dévouement est tel qu'il n'hésiterait pas une seule seconde à offrir sa propre vie pour protéger l'un des siens. Pour lui, la survie et le bien-être du Clan du Tonnerre passent avant ses propres besoins.",
      "Pourtant, malgré cet amour indéfectible, une ombre plane sur son quotidien. Son très jeune âge, associé à la lourde responsabilité de son rang, le plonge dans un doute constant. Il hésite souvent sur la marche à suivre, craignant par-dessus tout le regard et le jugement de ses aînés. Cette peur de voir ses camarades lui tourner le dos ou remettre en question sa légitimité à cause de ses vingt lunes est une angoisse qui ne le quitte jamais vraiment.",
      "Loin de se laisser abattre par cette insécurité, Étoile de Framboisier puise dans ses craintes une force insoupçonnée. Il est animé par le désir ardent de prouver sa valeur et de montrer qu'il est digne du choix du Clan des Étoiles. Il est prêt à tout, à travailler plus dur que n'importe qui et à affronter ses propres faiblesses, pour devenir le meilleur meneur que le Clan du Tonnerre n'ait jamais connu. Derrière son calme apparent, brûle la volonté de marquer l'histoire de la forêt par sa sagesse et sa protection.",
    ],
    autres_clans: [
      { nom: "Clan du Vent", chef: "", image: "", attitude: "neutre", texte: "Étoile de Framboisier n'a pas encore d'avis bien tranché. Fidèle à son habitude de rester dans son propre monde et d'observer de loin, il estime qu'il ne les connaît pas encore assez bien pour s'exprimer ou porter un jugement sur leur manière de vivre. Cependant, malgré son côté parfois distant, son cœur reste profondément pacifique. De ce qu'il a pu entendre à leur sujet, il garde une porte ouverte : si jamais les guerriers de la lande venaient à avoir besoin d'une quelconque aide, il n'hésiterait pas à la leur accorder, considérant que l'entraide doit primer sur l'ignorance." },
      { nom: "Clan de l'Ombre", chef: "Étoile Douce", image: "", attitude: "mefiance", texte: "Ses sentiments sont beaucoup plus mitigés. Les rumeurs qui circulent sur Étoile Douce, combinées à ce qu'il a pu observer lui-même lors de la dernière Assemblée, le plongent dans un certain malaise. Il n'est pas tout à fait à l'aise face à l'énergie qui se dégage de ce clan et de sa meneuse. Pourtant, là où d'autres ne verraient que de l'hostilité, Étoile de Framboisier ne peut s'empêcher de ressentir une part de pitié pour eux. Il regarde leur situation avec une pointe de tristesse, se demandant si leur attitude n'est pas simplement le reflet de souffrances cachées qu'il aimerait, au fond, pouvoir apaiser." },
    ],
    etoiles: [
      "Malgré les signes terrifiants envoyés par la Toison Argentée, le chêne foudroyé en pleine assemblée, la dissolution du Clan de la Rivière et le silence imposé à Étoile Douce sous une lune assombrie, la foi d'Étoile de Framboisier reste absolue.",
      "Même la sombre malédiction frappant le guérisseur, dont les cinq apprentis sont morts avant leur baptême, ne le fait pas douter. Pour lui, ces tragédies ne sont pas des coïncidences, mais la preuve de la puissance redoutable des aïeux. Ayant été lui-même témoin des guerriers étoilés, il est un fervent croyant qui accepte leur jugement, aussi sévère soit-il, comme une vérité indiscutable.",
    ],
  },

  galerie: [
    { titre: "Portrait", image: "assets/framboisier-tete.webp", description: "Les yeux bleus, un peu dans la lune, et les oreilles curvées." },
    { titre: "En pose", image: "assets/framboisier-pose.webp", description: "Les freesias mauves derrière les oreilles, la queue en volute." },
  ],

  // Règne : { lune, type: decision|diplomatie|ceremonie|crise|clan|autre, titre, texte }
  regne: [
    { lune: "15", type: "ceremonie", titre: "Choisi par le Clan des Étoiles", texte: "<p>À la mort d'Étoile Brumeuse, le Clan des Étoiles ne désigne pas le lieutenant mais Duvet de Framboisier. Du haut de ses 15 lunes, il reçoit le nom d'Étoile de Framboisier et prend la tête du Clan du Tonnerre.</p>" },
  ],

  // Vies perdues : { lune, cause }
  vies_perdues: [
    { lune: "", cause: "<p>Perdue lors de la chute depuis les Rochers du Soleil, où son frère l'a poussé pour vérifier si son nouveau statut de chef lui octroyait réellement les neuf vies. Il lui en reste huit.</p>" },
  ],

  // Carnet de santé : { titre, type: blessure|maladie|poison|autre, lune_debut, lune_fin, en_cours, pv_perdus, cause, soins, sequelles, sequelles_texte, marque, fragilite, marque_texte }
  sante: [
    { titre: "La chute des Rochers du Soleil", type: "blessure", lune_debut: "", lune_fin: "", en_cours: "non", pv_perdus: "", cause: "<p>Poussé du haut des pierres géantes par son propre frère. Il y a perdu sa première vie.</p>", soins: "", sequelles: "non", sequelles_texte: "", marque: "oui", fragilite: "non", marque_texte: "<p>Une longue cicatrice court tout le long de sa queue.</p>" },
  ],

  // Sections libres : { titre, paragraphes: [...], image } — s'ajoutent depuis le dashboard
  libres: [],

  reglages: {
    // Ordre et visibilité des sections du site (modifiables dans le dashboard)
    sections: [
      { id: "personnage", nom: "Personnage", actif: "oui" },
      { id: "histoire", nom: "Histoire", actif: "oui" },
      { id: "meneur", nom: "Meneur", actif: "oui" },
      { id: "relations", nom: "Relations", actif: "oui" },
      { id: "scenes", nom: "Scènes RP", actif: "oui" },
      { id: "galerie", nom: "Galerie", actif: "oui" },
      { id: "libres", nom: "Pages libres", actif: "oui" },
    ],
    particules: "oui",
    couleur_creme: "#fff6e6",
    couleur_abricot: "#f2a65a",
    couleur_brun: "#8a4f26",
    couleur_turquoise: "#3ec3df",
    couleur_mauve: "#9a62a8",
    texte_pied: "Personnage créé par",
    titre_page: "Étoile de Framboisier — Meneur du Clan du Tonnerre",
  },
};
