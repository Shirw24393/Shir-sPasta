const IMAGE_PATH = './images/';

// מילוני המיפוי הדו-ממדיים עבור נכסי התמונות המשולבות
const dishImages = {
    'פנה': { 'פסטו': 'Penne_Pesto_Sauce.png', 'שמנת': 'Penne_Cream_Sauce.png', 'פטריות': 'Penne_Mushroom_Sauce.png', 'עגבניות': 'Penne_Tomato_Sauce.png', 'רוזה': 'Penne_Rosa_Sauce.png', 'ללא רוטב': 'Penne_Plain.png' },
    'פוזילי': { 'פסטו': 'Fusilli_Pesto_Sauce.png', 'שמנת': 'Fusilli_Cream_Sauce.png', 'פטריות': 'Fusilli_Mushroom_Sauce.png', 'עגבניות': 'Fusilli_Tomato_Sauce.png', 'רוזה': 'Fusilli_Rosa_Sauce.png', 'ללא רוטב': 'Fusilli_Plain.png' },
    'ספגטי': { 'פסטו': 'Spaghetti_Pesto_Sauce.png', 'שמנת': 'Spaghetti_Cream_Sauce.png', 'פטריות': 'Spaghetti_Mushroom_Sauce.png', 'עגבניות': 'Spaghetti_Tomato_Sauce.png', 'רוזה': 'Spaghetti_Rosa_Sauce.png', 'ללא רוטב': 'Spaghetti_Plain.png' },
    'פרפלה': { 'פסטו': 'Farfalle_Pesto_Sauce.png', 'שמנת': 'Farfalle_Cream_Sauce.png', 'פטריות': 'Farfalle_Mushroom_Sauce.png', 'עגבניות': 'Farfalle_Tomato_Sauce.png', 'רוזה': 'Farfalle_Rosa_Sauce.png', 'ללא רוטב': 'Farfalle_Plain.png' }
};

// הפניות לאלמנטים קבועים מה-DOM
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

// פונקציית בדיקת תקינות חיובית (Validation) לטופס
function checkFormValidity() {
    const hasName = nameInput.value.trim() !== '';
    const hasPastaRadio = document.querySelector('input[name="pasta-shape"]:checked') !== null;
    submitBtn.disabled = !(hasName && hasPastaRadio);
}

nameInput.addEventListener('input', function(e) {
    displayNameSpan.textContent = e.target.value || '...';
    checkFormValidity();
});

// עדכון רטבים זמינים בהתאם לבסיס המנה שנבחרה
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
        document.querySelector('input[name="sauce"][value="ללא רוטב"]').checked = true;
    }
}

// עדכון קובץ תמונת המנה העיקרית המשולבת בצלחת
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

// האזנה לשינויים בפקדי הרדיו של המנה
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

// תיקון השגיאה הווירטואלית: שינוי ויזואלי של התמונות הקיימות ב-HTML בעת סימון תיבות בחירה
document.querySelectorAll('input[name="topping"], input[name="drink"]').forEach(function(cb) {
    cb.addEventListener('change', function(e) {
        // התאמה ישירה ל-ID של התמונות כפי שהן מופיעות ב-HTML (למשל: img_Garlic_Bread)
        const img = document.getElementById('img_' + e.target.value);
        if (img) {
            img.classList.toggle('active-img', e.target.checked); // הדגשה או עמעום השקיפות
        }
    });
});

// הפקת חלון סיכום ההזמנה במודאל
submitBtn.addEventListener('click', function() {
    document.getElementById('summary-name').textContent = nameInput.value;
    document.getElementById('summary-pasta').textContent = document.querySelector('input[name="pasta-shape"]:checked')?.value;
    document.getElementById('summary-sauce').textContent = document.querySelector('input[name="sauce"]:checked')?.value || 'ללא רוטב';

    document.getElementById('summary-toppings').textContent = Array.from(document.querySelectorAll('input[name="topping"]:checked')).map(function(cb) { return cb.value; }).join(', ') || 'ללא תוספות';
    document.getElementById('summary-drinks').textContent = Array.from(document.querySelectorAll('input[name="drink"]:checked')).map(function(cb) { return cb.value; }).join(', ') || 'ללא שתייה';
    document.getElementById('summary-notes').textContent = document.getElementById('customer-notes').value || 'אין הערות';

    modal.style.display = 'block';
});

// סגירת חלון המודאל מפעילה את פונקציית הניקוי והאתחול הנדרשת
document.getElementById('close-modal-btn').addEventListener('click', function() {
    modal.style.display = 'none';
    cleanTexts();
});

// פונקציית ניקוי ואתחול הטופס (cleanTexts) חזרה למצב ההתחלתי
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

    // איפוס צ'ק-בוקסים והחזרת כל תמונות הגלריה לחצי שקיפות
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
