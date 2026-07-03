const IMAGE_PATH = './Images/';

// מילוני המיפוי הדו-ממדיים עבור נכסי התמונות
const dishImages = {
    'פנה': { 'פסטו': 'Penne_Pesto_Sauce.png', 'שמנת': 'Penne_Cream_Sauce.png', 'פטריות': 'Penne_Mushroom_Sauce.png', 'עגבניות': 'Penne_Tomato_Sauce.png', 'רוזה': 'Penne_Rosa_Sauce.png', 'ללא רוטב': 'Penne_Plain.png' },
    'פוזילי': { 'פסטו': 'Fusilli_Pesto_Sauce.png', 'שמנת': 'Fusilli_Cream_Sauce.png', 'פטריות': 'Fusilli_Mushroom_Sauce.png', 'עגבניות': 'Fusilli_Tomato_Sauce.png', 'רוזה': 'Fusilli_Rosa_Sauce.png', 'ללא רוטב': 'Fusilli_Plain.png' },
    'ספגטי': { 'פסטו': 'Spaghetti_Pesto_Sauce.png', 'שמנת': 'Spaghetti_Cream_Sauce.png', 'פטריות': 'Spaghetti_Mushroom_Sauce.png', 'עגבניות': 'Spaghetti_Tomato_Sauce.png', 'רוזה': 'Spaghetti_Rosa_Sauce.png', 'ללא רוטב': 'Spaghetti_Plain.png' },
    'פרפלה': { 'פסטו': 'Farfalle_Pesto_Sauce.png', 'שמנת': 'Farfalle_Cream_Sauce.png', 'פטריות': 'Farfalle_Mushroom_Sauce.png', 'עגבניות': 'Farfalle_Tomato_Sauce.png', 'רוזה': 'Farfalle_Rosa_Sauce.png', 'ללא רוטב': 'Farfalle_Plain.png' }
};

const imageAssets = {
    toppings: { 'טבעות בצל': 'Onion_Rings.png', 'סלט ירקות': 'Vegetable_Salad.png', 'ציפס': 'Chips.png', 'לחם שום': 'Garlic_Bread.png', 'סלט יווני': 'Greek_Salad.png', 'גבינת פרמזן': 'Parmesan_Cheese.png' },
    drinks: { 'תה חם': 'Tea.png', 'מים': 'Water.png', 'אספרסו': 'Coffe.png', 'קולה': 'Kola.png', 'תה קר': 'FuceTea.png', 'מיץ תפוזים': 'Orange.png', 'מיץ תפוחים קר': 'ColdOrange.png', 'פאנטה': 'Limonada.png' }
};

// הפניות לאלמנטים מה-DOM
const mainDishImg = document.getElementById('main-dish-img');
const emptyPlaceholder = document.getElementById('empty-plate-placeholder');
const nameInput = document.getElementById('customer-name');
const submitBtn = document.getElementById('submit-btn');
const displayNameSpan = document.getElementById('display-name');
const sauceInputs = document.querySelectorAll('input[name="sauce"]');
const pastaInputs = document.querySelectorAll('input[name="pasta-shape"]');
const modal = document.getElementById('summary-modal');

// חסימה התחלתית של בחירת רוטב (עד שתיבחר צורת פסטה)
sauceInputs.forEach(function(input) {
    input.disabled = true;
});

// פונקציה לייצור דינמי של גלריית התמונות המושפעות מהטופס
function createGalleryImages(containerId, assetsDict, typePrefix) {
    const container = document.getElementById(containerId);
    if (!container) return;

    Object.keys(assetsDict).forEach(function(itemName) {
        const img = document.createElement('img');
        img.src = IMAGE_PATH + assetsDict[itemName];
        img.id = 'img-' + typePrefix + '-' + itemName.replace(/\s+/g, '-');
        img.className = 'faded-img';
        img.dataset.name = itemName;
        container.appendChild(img);
    });
}
createGalleryImages('toppings-container', imageAssets.toppings, 'top');
createGalleryImages('drinks-container', imageAssets.drinks, 'drink');

// פונקציית בדיקת תקינות חיובית (Validation)
function checkFormValidity() {
    const hasName = nameInput.value.trim() !== '';
    const hasPastaRadio = document.querySelector('input[name="pasta-shape"]:checked') !== null;
    submitBtn.disabled = !(hasName && hasPastaRadio);
}

nameInput.addEventListener('input', function(e) {
    displayNameSpan.textContent = e.target.value || '...';
    checkFormValidity();
});

// עדכון רטבים זמינים בהתאם לבסיס המנה
function updateAvailableSauces() {
    const selectedPasta = document.querySelector('input[name="pasta-shape"]:checked');
    if (!selectedPasta) return;

    const availableSauces = Object.keys(dishImages[selectedPasta.value] || {});
    let checkedSauceStillValid = false;

    sauceInputs.forEach(function(input) {
        const isAvailable = availableSauces.includes(input.value);
        input.disabled = !isAvailable;
        if (input.checked && isAvailable) checkedSauceStillValid = true;
        else if (input.checked) input.checked = false;
    });

    if (!checkedSauceStillValid) {
        const plainSauceInput = document.querySelector('input[name="sauce"][value="ללא רוטב"]');
        if (plainSauceInput) plainSauceInput.checked = true;
    }
}

// עדכון קובץ המנה העיקרית המשולבת
function updateMainDishImage() {
    const selectedPasta = document.querySelector('input[name="pasta-shape"]:checked');
    const selectedSauce = document.querySelector('input[name="sauce"]:checked');
    if (!selectedPasta) return;

    const pasta = selectedPasta.value;
    const sauce = selectedSauce ? selectedSauce.value : 'ללא רוטב';
    const matchingImage = dishImages[pasta] && dishImages[pasta][sauce];

    if (matchingImage) {
        mainDishImg.src = IMAGE_PATH + matchingImage;
        mainDishImg.style.display = 'block';
        emptyPlaceholder.style.display = 'none';
    }
}

// מאזיני אירועים לקבוצות פקדי הרדיו
pastaInputs.forEach(function(radio) {
    radio.addEventListener('change', function() {
        updateAvailableSauces();
        updateMainDishImage();
        checkFormValidity();
    });
});

sauceInputs.forEach(function(radio) {
    radio.addEventListener('change', updateMainDishImage);
});

// שינוי ויזואלי של התמונות בגלריה בעת סימון תיבות בחירה בטופס
document.querySelectorAll('input[name="topping"], input[name="drink"]').forEach(function(cb) {
    cb.addEventListener('change', function(e) {
        const prefix = e.target.name === 'topping' ? 'top' : 'drink';
        const img = document.getElementById('img-' + prefix + '-' + e.target.value.replace(/\s+/g, '-'));
        if (img) {
            img.classList.toggle('active-img', e.target.checked); // הדגשה/עמעום השקיפות
        }
    });
});

// הפקת חלון סיכום ההזמנה (מודאל)
submitBtn.addEventListener('click', function() {
    const selectedPasta = document.querySelector('input[name="pasta-shape"]:checked');
    const selectedSauce = document.querySelector('input[name="sauce"]:checked');

    document.getElementById('summary-name').textContent = nameInput.value;
    document.getElementById('summary-pasta').textContent = selectedPasta ? selectedPasta.value : '';
    document.getElementById('summary-sauce').textContent = selectedSauce ? selectedSauce.value : 'ללא רוטב';

    document.getElementById('summary-toppings').textContent = Array.from(document.querySelectorAll('input[name="topping"]:checked')).map(function(cb) { return cb.value; }).join(', ') || 'ללא תוספות';
    document.getElementById('summary-drinks').textContent = Array.from(document.querySelectorAll('input[name="drink"]:checked')).map(function(cb) { return cb.value; }).join(', ') || 'ללא שתייה';
    document.getElementById('summary-notes').textContent = document.getElementById('customer-notes').value || 'אין הערות';

    modal.style.display = 'block';
});

// סגירת חלון המודאל מפעילה את פונקציית הניקוי והאתחול
document.getElementById('close-modal-btn').addEventListener('click', function() {
    modal.style.display = 'none';
    cleanTexts();
});

// פונקציית ניקוי ואתחול הטופס (cleanTexts)
function cleanTexts() {
    nameInput.value = '';
    document.getElementById('customer-notes').value = '';
    displayNameSpan.textContent = '...';

    // איפוס פקדי רדיו
    document.querySelectorAll('input[type="radio"]').forEach(function(radio) {
        radio.checked = false;
    });
    sauceInputs.forEach(function(input) {
        input.disabled = true;
    });

    // איפוס צ'ק-בוקסים ושקיפויות תמונות
    document.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
        cb.checked = false;
    });
    document.querySelectorAll('.faded-img').forEach(function(img) {
        img.className = 'faded-img';
    });

    mainDishImg.style.display = 'none';
    mainDishImg.src = '';
    emptyPlaceholder.style.display = 'block';

    checkFormValidity();
}


