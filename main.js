const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productDOM = document.querySelector('.products');
const productUL = document.querySelector('section.products ul');
const productLI = document.createElement('li');
const p = document.createElement('p');
const prodPrice = document.getElementById('prodPrice');
const selectCurrency = document.getElementById('currencies');

let cart = [];
let buttonsDOM = [];
let prices = [];

const convertedCur = document.getElementById('converted-currency');
const conversionResult = document.createElement('p');
convertedCur.appendChild(conversionResult); //display the converted result on option change

class Products {
  //fetch products
  async getProducts() {
    try {
      const res = await fetch('products.json');
      const data = await res.json();
      let products = data.items;
      products = products.map(item => {
        const { id, title, price, image } = item;
        return { id, title, price, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class ShoppingCart {
  // product section
  renderProducts(products) {
    console.log(products);
    let result = '';
    products.forEach(product => {
      result += `
      <article class="product">
                <div class="img-container">
                <img src=${product.image} alt="product" class="product-img">
                </div>
                <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>add to cart</button>
                <h3>${product.title}</h3>
                <h4 id="prodPrice">€ ${product.price}</h4>
            </article>    
      `;
    });
    productDOM.innerHTML = result;
  }

  getCartButton() {
    const buttons = [...document.querySelectorAll('.bag-btn')];
    // console.log(buttons);
    buttonsDOM = buttons;
    buttons.forEach(button => {
      const { id } = button.dataset;
      // console.log(id);
      const inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = 'In Cart';
        button.disable = true;
      }
      button.addEventListener('click', event => {
        // console.log(event);
        event.target.innerText = 'In Cart';
        event.target.disabled = true;
        // get products
        const cartItem = { ...Storage.getProduct(id), amount: 1 };
        // console.log(cartItem);
        // add product to the cart
        cart = [...cart, cartItem];
        //console.log(cart);
        // save cart in local storage
        Storage.saveCart(cart);
        // set cart values
        this.setCartTotal(cart);
        // display cart items
        this.addToCart(cartItem);
        // show the cart
        this.showCart();
      });
    });
  }

  setCartTotal(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = `€ ${parseFloat(tempTotal.toFixed(2))}`;
    cartItems.innerText = itemsTotal;
    // console.log(cartTotal, cartItems);
  }

  addToCart(item) {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
              <img src=${item.image} alt="photo" class="product-img-cart" />
              <div>
                <h5>${item.title}</h5>
                <h5>€ ${item.price}</h5>
                <button type="button" class="btn btn-outline-danger btn-sm remove-item" data-id=${item.id}>remove</button>
              </div>
              <div class="cart-item-amount">
               <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="c-item-f item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
                </div>`;
    cartContent.appendChild(div);
    // console.log(cartContent);
  }

  showCart() {
    cartOverlay.classList.add('cart-visibility');
    cartDOM.classList.add('showCart');
    // console.log(cartDOM);
  }

  setupApp() {
    cart = Storage.getCart();
    this.setCartTotal(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
  }

  populateCart(cart) {
    cart.forEach(item => this.addToCart(item));
  }

  hideCart() {
    cartOverlay.classList.remove('cart-visibility');
    cartDOM.classList.remove('showCart');
  }

  cartLogic() {
    clearCartBtn.addEventListener('click', () => {
      this.clearCart();
    });
    cartContent.addEventListener('click', event => {
      // console.log(event.target);
      if (event.target.classList.contains('remove-item')) {
        const removeItem = event.target;
        // console.log(removeItem);
        const { id } = removeItem.dataset;
        // console.log(removeItem.parentElement.parentElement);
        cartContent.removeChild(
          removeItem.parentElement.parentElement // remove cart item
        );
        this.removeItem(id);
      } else if (event.target.classList.contains('fa-chevron-up')) {
        const addAmount = event.target;
        const { id } = addAmount.dataset;
        // console.log(addAmount);
        const tempItem = cart.find(item => item.id === id);
        tempItem.amount += 1;
        Storage.saveCart(cart);
        this.setCartTotal(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains('fa-chevron-down')) {
        const lowerAmount = event.target;
        // console.log(event.target);
        const { id } = lowerAmount.dataset;
        const tempItem = cart.find(item => item.id === id);
        tempItem.amount -= 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartTotal(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    const cartItems = cart.map(item => item.id);
    // console.log(cartItems);
    cartItems.forEach(id => this.removeItem(id));
    // console.log(cartContent.children);
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartTotal(cart);
    Storage.saveCart(cart);
    const button = this.getSingleButton(id);
    button.disable = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
  }

  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }

  //fetch rates
  getRates() {
    fetch('https://api.exchangeratesapi.io/latest/')
      .then(res => res.json())
      .then(data => {
        const rts = data.rates; // assign the rates key to a variable
        const eu = data.base;
        // console.log(eu); // EUR
        const baseRate = document.createElement('option');
        baseRate.setAttribute('value', `${1}`);
        baseRate.innerText = `${eu}: 1.000 - Base rate`;
        selectCurrency.appendChild(baseRate);
        for (const [key, value] of Object.entries(rts)) {
          //  console.log(`key: ${key}, value: ${value}`);
          const option = document.createElement('option');
          option.setAttribute('value', `${value}`);
          //  console.log ('value', value);
          option.innerText = `${key}: ${value}`;
          // console.log('key', key, 'value', value);
          selectCurrency.appendChild(option);
        }
        //const { value } = selectCurrency.options[selectCurrency.selectedIndex];
        //const text = selectCurrency.options[selectCurrency.selectedIndex].innerText;
        // console.log("value", value);
        // console.log("text",text);
      });
  }

  convertCurrency() {
    this.selectCurrency = selectCurrency;
    selectCurrency.addEventListener('change', () => {
      // console.log('on change event >', event.target.value);
      conversionResult.innerText = `Convertion Rate: 1 EUR = ${
        selectCurrency.options[selectCurrency.selectedIndex].innerText
      }`;
      console.log(
        'selectCurrency.value =>',
        selectCurrency.value // currency value
      );
    });
  }


  getUser() {
    const user = document.getElementById('user');
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then(r => r.json())
      .then(data => {
        console.log(data.name);
        user.innerText = `Welcome ${data.name}`;
      });
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  static getProduct(id) {
    const products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const shoppingCart = new ShoppingCart();
  const products = new Products();
  shoppingCart.setupApp();

  products //instanceof Products()
    .getProducts()
    .then(products => {
      shoppingCart.renderProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      shoppingCart.getCartButton();
      shoppingCart.cartLogic();
    });

  shoppingCart.getRates();
  shoppingCart.getUser();
});

