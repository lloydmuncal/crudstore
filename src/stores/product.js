import { defineStore } from 'pinia';
import axios from 'axios';
import Swal from 'sweetalert2'


export const ProductLists = defineStore('product', {
  state: () => ({
    ProductLists:[],
    categoryList:[],
    categoryList2:[],
    AddtoCart: [],
    loading: false,
    search:null,
    error: null
  }),

  actions: {
    async fetchProducts() {
      try {
        this.loading=true
        const response = await axios.get('https://fakestoreapi.com/products');
          if(response.data){
              this.ProductLists = response.data
              this.loading=false
              }else{
                  Swal.fire({
                    title: "No Data Available",
                    icon: "info"
                  });;
                this.loading=false
              }
          } catch (error) {
          Swal.fire({
            title: error.message,
            icon: "error"
          });;
            this.loading=false
          }
    },
    async loadCategory(){
        try {
          const response = await axios.get('https://fakestoreapi.com/products/categories');
            if(response.data){
                  this.categoryList =[...response.data]
                  this.categoryList2 = [...response.data]
                  this.categoryList.unshift('All')
                }else{
                    Swal.fire({
                    title: "No Data Available",
                    icon: "info"
                  });;
                  Swal.fire({
                    title: "No Data Available",
                    icon: "info"
                  });;
                }
            } catch (error) {
                Swal.fire({
                 title: error.message,
                  icon: "error"
              });;
            }

    },
    async filterByCategory(val){
        try {
          this.loading=true
          const response = await axios.get(`https://fakestoreapi.com/products/category/${val}`);
            if(response.data){
              this.ProductLists = response.data
              this.loading=false
              }else{
                  Swal.fire({
                    title: "No Data Available",
                    icon: "info"
                  });;
                this.loading=false
              }
          } catch (error) {
              Swal.fire({
                title: error.message,
                icon: "error"
              });;
            this.loading=false
          }
    },
    addProducttoCart(product) {
      let index = this.AddtoCart.findIndex(x=> x.id == product.id)
      if(index > -1 ){
        this.AddtoCart[index].Quantity = parseInt(this.AddtoCart[index].Quantity)  + parseInt(product.Quantity)
        this.AddtoCart[index].price = parseFloat(this.AddtoCart[index].price) + parseFloat(product.price)
        this.AddtoCart[index].checked = product.checked

      }else{
        this.AddtoCart.push(product)
      }
    },
    SelectAllCart(val){
      if(val == true){
          this.AddtoCart.filter(x=>{
            x.checked=true
          })
      }else{
        this.AddtoCart.filter(x=>{
            x.checked=false
          })
      }
    },
    deleteAllCart(){
      this.AddtoCart=[]
      Swal.fire({
        title: "Proucts has been remove",
        icon: "success"
      });
    },
    deleteProductinCart(val){
      const index = this.AddtoCart.indexOf(val);
      if (index > -1) {
        this.AddtoCart.splice(index, 1);
      }
    },
    buyProduct(val){
      const index = this.ProductLists.findIndex(x=> x.id == val.id);
      if (index > -1) {
          console.log(index)
          this.ProductLists[index].rating.count -= parseInt(val.Quantity)
          Swal.fire({
            title: "Thank you for buying!",
            icon: "success"
          });
      }else{
        Swal.fire({
          title: "Bad Request!",
          icon: "warning"
        });
      }
    },
    async insertNewProduct(val){
      try {
        const response = await axios.get(`https://fakestoreapi.com/products`,val);
            if(response.data){
              this.ProductLists.push(val)
              Swal.fire({
                title: "Successfully Inserted!",
                text: "New Product is added.",
                icon: "success"
              });
              
            }else{
               Swal.fire({
                title: "Bad Request!",
                icon: "warning"
              });
            }
        } catch (error) {
          Swal.fire({
            title: error.message,
            icon: "error"
          });
        }
    },
    async editProduct(val){
    
      try {
        const index = this.ProductLists.findIndex(x=> x.id == val.id);
        if (index > -1) {
            this.ProductLists[index].image = val.image
            this.ProductLists[index].title = val.title
            this.ProductLists[index].description = val.description
            this.ProductLists[index].price = val.price
            Swal.fire({
              title: "Successfully Updated!",
              text: "New Product is updated.",
              icon: "success"
            });
        }else{
          Swal.fire({
            title: "Bad Request!",
            icon: "warning"
          });
        }
        // const response = await axios.put(`https://fakestoreapi.com/products/${val.id}`,val);
        //     if(response.data){
        //       // this.ProductLists.push(val)
        //       console.log(response.data)
        //     }else{
        //       alert('400')
        //     }
        } catch (error) {
            Swal.fire({
            title: error.message,
            icon: "error"
          });;
        }
    },
    async deleteProduct(val){
      try {
        console.log(val)
        const index = this.ProductLists.findIndex(x=> x.id == val.id);
        if (index > -1) {
          this.ProductLists.splice(index,1)
          Swal.fire({
              title: "Successfully Deleted!",
              text: "Product has been deleted.",
              icon: "success"
            });
        }else{
           Swal.fire({
            title: "Bad Request!",
            icon: "warning"
          });
        }
        // const response = await axios.delete(`https://fakestoreapi.com/products/${val.id}`,val);
        //     if(response.data){
        //       console.log(response.data)
        //     }else{
        //       alert('400')
        //     }
        } catch (error) {
            Swal.fire({
            title: error.message,
            icon: "error"
          });;
        }
    }
   
  },
  getters: {
    SearchProduct() {
      if (!this.search) {
        return this.ProductLists;
      } 
      else {
        return this.ProductLists.filter((data) => data.title.toLowerCase().includes(this.search.toLowerCase()))
      }
    },
  }
});
