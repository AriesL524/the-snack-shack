const menuItems = [
  { id: 'doritos', name: 'Doritos', price: 2.5, description: 'A crunchy corn snack with a bold cheese flavor.', image: 'images/snacks/doritos.png' },
  { id: 'hot-cheeto', name: 'Hot Cheeto', price: 2.5, description: 'Crunchy corn snacks with a hot, cheesy seasoning.', image: 'images/snacks/hot_cheeto.png' },
  { id: 'kitkat', name: 'KitKat', price: 2.0, description: 'Crisp wafer fingers covered in milk chocolate.', image: 'images/snacks/kitkat.png' },
  { id: 'reeses', name: 'Reese’s', price: 2.0, description: 'Milk chocolate with a smooth peanut butter center.', image: 'images/snacks/reeses.png' },
  { id: 'skittles', name: 'Skittles', price: 2.0, description: 'Small, colorful candies with a crisp shell and fruit flavors.', image: 'images/snacks/skittles.png' },
  { id: 'sour-patch-kids', name: 'Sour Patch Kids', price: 2.5, description: 'Soft gummy candy with a sour coating and a sweet finish.', image: 'images/snacks/sour_patch_kids.png' },
  { id: 'takis', name: 'Takis', price: 2.5, description: 'Rolled corn tortilla chips with a hot chili-lime flavor.', image: 'images/snacks/takis.png' },
  { id: 'trolli', name: 'Trolli', price: 2.5, description: 'Chewy gummy candy with bright colors and fruit flavors.', image: 'images/snacks/trolli.png' }
];

const bag = [];
const menuGrid = document.querySelector('#menu-grid');
const orderList = document.querySelector('#order-list');
const orderTotal = document.querySelector('#order-total');
const orderCount = document.querySelector('#order-count');
const checkoutButton = document.querySelector('#checkout-button');
const toast = document.querySelector('#toast');

function renderMenu() {
  menuGrid.innerHTML = menuItems.map(item => `
    <article class="menu-card">
      <div class="food-image">
        <img src="${item.image}" alt="Photo of ${item.name}" />
      </div>
      <div class="card-content">
        <div class="card-top"><h3 class="card-title">${item.name}</h3><span class="price">$${item.price.toFixed(2)}</span></div>
        <p class="card-description">${item.description}</p>
        <button class="button add-button" data-item="${item.id}" type="button">Add to bag <span class="material-symbols-outlined" aria-hidden="true">add</span></button>
      </div>
    </article>`).join('');
}

function renderOrder() {
  const total = bag.reduce((sum, item) => sum + item.price, 0);
  orderCount.textContent = `${bag.length} ${bag.length === 1 ? 'item' : 'items'}`;
  orderTotal.textContent = `$${total.toFixed(2)}`;
  checkoutButton.disabled = bag.length === 0;
  const grouped = menuItems.map(item => ({ item, count: bag.filter(entry => entry.id === item.id).length })).filter(group => group.count);
  orderList.innerHTML = grouped.length ? grouped.map(({ item, count }) => `
    <div class="order-item"><div class="order-item-info"><img class="order-item-image" src="${item.image}" alt="" /><span>${item.name}, quantity ${count}</span></div><button class="remove-item" aria-label="Remove one serving of ${item.name}" data-remove="${item.id}" type="button"><span class="material-symbols-outlined" aria-hidden="true">close</span></button></div>`).join('') : '<p class="empty-order">No items have been selected.</p>';
  document.querySelectorAll('.add-button').forEach(button => {
    const added = bag.some(item => item.id === button.dataset.item);
    button.classList.toggle('added', added);
    button.innerHTML = added ? 'Add another serving <span class="material-symbols-outlined" aria-hidden="true">add</span>' : 'Add to bag <span class="material-symbols-outlined" aria-hidden="true">add</span>';
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

menuGrid.addEventListener('click', event => {
  const button = event.target.closest('.add-button');
  if (!button) return;
  const item = menuItems.find(entry => entry.id === button.dataset.item);
  bag.push(item);
  renderOrder();
  showToast(`${item.name} was added to your bag.`);
  document.querySelector('#order').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

orderList.addEventListener('click', event => {
  const button = event.target.closest('[data-remove]');
  if (!button) return;
  const removedIndex = bag.findIndex(item => item.id === button.dataset.remove);
  const removed = bag.splice(removedIndex, 1)[0];
  renderOrder();
  showToast(`One serving of ${removed.name} was removed.`);
});

checkoutButton.addEventListener('click', () => {
  if (!bag.length) return;
  const firstName = window.prompt('What name should we put on the bag?');
  if (!firstName || !firstName.trim()) return;
  showToast(`Thank you, ${firstName.trim()}. Your order will be ready by the library.`);
  bag.length = 0;
  renderOrder();
});

renderMenu();
renderOrder();
