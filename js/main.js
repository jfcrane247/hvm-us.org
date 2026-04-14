/* =====================================================
   Hope In The Valley Ministry — Main JavaScript
   ===================================================== */

/* ---------- Mobile Nav ---------- */
(function initNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });

  // Mark active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ---------- Cart System ---------- */
const Cart = (function () {
  const STORAGE_KEY = 'hvm_cart';

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function getItems() { return load(); }

  function addItem(product) {
    const items = load();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    save(items);
    updateCountBadge();
    return items;
  }

  function removeItem(id) {
    const items = load().filter(i => i.id !== id);
    save(items);
    updateCountBadge();
    return items;
  }

  function updateQty(id, qty) {
    const items = load();
    const item = items.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, qty);
      save(items);
    }
    updateCountBadge();
    return items;
  }

  function total() {
    return load().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function count() {
    return load().reduce((sum, i) => sum + i.qty, 0);
  }

  function updateCountBadge() {
    document.querySelectorAll('.cart-count').forEach(el => {
      const c = count();
      el.textContent = c;
      el.style.display = c > 0 ? 'flex' : 'none';
    });
  }

  // Init badge on page load
  document.addEventListener('DOMContentLoaded', updateCountBadge);

  return { getItems, addItem, removeItem, updateQty, total, count, updateCountBadge };
})();

/* ---------- Cart Modal ---------- */
(function initCartModal() {
  const modal   = document.getElementById('cartModal');
  const overlay = document.getElementById('cartOverlay');
  const closeBtn= document.getElementById('cartClose');
  const cartBtn = document.getElementById('cartBtn');
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('cartCheckout');

  if (!modal) return;

  function renderCart() {
    const items = Cart.getItems();
    if (items.length === 0) {
      itemsEl.innerHTML = '<p class="cart-empty">🛒 Your cart is empty</p>';
      totalEl.textContent = '$0.00';
      return;
    }
    itemsEl.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-icon">${item.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', ${item.qty - 1}); renderCartModal()">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', ${item.qty + 1}); renderCartModal()">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="Cart.removeItem('${item.id}'); renderCartModal()">✕ Remove</button>
      </div>
    `).join('');
    totalEl.textContent = '$' + Cart.total().toFixed(2);
  }

  window.renderCartModal = renderCart;

  function openCart() {
    renderCart();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartBtn)   cartBtn.addEventListener('click', openCart);
  if (overlay)   overlay.addEventListener('click', closeCart);
  if (closeBtn)  closeBtn.addEventListener('click', closeCart);
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (Cart.count() === 0) {
        showToast('⚠️ Your cart is empty!');
        return;
      }
      closeCart();
      showToast('✅ Thank you! This is a demo store — checkout coming soon.');
    });
  }
})();

/* ---------- Add-to-Cart buttons ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = {
        id:    btn.dataset.id,
        name:  btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        icon:  btn.dataset.icon || '📦',
      };
      Cart.addItem(product);
      showToast(`🛒 "${product.name}" added to cart!`);
    });
  });
});

/* ---------- Programs Tabs ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const tabs   = document.querySelectorAll('.prog-tab');
  const panels = document.querySelectorAll('.prog-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.panel);
      if (target) target.classList.add('active');
    });
  });
});

/* ---------- Donation Amount Selector ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const amountBtns  = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmount');
  const hiddenInput = document.getElementById('donationAmount');
  if (!amountBtns.length) return;

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const val = btn.dataset.amount;
      if (val === 'custom') {
        if (customInput) customInput.style.display = 'block';
        if (hiddenInput) hiddenInput.value = '';
      } else {
        if (customInput) customInput.style.display = 'none';
        if (hiddenInput) hiddenInput.value = val;
      }
    });
  });
});

/* ---------- Donation Form ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('donationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('donationAmount').value ||
                   document.getElementById('customAmountInput')?.value;
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      showToast('⚠️ Please select or enter a donation amount.');
      return;
    }
    // In a real implementation, redirect to payment processor
    showToast(`❤️ Thank you! Redirecting to secure payment for $${parseFloat(amount).toFixed(2)}…`);
    setTimeout(() => {
      alert('This is a demo. In production, this would redirect to a secure payment processor (e.g., PayPal, Stripe, or Pushpay).');
    }, 1200);
  });
});

/* ---------- Toast Notification ---------- */
let toastTimer;
function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast';
    toast.innerHTML = '<span class="toast-icon"></span><span class="toast-msg"></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-msg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

window.showToast = showToast;

/* ---------- Smooth anchor scroll ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
