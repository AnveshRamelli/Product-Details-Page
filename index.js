const mainImage = document.getElementById('mainImage');
const thumbnailsContainer = document.getElementById('thumbnails');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');
const productName = document.getElementById('productName');
const productDescription = document.getElementById('productDescription');
const productPrice = document.getElementById('productPrice');
const quantityInput = document.getElementById('quantity');
const variantSelect = document.getElementById('variant');
const addToCartButton = document.getElementById('addToCart');
const confirmationMessage = document.getElementById('confirmationMessage');

let images = []; // Store images fetched from the API
let currentIndex = 0;

// Fetch product data from an API
const fetchProductData = async (productId) => {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const product = await response.json();
        
        // Update product details
        productName.textContent = product.title;
        productDescription.textContent = product.description;
        productPrice.textContent = product.price;

        images = product.images; 
        populateCarousel();
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// Populate the carousel with images
const populateCarousel = () => {
    if (!images.length) return;

    // Set the initial main image
    mainImage.src = images[0];

    // Populate thumbnails
    thumbnailsContainer.innerHTML = ''; // Clear existing thumbnails
    images.forEach((src, index) => {
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnailDiv.dataset.index = index;

        const imgElement = document.createElement('img');
        imgElement.src = src;

        thumbnailDiv.appendChild(imgElement);
        thumbnailsContainer.appendChild(thumbnailDiv);

        // Add click event to update main image
        thumbnailDiv.addEventListener('click', () => {
            updateMainImage(index);
        });
    });
}

// Update main image and set active thumbnail
const updateMainImage = (index) => {
    currentIndex = index;
    mainImage.src = images[currentIndex];
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

const validateQuantity = () => {
    const quantityValue = parseInt(quantityInput.value);
    addToCartButton.disabled = quantityValue < 1;
}

// Arrow navigation for carousel
leftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateMainImage(currentIndex);
});

rightArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateMainImage(currentIndex);
});

quantityInput.addEventListener('input', validateQuantity);

// Add to Cart functionality
addToCartButton.addEventListener('click', () => {
    const selectedProduct = {
        name: productName.textContent,
        description: productDescription.textContent,
        price: productPrice.textContent,
        quantity: quantityInput.value,
        variant: variantSelect.value
    } 
    console.log(selectedProduct);
    confirmationMessage.textContent = 'Product added to cart!';
    confirmationMessage.classList.remove('hidden');
    confirmationMessage.classList.add('toast');
    setTimeout(() => confirmationMessage.classList.add('hidden'), 3000)
});

// Load product data on page load by generating a random product ID 
fetchProductData(Math.floor(Math.random() * 100) + 1);

