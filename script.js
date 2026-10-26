    const champTache = document.getElementById("nouvelle-tache");
    const boutonAjouter = document.getElementById("bouton-ajouter");
    const listeTaches = document.getElementById("liste-taches");

    // On récupère les tâches déjà enregistrées.
    let taches = JSON.parse(localStorage.getItem("taches")) || [];

    function sauvegarderTaches() {
        localStorage.setItem("taches", JSON.stringify(taches));
    }

    function afficherTaches() {

        // On vide la liste avant de la reconstruire.
        listeTaches.innerHTML = "";

        taches.forEach(function(tache, index) {

            const ligne = document.createElement("li");
            if (tache.terminee) {
    ligne.classList.add("tache-terminee");
}

            // Case à cocher
            const caseCocher = document.createElement("input");
            caseCocher.type = "checkbox";
            caseCocher.checked = tache.terminee;

            // Texte de la tâche
            const texte = document.createElement("span");
            texte.textContent = tache.texte;

            if (tache.terminee) {
                texte.style.textDecoration = "line-through";
            }

            // Bouton supprimer
            const boutonSupprimer = document.createElement("button");
            boutonSupprimer.textContent = "🗑";
boutonSupprimer.className = "bouton-supprimer";
boutonSupprimer.setAttribute("aria-label", "Supprimer la tâche");
boutonSupprimer.title = "Supprimer la tâche";

            // Quand on coche ou décoche
            caseCocher.addEventListener("change", function() {
                taches[index].terminee = caseCocher.checked;
                sauvegarderTaches();
                afficherTaches();
            });

            // Quand on supprime
            boutonSupprimer.addEventListener("click", function() {
                taches.splice(index, 1);
                sauvegarderTaches();
                afficherTaches();
            });

            ligne.appendChild(caseCocher);
            ligne.appendChild(texte);
            ligne.appendChild(boutonSupprimer);

            listeTaches.appendChild(ligne);
        });
    }

    function ajouterTache() {

        const texteTache = champTache.value.trim();

        if (texteTache !== "") {

            taches.push({
                texte: texteTache,
                terminee: false
            });

            sauvegarderTaches();
            afficherTaches();

            champTache.value = "";
        }
    }

    boutonAjouter.addEventListener("click", ajouterTache);

    afficherTaches();



 // Navigation entre les trois sections

const ongletTaches = document.getElementById("onglet-taches");
const ongletBesoins = document.getElementById("onglet-besoins");
const ongletCourses = document.getElementById("onglet-courses");

const sectionTaches = document.getElementById("section-taches");
const sectionBesoins = document.getElementById("section-besoins");
const sectionCourses = document.getElementById("section-courses");


function afficherSection(section) {

    const sections = {
        taches: sectionTaches,
        besoins: sectionBesoins,
        courses: sectionCourses
    };

    const onglets = {
        taches: ongletTaches,
        besoins: ongletBesoins,
        courses: ongletCourses
    };

    Object.keys(sections).forEach(function(nom) {
        const actif = nom === section;

        sections[nom].hidden = !actif;
        onglets[nom].classList.toggle("actif", actif);
        onglets[nom].setAttribute("aria-pressed", actif);
    });

    if (section === "besoins") {
        afficherBesoins();
    }
}

ongletTaches.addEventListener("click", function() {
    afficherSection("taches");
});

ongletBesoins.addEventListener("click", function() {
    afficherSection("besoins");
});

ongletCourses.addEventListener("click", function() {
    retournerAuxListes();
    afficherSection("courses");
});


// AJOUTER UNE TÂCHE AVEC ENTRÉE

champTache.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        ajouterTache();
    }
});


// ========================================
// MES LISTES — Gestion des listes thématiques
// ========================================

const champNomListe = document.getElementById("nom-nouvelle-liste");
const boutonCreerListe = document.getElementById("bouton-creer-liste");
const conteneurListes = document.getElementById("conteneur-listes");
const detailListe = document.getElementById("detail-liste");
const titreListe = document.getElementById("titre-liste");
const boutonRetour = document.getElementById("retour-listes");

// Données indépendantes des tâches
let listesCourses = JSON.parse(
    localStorage.getItem("listesCourses")
) || [];

function sauvegarderListes() {
    localStorage.setItem(
        "listesCourses",
        JSON.stringify(listesCourses)
    );
}

function afficherListes() {
    conteneurListes.innerHTML = "";

    listesCourses.forEach(function(liste) {

        const carte = document.createElement("div");
        carte.className = "carte-liste";

        const boutonOuvrir = document.createElement("button");
        boutonOuvrir.className = "ouvrir-liste";
        boutonOuvrir.type = "button";
        const total = liste.articles.length;

const achetes = liste.articles.filter(function(article) {
    return article.achete;
}).length;

boutonOuvrir.textContent =
    "🛒 " + liste.nom +
    " (" + achetes + "/" + total + ")";

        boutonOuvrir.addEventListener("click", function() {
            ouvrirListe(liste.id);
        });

        const boutonSupprimer = document.createElement("button");
        boutonSupprimer.className = "supprimer-liste";
        boutonSupprimer.type = "button";
        boutonSupprimer.textContent = "🗑";
        boutonSupprimer.setAttribute(
            "aria-label",
            "Supprimer " + liste.nom
        );

        boutonSupprimer.addEventListener("click", function() {
            supprimerListe(liste.id);
        });

        carte.appendChild(boutonOuvrir);
        carte.appendChild(boutonSupprimer);
        conteneurListes.appendChild(carte);
    });
}

function creerListe() {
    const nom = champNomListe.value.trim();

    if (nom === "") {
        return;
    }

    const nouvelleListe = {
        id: crypto.randomUUID(),
        nom: nom,
        articles: []
    };

    listesCourses.push(nouvelleListe);
    sauvegarderListes();
    afficherListes();

    champNomListe.value = "";
}

function supprimerListe(id) {
    const liste = listesCourses.find(function(element) {
        return element.id === id;
    });

    if (!liste) return;

    const confirmation = confirm(
        "Supprimer définitivement la liste « " +
        liste.nom + " » ?"
    );

    if (!confirmation) return;

    listesCourses = listesCourses.filter(function(element) {
        return element.id !== id;
    });

    sauvegarderListes();
    afficherListes();
}


let listeOuverteId = null;

function ouvrirListe(id) {
    const liste = listesCourses.find(function(element) {
        return element.id === id;
    });

    if (!liste) return;

    listeOuverteId = id;
    titreListe.textContent = liste.nom;

    document.querySelector(".creation-liste").hidden = true;
    conteneurListes.hidden = true;
    detailListe.hidden = false;

    afficherArticles();
}


function retournerAuxListes() {
    document.querySelector(".creation-liste").hidden = false;
    conteneurListes.hidden = false;
    detailListe.hidden = true;
    listeOuverteId = null;
}

boutonCreerListe.addEventListener("click", creerListe);

champNomListe.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        creerListe();
    }
});

boutonRetour.addEventListener("click", retournerAuxListes);

afficherListes();


// ========================================
// MES LISTES V0.5.2 — ARTICLES
// ========================================

const champArticle = document.getElementById("nouvel-article");
const boutonAjouterArticle = document.getElementById("bouton-ajouter-article");
const listeArticles = document.getElementById("liste-articles");
const messageListeVide = document.getElementById("message-liste-vide");
const boutonViderListe = document.getElementById("vider-liste");

// Récupérer la liste actuellement ouverte
function obtenirListeOuverte() {
    return listesCourses.find(function(liste) {
        return liste.id === listeOuverteId;
    });
}

// Ajouter un article
function ajouterArticle() {
    const nom = champArticle.value.trim();
    const liste = obtenirListeOuverte();

    if (!nom || !liste) return;

    liste.articles.push({
        id: crypto.randomUUID(),
        nom: nom,
        quantite: "",
        achete: false
    });

    sauvegarderListes();
    afficherArticles();

    champArticle.value = "";
    champArticle.focus();
}

// Afficher les articles
function afficherArticles() {
    const liste = obtenirListeOuverte();

    listeArticles.innerHTML = "";

    if (!liste) return;

    messageListeVide.hidden = liste.articles.length > 0;

    liste.articles.forEach(function(article) {

        const ligne = document.createElement("li");
        ligne.className = "ligne-article";

        if (article.achete) {
            ligne.classList.add("article-achete");
        }

        // Case à cocher
        const caseCocher = document.createElement("input");
        caseCocher.type = "checkbox";
        caseCocher.checked = article.achete;
        caseCocher.setAttribute(
            "aria-label",
            "Article acheté : " + article.nom
        );

        caseCocher.addEventListener("change", function() {
            article.achete = caseCocher.checked;
            sauvegarderListes();
            afficherArticles();
        });

        // Nom de l'article
        const nomArticle = document.createElement("span");
        nomArticle.className = "nom-article";
        nomArticle.textContent = article.nom;

        // Quantité modifiable
        const quantite = document.createElement("input");
        quantite.type = "text";
        quantite.className = "quantite-article";
        quantite.placeholder = "Qté";
        quantite.value = article.quantite;
        quantite.maxLength = 20;
        quantite.setAttribute(
            "aria-label",
            "Quantité pour " + article.nom
        );

        quantite.addEventListener("input", function() {
            article.quantite = quantite.value;
            sauvegarderListes();
        });

       
const boutonSupprimerArticle = document.createElement("button");
boutonSupprimerArticle.type = "button";
boutonSupprimerArticle.className = "supprimer-article";
boutonSupprimerArticle.textContent = "🗑";
boutonSupprimerArticle.title = "Retirer cet article";
boutonSupprimerArticle.setAttribute(
    "aria-label",
    "Retirer " + article.nom
);

boutonSupprimerArticle.addEventListener("click", function() {

    // Confirmation uniquement si des informations risquent d'être perdues
    if (article.quantite.trim() !== "" || article.achete) {

        const confirmation = confirm(
            "Retirer « " + article.nom + " » de cette liste ?\n\n" +
            "Sa quantité ou son état d'achat sera perdu."
        );

        if (!confirmation) return;
    }

    liste.articles = liste.articles.filter(function(element) {
        return element.id !== article.id;
    });

    sauvegarderListes();
    afficherArticles();
});

ligne.appendChild(caseCocher);
ligne.appendChild(nomArticle);
ligne.appendChild(quantite);
ligne.appendChild(boutonSupprimerArticle);

listeArticles.appendChild(ligne);

    });

    afficherListes();
}

// Vider la liste complète
function viderListe() {
    const liste = obtenirListeOuverte();

    if (!liste || liste.articles.length === 0) return;

    const confirmation = confirm(
        "Supprimer tous les articles de « " +
        liste.nom + " » ?"
    );

    if (!confirmation) return;

    liste.articles = [];

    sauvegarderListes();
    afficherArticles();
}

// Événements
boutonAjouterArticle.addEventListener("click", ajouterArticle);

champArticle.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        ajouterArticle();
    }
});

boutonViderListe.addEventListener("click", viderListe);


// ========================================
// MES LISTES V0.6 — BESOINS
// ========================================

/* ========================================
   MES LISTES — V0.9
   Sélection multiple des besoins
======================================== */

const boutonOuvrirSelection = document.getElementById("ouvrir-selection-besoins");
const panneauSelection = document.getElementById("panneau-selection-besoins");
const choixBesoinsCourses = document.getElementById("choix-besoins-courses");

// Ouvrir ou fermer le panneau
boutonOuvrirSelection.addEventListener("click", function() {

    const ouverture = panneauSelection.hidden;

    panneauSelection.hidden = !ouverture;

    boutonOuvrirSelection.setAttribute(
        "aria-expanded",
        String(ouverture)
    );

    if (ouverture) {
        afficherSelectionBesoins();
    }
});

// Afficher les besoins disponibles
function afficherSelectionBesoins() {

    const liste = obtenirListeOuverte();

    if (!liste) return;

    choixBesoinsCourses.innerHTML = "";

    const besoinsTries = [...besoins].sort(function(a, b) {
        return a.nom.localeCompare(b.nom, "fr");
    });

    besoinsTries.forEach(function(besoin) {

        const ligne = document.createElement("label");
        ligne.className = "choix-besoin";

        const caseCocher = document.createElement("input");
        caseCocher.type = "checkbox";

        const dejaPresent = liste.articles.some(function(article) {
            return article.besoinId === besoin.id;
        });

        caseCocher.checked = dejaPresent;

        const nom = document.createElement("span");
        nom.textContent = besoin.nom;

        caseCocher.addEventListener("change", function() {

            if (caseCocher.checked) {

                // Ajouter immédiatement le besoin aux courses
                liste.articles.push({
                    id: crypto.randomUUID(),
                    besoinId: besoin.id,
                    nom: besoin.nom,
                    quantite: "",
                    achete: false
                });

            } else {

                // Retirer le besoin de cette liste
                const article = liste.articles.find(function(element) {
                    return element.besoinId === besoin.id;
                });

                if (article) {

                    const informationsAPerdre =
                        String(article.quantite || "").trim() !== "" ||
                        article.achete;

                    if (informationsAPerdre) {

                        const confirmation = confirm(
                            "Retirer « " + article.nom + " » des courses ?\n\n" +
                            "Sa quantité ou son état d'achat sera perdu."
                        );

                        if (!confirmation) {
                            caseCocher.checked = true;
                            return;
                        }
                    }

                    liste.articles = liste.articles.filter(function(element) {
                        return element.id !== article.id;
                    });
                }
            }

            sauvegarderListes();
            afficherArticles();
            afficherBesoins();
        });

        ligne.appendChild(caseCocher);
        ligne.appendChild(nom);
        choixBesoinsCourses.appendChild(ligne);
    });
}

const champBesoin = document.getElementById("nouveau-besoin");
const boutonAjouterBesoin = document.getElementById("bouton-ajouter-besoin");
const listeBesoins = document.getElementById("liste-besoins");
const messageBesoinsVides = document.getElementById("message-besoins-vides");
const fenetreDestination = document.getElementById("fenetre-destination");
const boutonFermerDestination = document.getElementById("fermer-destination");
const texteDestination = document.getElementById("texte-destination");
const choixDestinations = document.getElementById("choix-destinations");


let besoins = JSON.parse(
    localStorage.getItem("mesBesoins")
) || [];

function sauvegarderBesoins() {
    localStorage.setItem(
        "mesBesoins",
        JSON.stringify(besoins)
    );
}

function ajouterBesoin() {
    const nom = champBesoin.value.trim();

    if (!nom) return;

    besoins.push({
        id: crypto.randomUUID(),
        nom: nom
    });

    sauvegarderBesoins();
    afficherBesoins();

    champBesoin.value = "";
    champBesoin.focus();
}

// Vérifie si le besoin figure dans une liste
function besoinEstPrevu(id) {
    return listesCourses.some(function(liste) {
        return liste.articles.some(function(article) {
            return article.besoinId === id;
        });
    });
}

function afficherBesoins() {
    listeBesoins.innerHTML = "";

    messageBesoinsVides.hidden = besoins.length > 0;

    besoins.forEach(function(besoin) {

        const ligne = document.createElement("li");
        ligne.className = "ligne-besoin";

        const nom = document.createElement("span");
        nom.className = "nom-besoin";
        nom.textContent = besoin.nom;

        const statut = document.createElement("span");
        statut.className = "statut-besoin";

        const prevu = besoinEstPrevu(besoin.id);

        statut.textContent = prevu ? "Prévu" : "À prévoir";

        if (prevu) {
            statut.classList.add("statut-prevu");
        }

        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.className = "envoyer-besoin";
        bouton.textContent = "→";
        bouton.title = "Ajouter à une liste de courses";
        bouton.setAttribute(
            "aria-label",
            "Envoyer " + besoin.nom + " aux courses"
        );

        bouton.addEventListener("click", function() {
            choisirListePourBesoin(besoin);
        });


const boutonModifier = document.createElement("button");
boutonModifier.type = "button";
boutonModifier.className = "modifier-besoin";
boutonModifier.textContent = "✏️";
boutonModifier.title = "Renommer ce besoin";
boutonModifier.setAttribute(
    "aria-label",
    "Renommer " + besoin.nom
);

boutonModifier.addEventListener("click", function() {

    const nouveauNom = prompt(
        "Nouveau nom du besoin :",
        besoin.nom
    );

    if (nouveauNom === null) return;

    const nomCorrige = nouveauNom.trim();

    if (nomCorrige === "") {
        alert("Le nom ne peut pas être vide.");
        return;
    }

    besoin.nom = nomCorrige;
    sauvegarderBesoins();

    // Mettre à jour le nom dans les listes de courses
    listesCourses.forEach(function(liste) {
        liste.articles.forEach(function(article) {
            if (article.besoinId === besoin.id) {
                article.nom = nomCorrige;
            }
        });
    });

    sauvegarderListes();
    afficherBesoins();
    afficherListes();
});


const boutonSupprimerBesoin = document.createElement("button");
boutonSupprimerBesoin.type = "button";
boutonSupprimerBesoin.className = "supprimer-besoin";
boutonSupprimerBesoin.textContent = "🗑";
boutonSupprimerBesoin.title = "Supprimer ce besoin";
boutonSupprimerBesoin.setAttribute(
    "aria-label",
    "Supprimer " + besoin.nom
);

boutonSupprimerBesoin.addEventListener("click", function() {

    const confirmation = confirm(
        "Supprimer « " + besoin.nom + " » du catalogue ?\n\n" +
        "Les articles déjà présents dans les listes de courses seront conservés."
    );

    if (!confirmation) return;

    besoins = besoins.filter(function(element) {
        return element.id !== besoin.id;
    });

    sauvegarderBesoins();
    afficherBesoins();
});

ligne.appendChild(nom);
ligne.appendChild(statut);
ligne.appendChild(boutonModifier);
ligne.appendChild(bouton);
ligne.appendChild(boutonSupprimerBesoin);

listeBesoins.appendChild(ligne);


    });
}

// Choisir une liste de destination

// Afficher la fenêtre de sélection
function choisirListePourBesoin(besoin) {

    if (listesCourses.length === 0) {
        alert("Crée d'abord une liste dans Courses.");
        return;
    }

    texteDestination.textContent =
        "Où ajouter « " + besoin.nom + " » ?";

    choixDestinations.innerHTML = "";

    listesCourses.forEach(function(liste) {

        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.className = "bouton-destination";
        bouton.textContent = "🛒 " + liste.nom;

        bouton.addEventListener("click", function() {
            envoyerBesoinVersListe(besoin, liste);
        });

        choixDestinations.appendChild(bouton);
    });

    fenetreDestination.hidden = false;
    boutonFermerDestination.focus();
}

// Transférer le besoin vers la liste choisie
function envoyerBesoinVersListe(besoin, liste) {

    const existe = liste.articles.some(function(article) {
        return article.besoinId === besoin.id;
    });

    if (existe) {
        alert("Ce besoin figure déjà dans cette liste.");
        return;
    }

    liste.articles.push({
        id: crypto.randomUUID(),
        besoinId: besoin.id,
        nom: besoin.nom,
        quantite: "",
        achete: false
    });

    sauvegarderListes();
    afficherBesoins();
    fermerFenetreDestination();
}

// Fermer la fenêtre
function fermerFenetreDestination() {
    fenetreDestination.hidden = true;
}

boutonAjouterBesoin.addEventListener("click", ajouterBesoin);

champBesoin.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        ajouterBesoin();
    }
});

afficherBesoins();


boutonFermerDestination.addEventListener(
    "click",
    fermerFenetreDestination
);

// Fermer en touchant l'arrière-plan
fenetreDestination.addEventListener("click", function(event) {
    if (event.target === fenetreDestination) {
        fermerFenetreDestination();
    }
});

// Fermer avec la touche Échap
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && !fenetreDestination.hidden) {
        fermerFenetreDestination();
    }
});
