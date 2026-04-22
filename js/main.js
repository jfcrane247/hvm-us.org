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
