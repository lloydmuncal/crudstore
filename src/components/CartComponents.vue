<template>
  <v-dialog v-model="cartDialog" max-width="800px" persistent class="custom-dialog">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title class="flex-grow-1">Cart <v-icon>mdi-cart</v-icon></v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
          <span>Select All</span>
          <v-checkbox  @update:modelValue="selectAll(allSelected=!allSelected)" v-model="allSelected" class="mr-2 mt-5">
          </v-checkbox>
          <v-btn icon @click="closeCart()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-toolbar>

      <v-list dense class="scrollable-list">
        <v-list-item v-for="(product, i) in Product.AddtoCart" :key="i">
          <v-row>
            <v-col>
              <v-img :src="product.image" aspect-ratio="1" height="100px"></v-img>
            </v-col>
            <v-col cols="6">
              <v-list-item>
                <v-list-item-title>{{ product.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ 'Quantity:' }}{{ product.Quantity }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ 'Price:' }}${{ tofixed2(product.price*product.Quantity) }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ product.description }}</v-list-item-subtitle>
                <v-list-item-subtitle><strong>Category:</strong> {{ product.category }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col cols="auto"  class="d-flex align-center justify-end">
              <v-checkbox class="mt-4 mr-2" v-model="product.checked" @update:modelValue="selectProd(product)"></v-checkbox>
              <v-btn density="compact" @click="deleteProductsinCart(product)">
                  <v-icon large color="red">mdi-delete</v-icon>
              </v-btn>
          </v-col>

          </v-row>
          <v-divider class="mt-2"></v-divider>
        </v-list-item>
        
      </v-list>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <h3 class="mr-2">Total Price: {{ TotalPrice ? TotalPrice : 0}}</h3>
        <v-btn color="primary" :disabled="allSelected == false? true:false" @click="deleteAllProductsinCart()">Delete</v-btn>
        <v-btn color="primary" @click="buyProducts()">Buy</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
<script>
import Swal from 'sweetalert2';
import { ProductLists} from '../stores/product'
  export default {
    props:['dialog'],
    data() {
        return {
           Product:ProductLists(),
           cartDialog:false,
           allSelected:false,
           selectedProducts:[],
           TotalPrice:0
        }
    },
    methods: {
      tofixed2(num){
        return ((num ) * 10 / 10).toFixed(2)
      },
      closeCart() {
        this.selectedProducts = []
        this.selectAll(false)
        this.$emit('CloseCart',false)
      },
      selectProd(item){
        if(item.checked != false){
            this.selectedProducts.push(item)
        }else{
          const index = this.selectedProducts.indexOf(item);
            if (index > -1) {
              this.selectedProducts.splice(index, 1);
            }
        }
        this.TotalPricedProducts()
      },
      selectAll(val){
        if(val==false){
          this.selectedProducts = []
          this.Product.SelectAllCart(val)
        }
        else{
          this.Product.SelectAllCart(val)
          this.selectedProducts = this.Product.AddtoCart
        }
        this.TotalPricedProducts()
      },
      TotalPricedProducts(){
        this.TotalPrice = 0;
        this.selectedProducts.forEach(product => {
          this.TotalPrice += parseFloat(product.price) * parseInt(product.Quantity);
        });
        this.TotalPrice = this.tofixed2(this.TotalPrice);  
      },
      deleteAllProductsinCart(){
          Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete all!"
          }).then((result) => {
            if (result.isConfirmed) {
              this.Product.deleteAllCart()
              this.closeCart()
            }
          });
      },
      deleteProductsinCart(product){
        Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
                this.Product.deleteProductinCart(product)
                if(this.Product.addProduct.length < 0){
                  this.closeCart()
                }
            }
          });
      },
      buyProducts(){
        this.selectedProducts.filter((x)=>{
          if(x.checked==true){
           this.Product.buyProduct(x)
           this.Product.deleteProductinCart(x)
          }
        })
        this.selectedProducts = []
        if(this.Product.AddtoCart.length < 0){
          this.closeCart()
        }else{
          this.selectedProducts = this.Product.AddtoCart
          this.closeCart()
        }

      }
    },
    watch:{
        dialog(val){
            this.cartDialog=val
        },
        
    }
  };
</script>
  
  <style scoped>
.info-row {
  display: flex;
  justify-content: space-between;
  width: 100%; 
}

.scrollable-list {
  max-height: 300px;
  overflow-y: auto;
}
.custom-dialog {
  z-index:1000 !important;
}
  </style>
  
  