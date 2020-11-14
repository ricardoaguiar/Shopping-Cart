class Product {
  constructor (name, price) {
    this.name = name;
    this.price = price;
  }
}

class ShoppingCart {
  constructor (products) {
    this.products = products;
  }

  addProduct (product) {
    //adding new product to the shopping cart
    this.products.push (product);
  }

  removeProduct (product) {
    //removing product from the shopping cart
    const indexOfremovedItem = this.products.indexOf (product);
    this.products.splice (indexOfremovedItem, 1);
  }

  getTotal () {
    // get the total price of the products in the shoppingcart
    const totalSum = this.products.reduce ((sum, item) => {
      // console.log(sum, item.price);
      return sum + item.price;
    }, 0);

    const div = document.querySelector ('.shoppingCart');
    const total = document.createElement ('p');
    total.innerHTML = totalSum;
    div.appendChild (total);
  }

  renderProducts () {
    // getting products to html
    let divProducts = document.querySelector ('.products');
    this.products.forEach (item => {
      let div = document.createElement ('div');
      div.setAttribute ('class', 'item');

      let pName = document.createElement ('p');
      pName.innerHTML = item.name;

      let pPrice = document.createElement ('p');
      pPrice.innerHTML = item.price;

      div.appendChild (pName);
      div.appendChild (pPrice);
      divProducts.appendChild (div);
    });
  }

  getUser () {
    //fetching data about user and showing it in html
    let userDiv = document.querySelector ('.customer');
    let userName = document.createElement ('h3');
    let userEmail = document.createElement ('p');
    let userPhone = document.createElement ('p');

    fetch ('https://jsonplaceholder.typicode.com/users/1')
      .then (response => response.json ())
      .then (user => {
        console.log (user);

        userName.innerHTML = user.name;
        userEmail.innerHTML = user.email;
        userPhone.innerHTML = user.phone;

        userDiv.appendChild (userName);
        userDiv.appendChild (userEmail);
        userDiv.appendChild (userPhone);
      });
  }
}

const flatscreen = new Product ('flat-screen', 5000);
let shoppingCart = new ShoppingCart ([flatscreen]);

const toaster = new Product ('toaster', 365); //adding item
shoppingCart.addProduct (toaster);

const kettle = new Product ('kettle', 1300); //adding item
shoppingCart.addProduct (kettle);

const fridge = new Product ('fridge', 9999); //adding item
shoppingCart.addProduct (fridge);

// shoppingCart.removeProduct (toaster) //trial removing
// shoppingCart.removeProduct (fridge) //trial removing

shoppingCart.renderProducts ();
shoppingCart.getUser ();

console.log (shoppingCart);
console.log (shoppingCart.getTotal ());
