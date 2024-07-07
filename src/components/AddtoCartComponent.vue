<template>
    <v-dialog v-model="dialogAddtocart" max-width="600px"  persistent>
      <v-card>
        <v-card-title class="headline">ADD TO CART 
          <v-icon>mdi-cart</v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
              <v-row>
              <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <v-img :src="product.image" height="200px"></v-img>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                  <p><strong>Product:</strong> {{product.title }}</p>
                  <p><strong>Category:</strong> {{ product.category }}</p>
                  <p><strong>Price:</strong> ${{ product.price }}</p>

                  <span class="flex">
                  <strong>Quantity:</strong> 
                  <v-text-field type='number' v-model="qty" density="compact" @input="if(qty < 0) qty = 0;"></v-text-field>
                  </span>
                  <span>
                  <h4>Total Price: {{ tofixed2(product.price * qty) }}</h4>
                  </span>
                  <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" :disabled="qty == 0? true :false" @click="addtoCart()" text>Add to Cart</v-btn>
                  <v-btn color="green darken-1" @click="closeDialog()" text>Cancel</v-btn>
                  </v-card-actions>
              </v-col>
              </v-row>
          </v-container>
          </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script>
import { ProductLists } from "../stores/product";
  export default {
      props:['dialog','product'],
      data() {
          return {
              dialogAddtocart: false,
              qty:0,
              productData: ProductLists(),
          }
      },
      watch:{
          dialog(val){
             this.dialogAddtocart=val
          },
      },
      methods: {
          tofixed2(num){
            return ((num ) * 10 / 10).toFixed(2)
          },
          addtoCart(){
           let obj={
            id:this.product.id,
            category:this.product.category,
            description:this.product.description,
            image:this.product.image,
            price:this.tofixed2(this.product.price * this.qty),
            category:this.product.category,
            Quantity:this.qty,
            checked:false,
            title:this.product.title,
           }
           this.productData.addProducttoCart(obj)
           obj={}
           this.closeDialog()

          },
          closeDialog(){
            this.qty=0
            this.$emit('CloseDialog',false)
          }
        
      },
  }
</script>
<style>
</style>