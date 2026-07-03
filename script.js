const dishImages = {
    'פנה': { 'פסטו': 'PHOTO-2026-07-02-23-39-23.jpg', 'שמנת': 'PHOTO-2026-07-02-23-39-24 2.jpg', 'פטריות': 'PHOTO-2026-07-02-23-39-24 3.jpg', 'עגבניות': 'PHOTO-2026-07-02-23-39-24.jpg', 'רוזה': 'PHOTO-2026-07-02-23-39-23 3.jpg', 'ללא רוטב': 'PHOTO-2026-07-02-23-39-23 2.jpg' },
    'פוזילי': { 'פסטו': 'PHOTO-2026-07-02-23-39-11.jpg', 'שמנת': 'PHOTO-2026-07-02-23-39-15.jpg', 'פטריות': 'PHOTO-2026-07-02-23-39-11 5.jpg', 'עגבניות': 'PHOTO-2026-07-02-23-39-11 4.jpg',  'רוזה': 'PHOTO-2026-07-02-23-39-11 3.jpg', 'ללא רוטב': 'PHOTO-2026-07-02-23-39-11 2.jpg' },
    'ספגטי': { 'פסטו': 'PHOTO-2026-07-02-23-39-07.jpg', 'שמנת': 'PHOTO-2026-07-02-23-39-07 5.jpg', 'עגבניות': 'PHOTO-2026-07-02-23-39-07 4.jpg', 'רוזה': 'PHOTO-2026-07-02-23-39-07 3.jpg', 'ללא רוטב': 'PHOTO-2026-07-02-23-39-07 2.jpg' },
    'פרפלה': { 'פסטו': 'PHOTO-2026-07-02-23-39-39 2.jpg', 'פטריות': 'PHOTO-2026-07-02-23-39-39.jpg', 'רוזה': 'PHOTO-2026-07-02-23-39-40 2.jpg', 'עגבניות': 'PHOTO-2026-07-02-23-39-40 3.jpg', 'שמנת': 'PHOTO-2026-07-02-23-39-40 4.jpg', 'ללא רוטב': 'PHOTO-2026-07-02-23-39-40.jpg' }
};

const imageAssets = {
    toppings: { 'טבעות בצל': 'PHOTO-2026-07-02-23-40-09.jpg', 'סלט ירקות': 'PHOTO-2026-07-02-23-40-10 2.jpg', 'ציפס': 'PHOTO-2026-07-02-23-40-10 3.jpg', 'לחם שום': 'PHOTO-2026-07-02-23-40-10 4.jpg', 'סלט יווני': 'PHOTO-2026-07-02-23-40-10 5.jpg', 'גבינת פרמזן': 'PHOTO-2026-07-02-23-40-10.jpg' },
    drinks: { 'תה חם': 'PHOTO-2026-07-02-23-39-55 4.jpg', 'מים': 'PHOTO-2026-07-02-23-39-55 5.jpg', 'אספרסו': 'PHOTO-2026-07-02-23-39-55 6.jpg', 'קולה': 'PHOTO-2026-07-02-23-39-55.jpg', 'תה קר': 'PHOTO-2026-07-02-23-39-54 2.jpg', 'מיץ תפוזים': 'PHOTO-2026-07-02-23-39-54.jpg', 'מיץ תפוחים קר': 'PHOTO-2026-07-02-23-39-55 2.jpg', 'פאנטה': 'PHOTO-2026-07-02-23-39-55 3.jpg' }
};

const mainDishImg = document.getElementById('main-dish-img');
const emptyPlaceholder = document.getElementById('empty-plate-placeholder');
const nameInput = document.getElementById('customer-name');
const submitBtn = document.getElementById('submit-btn');
const displayNameSpan = document.getElementById('display-name');
const sauceInputs = document.querySelectorAll('input[name="sauce"]');

// חסימת הרטבים בהתחלה עד בחירת פסטה
sauceInputs.forEach(input => input.disabled = true);

function createFadedImages(containerId, assetsDict, typePrefix) {
    const container = document.getElementById(containerId);
    Object.keys(assetsDict).forEach(itemName => {
        const img = document.createElement('img');
        img.src = `images/${assetsDict[itemName]}`;
        img.id = `img-${typePrefix}-${itemName.replace(/\s+/g, '-')}`;
        img.className = 'faded-img'; 
        container.appendChild(img);
    });
}
createFadedImages('toppings-container', imageAssets.toppings, 'top');
createFadedImages('drinks-container', imageAssets.drinks, 'drink');

function checkFormValidity() {
    const hasName = nameInput.value.trim() !== '';
    const hasPastaRadio = document.querySelector('input[name="pasta-shape"]:checked') !== null;
    submitBtn.disabled = !(hasName && hasPastaRadio);
}

nameInput.addEventListener('input', (e) => {
    displayNameSpan.textContent = e.target.value || '...';
    checkFormValidity();
});

function updateMainDishImage() {
    const selectedPasta = document.querySelector('input[name="pasta-shape"]:checked');
    const selectedSauce = document.querySelector('input[name="sauce"]:checked');
    
    if (selectedPasta) {
        emptyPlaceholder.style.display = 'none';
        
        const pasta = selectedPasta.value;
        const sauce = selectedSauce ? selectedSauce.value : 'ללא רוטב';
        
        if (dishImages[pasta] && dishImages[pasta][sauce]) {
            mainDishImg.src = `images/${dishImages[pasta][sauce]}`;
            mainDishImg.style.display = 'block';
        } else {
            mainDishImg.style.display = 'none'; 
        }
    }
}

document.querySelectorAll('input[name="pasta-shape"]').forEach(radio => {
    radio.addEventListener('change', () => {
        sauceInputs.forEach(input => input.disabled = false);
        
        if(!document.querySelector('input[name="sauce"]:checked')) {
            document.querySelector('input[name="sauce"][value="ללא רוטב"]').checked = true;
        }
        
        updateMainDishImage();
        checkFormValidity();
    });
});

sauceInputs.forEach(radio => {
    radio.addEventListener('change', updateMainDishImage);
});

function handleCheckboxSelection(inputSelector, prefix) {
    document.querySelectorAll(inputSelector).forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const itemName = e.target.value.replace(/\s+/g, '-');
            const imgElement = document.getElementById(`img-${prefix}-${itemName}`);
            if (imgElement) imgElement.classList.toggle('active-img', e.target.checked);
        });
    });
}
handleCheckboxSelection('input[name="topping"]', 'top');
handleCheckboxSelection('input[name="drink"]', 'drink');

const modal = document.getElementById('summary-modal');
submitBtn.addEventListener('click', () => {
    document.getElementById('summary-name').textContent = nameInput.value;
    document.getElementById('summary-pasta').textContent = document.querySelector('input[name="pasta-shape"]:checked')?.value;
    document.getElementById('summary-sauce').textContent = document.querySelector('input[name="sauce"]:checked')?.value || 'ללא רוטב';
    
    const toppings = Array.from(document.querySelectorAll('input[name="topping"]:checked')).map(cb => cb.value).join(', ') || 'ללא';
    const drinks = Array.from(document.querySelectorAll('input[name="drink"]:checked')).map(cb => cb.value).join(', ') || 'ללא';
    
    document.getElementById('summary-toppings').textContent = toppings;
    document.getElementById('summary-drinks').textContent = drinks;
    document.getElementById('summary-notes').textContent = document.getElementById('customer-notes').value || 'אין הערות';

    modal.style.display = 'block';
});

document.getElementById('close-modal-btn').addEventListener('click', () => { modal.style.display = 'none'; });