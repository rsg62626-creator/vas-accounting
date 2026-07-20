/**
 * ==========================================
 * VAS - 共通アプリケーションロジック (app.js)
 * ==========================================
 */

/* --------------------------------------------------
   数字入力制限
-------------------------------------------------- */
function onlyNumber(element) {
    element.value = element.value.replace(/[^0-9]/g, '');
}


/* --------------------------------------------------
   金額フォーマット
-------------------------------------------------- */
function formatCurrency(amount) {
    return '¥' + Number(amount || 0).toLocaleString();
}


/* --------------------------------------------------
   トースト通知
-------------------------------------------------- */
function showMessage(message, isError = false) {
    createToast(message, isError);
}

function createToast(message, isError) {
    const toast = document.createElement('div');
    toast.className = 'vas-toast';
    toast.textContent = message;

    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '14px 20px';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '0.95rem';
    toast.style.color = 'white';
    toast.style.zIndex = '99999';
    toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
    toast.style.background = isError ? 'var(--danger)' : 'var(--primary)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    toast.style.maxWidth = '80vw';
    toast.style.whiteSpace = 'pre-line';

    document.body.appendChild(toast);

    setTimeout(() => { toast.style.opacity = '1'; }, 50);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}


/* --------------------------------------------------
   軽量ローディング表示（画面右上のスピナー）
-------------------------------------------------- */
function toggleLoading(isLoading) {
    let spinner = document.getElementById('vas-mini-spinner');

    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'vas-mini-spinner';
        spinner.style.position = 'fixed';
        spinner.style.top = '15px';
        spinner.style.right = '15px';
        spinner.style.fontSize = '1.2rem';
        spinner.style.color = 'var(--primary)';
        spinner.style.zIndex = '9999';
        spinner.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
        spinner.style.display = 'none';
        document.body.appendChild(spinner);
    }

    spinner.style.display = isLoading ? 'block' : 'none';
}


/* --------------------------------------------------
   入力補助：日付の自動入力（今日の日付）
-------------------------------------------------- */
function setTodayIfEmpty(inputId) {
    const el = document.getElementById(inputId);
    if (el && !el.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        el.value = `${yyyy}-${mm}-${dd}`;
    }
}


/* --------------------------------------------------
   入力補助：金額の自動フォーマット（入力後）
-------------------------------------------------- */
function autoFormatAmount(inputId) {
    const el = document.getElementById(inputId);
    if (!el) return;

    el.addEventListener('blur', () => {
        if (el.value) {
            el.value = Number(el.value).toLocaleString();
        }
    });

    el.addEventListener('focus', () => {
        el.value = el.value.replace(/,/g, '');
    });
}


/* --------------------------------------------------
   汎用：DOM要素の存在チェック
-------------------------------------------------- */
function exists(id) {
    return document.getElementById(id) !== null;
}


/* --------------------------------------------------
   汎用：スムーズスクロール
-------------------------------------------------- */
function smoothScrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


/* --------------------------------------------------
   汎用：簡易バリデーション
-------------------------------------------------- */
function validateRequired(id, label = '') {
    const el = document.getElementById(id);
    if (!el || !el.value) {
        showMessage(`${label || id} を入力してください`, true);
        return false;
    }
    return true;
}
