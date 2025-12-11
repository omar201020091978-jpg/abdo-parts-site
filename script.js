const panierItems = document.querySelector('.panier-items');
const totalDisplay = document.querySelector('.total');
const viderPanierBtn = document.getElementById('viderPanier');

let panier = [];

// Ajouter au panier
document.querySelectorAll('.commander').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const itemDiv = e.target.closest('.item');
        const nom = itemDiv.dataset.nom;
        const prix = parseInt(itemDiv.dataset.prix);

        const exist = panier.find(p => p.nom === nom);
        if (exist) {
            exist.quantite += 1;
        } else {
            panier.push({ nom, prix, quantite: 1 });
        }
        afficherPanier();
    });
});

// Afficher le panier
function afficherPanier() {
    panierItems.innerHTML = '';
    let total = 0;
    panier.forEach(p => {
        total += p.prix * p.quantite;
        const div = document.createElement('div');
        div.classList.add('panier-item');
        div.innerHTML = `
            <span>${p.nom} x${p.quantite}</span>
            <span>${p.prix * p.quantite} MAD</span>
            <button class="supprimer">Supprimer</button>
        `;
        div.querySelector('.supprimer').addEventListener('click', () => {
            panier = panier.filter(item => item.nom !== p.nom);
            afficherPanier();
        });
        panierItems.appendChild(div);
    });
    totalDisplay.textContent = `Total : ${total} MAD`;
}

// Vider le panier
viderPanierBtn.addEventListener('click', () => {
    panier = [];
    afficherPanier();
});

// Formulaire WhatsApp
const formCommande = document.getElementById('formCommande');
formCommande.addEventListener('submit', (e) => {
    e.preventDefault();
    if (panier.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    const nom = formCommande.nom.value;
    const tel = formCommande.tel.value;
    const adresse = formCommande.adresse.value;

    let message = `Commande ABDO Parts:\nNom: ${nom}\nTel: ${tel}\nAdresse: ${adresse}\nProduits:\n`;
    panier.forEach(p => {
        message += `- ${p.nom} x${p.quantite} = ${p.prix * p.quantite} MAD\n`;
    });
    message += `Total: ${panier.reduce((sum, p) => sum + p.prix * p.quantite, 0)} MAD`;

    const encodedMessage = encodeURIComponent(message);
    const numero = "212610601753"; // numéro WhatsApp international

    window.open(`https://wa.me/${numero}?text=${encodedMessage}`, '_blank');
});
