document.addEventListener('DOMContentLoaded', () => {
    console.log("Le site est chargé et prêt !"); // Vérification console

    // 1. Initialiser le compteur du panier
    updateCartCount();
    
    // Si on est sur la page panier, on affiche les articles
    if (window.location.pathname.includes('panier.html')) {
        displayCart();
    }

    // 2. Menu Mobile (Hamburger)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 3. Boutons "Ajouter au panier"
    // On sélectionne TOUS les types de boutons possibles
    const addButtons = document.querySelectorAll('.btn-link, .btn-add, .btn-primary'); 
    
    addButtons.forEach(button => {
        // On vérifie que ce bouton sert bien à ajouter (qu'il est dans une carte produit)
        if(button.closest('.product-card')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Récupération des infos
                const card = button.closest('.product-card');
                const titleElement = card.querySelector('h3');
                const priceElement = card.querySelector('.price');

                // Sécurité : si on ne trouve pas le titre ou le prix
                if (!titleElement || !priceElement) {
                    console.error("Erreur : Titre ou prix introuvable pour ce produit");
                    return;
                }

                const title = titleElement.innerText;
                const priceText = priceElement.innerText;
                // On garde juste les chiffres (enlève " DH" ou les espaces)
                const price = parseInt(priceText.replace(/[^0-9]/g, '')); 
                
                const product = {
                    title: title,
                    price: price,
                    quantity: 1
                };

                addToCart(product);
            });
        }
    });
});

// --- FONCTIONS ---

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('efiloCart')) || [];
    
    const existingProductIndex = cart.findIndex(item => item.title === product.title);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('efiloCart', JSON.stringify(cart));
    updateCartCount();
    
    // Message de confirmation
    alert("Produit ajouté : " + product.title + " 🌸");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('efiloCart')) || [];
    const countElement = document.getElementById('cart-count');
    
    if(countElement) {
        const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
        countElement.innerText = totalCount;
    }
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('efiloCart')) || [];
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('cart-summary');
    const totalElement = document.getElementById('cart-total');

    if(!container) return; // Sécurité si on n'est pas sur la page panier

    container.innerHTML = ''; 

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; margin-top: 2rem;">Votre panier est vide 😔</p><div style="text-align:center; margin-top:20px;"><a href="bracelets.html" class="btn btn-dark" style="background:#5D4D4A; color:white; padding:10px 20px; border-radius:20px; text-decoration:none;">Retourner à la boutique</a></div>';
        if(summary) summary.style.display = 'none';
        return;
    }

    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        const itemHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 1.5rem 0;">
                <div>
                    <h4 style="font-family: 'Playfair Display', serif; font-size: 1.1rem; margin-bottom: 5px;">${item.title}</h4>
                    <span style="color: #E6A4B4; font-weight: bold;">${item.price} DH</span>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-size: 0.9rem; color: #888;">x${item.quantity}</span>
                    <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #cc5555; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += itemHTML;
    });

    if(totalElement) totalElement.innerText = totalPrice + ' DH';
    if(summary) summary.style.display = 'block';
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('efiloCart'));
    cart.splice(index, 1);
    localStorage.setItem('efiloCart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('efiloCart')) || [];
    if(cart.length === 0) return;

    let message = "Bonjour Efilo ! Je souhaite commander :%0A";
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.title} (x${item.quantity}) : ${item.price * item.quantity} DH%0A`;
        total += item.price * item.quantity;
    });

    message += `%0ATotal = ${total} DH`;
    
    // Remplace par ton numéro ici
    const phoneNumber = "212600000000"; 
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}