const app = new Vue({
  el: '#app',
  data: () => {
    //datasets
    return {
      page: 'products',
      cart: [],
      search: '',
      sortBy: 'subject',
      sortDirection: 'asc',
      products: products,
      checkout: [],
      order: {
        name: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        state: '',
        method: 'Home',
        gift: false,
      },
      //Drop down list for the states
      states: {
        AUH: 'Abu Dhabi',
        AJM: 'Ajman',
        DXB: 'Dubai',
        FUJ: 'Fujairah',
        RAK: 'Ras Al Khaimah',
        SHJ: 'Sharjah',
        UMM: 'Umm Al Quwain',
      },
    };

  },

  methods: {
    //Pushes product to the cart
    addToCart(product) {
      //Child pushes component to the parent
      this.$emit("addItemToCart", product);
      console.log(product.id);
      if (!this.cart.includes(product)) {
        this.cart.push(product);
      }
      else
        console.log("Product exists in cart");
      product.cartquantity++;


      
      //Minus quantity from the total
      this.products.forEach((item) => {
        if (item.id === product.id) {
          item.quantity -= 1;
        }
      }
      )
    },


    removeFromCart(product) {
      console.log("Removed product  " + product.id);
      //Remove the product all together from the cart if its less than 1
      if (product.cartquantity === 1) {
        this.cart.splice(product, 1);
        product.cartquantity = 0;
      }
      else {
        product.cartquantity--;
        console.log("cartquantity: " + product.cartquantity);
      }

      //increase the quantity of the products in inventory
      this.products.forEach((item) => {
        if (item.id === product.id) {
          item.quantity += 1;
        }
      }
      )
    },

    navigateTo(page) {
      this.page = page;
      console.log(this.page);
    },

    quantityCount(product) {
      if (product.quantity > 0) {
        return true;
      } else {
        return false;
      }
    },

    onSubmitCheckout: function () {
      //Condition to check if all the fields are filled
      if (this.order.name && this.order.phone && this.order.address && this.order.city && this.order.zip && this.order.state) {
        this.checkout.push(this.order);
        this.order = {
          //Clears all the text boxes on button click
          name: '',
          phone: '',
          address: '',
          city: '',
          zip: '',
          state: '',
          method: 'Home',
          gift: false,
        };
        //Confirmation dialogue
        alert("Order submitted");
        this.cart = [];
        this.navigateTo('products');
      } else {
        
        alert("Please fill all the text boxes");
        this.page = 'checkout';
      }
      
    },

    checkoutCart() {
      if (this.cart.length > 0) {
        this.page = "checkout";
      } else {
        Swal.fire(
          'Empty Cart?',
          'Add something from the store first!',
          'question'
        )
      }
    },
  },
  computed: {
    filteredProducts() {
      if (this.search) {
        return this.products.filter((product) => {
          return product.subject.toLowerCase().includes(this.search.toLowerCase());

        })
      }
      //This block sorts the products according to subject
      else if (this.sortBy === 'subject') {
        return this.products.sort((a, b) => {
          if (this.sortDirection === 'asc') {
            return a.subject.localeCompare(b.subject);
          } else if (this.sortDirection === 'desc') {
            return b.subject.localeCompare(a.subject);
          }
        })
      }
      //This block sorts the products according to price
      else if (this.sortBy === 'price') {
        return this.products.sort((a, b) => {
          if (this.sortDirection === 'asc') {
            return a.price - b.price;
          } else if (this.sortDirection === 'desc') {
            return b.price - a.price;
          }
        });
      }
      //This block sorts the products according to quantity
      else if (this.sortBy === 'quantity') {
        return this.products.sort((a, b) => {
          if (this.sortDirection === 'asc') {
            return a.quantity - b.quantity;
          } else if (this.sortDirection === 'desc') {
            return b.quantity - a.quantity;
          }
        });
      }
      //Return products as it is if no filter
      else {
        return this.products;
      }
    },

    //Method to take sum of the products added in cart
    cartTotal() {
      let total = 0;
      this.cart.forEach((item) => {
        total += item.price * item.cartquantity;
      });
      console.log(total);
      return total;
    },

   
    cartCount() {
      let count = 0;
      this.cart.forEach((item) => {
        count += item.cartquantity;
      });
      console.log(count);
      return count;
    },
  },



});