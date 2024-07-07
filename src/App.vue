<template>
    <v-layout>
      <!-- app bar -->
      <v-app-bar class="app-bar1" dense  >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>My Store</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-cart" variant="text" @click="openCart()" :disabled="productData.AddtoCart.length == 0 ? true:false"></v-btn>
      </v-app-bar>
      <v-navigation-drawer    v-model="drawer"    permanent  >
        <v-list density="compact" nav >
            <v-list-item  v-for="(item,i) in list " :key="i" :to = "item.to " :prepend-icon="item.icon"  :title="item.text"></v-list-item> 
        </v-list>
      </v-navigation-drawer>
      <v-main >
        <router-view/>
      </v-main>
      <cart-components :dialog="addtoCartDialog" @CloseCart="clsCart()"  />
    </v-layout>
</template>

<script>
import { ProductLists } from '../src/stores/product';
import CartComponents from './components/CartComponents.vue';
export default {
  components: { CartComponents },
  name: 'App',
  data: () => ({
    productData:ProductLists(),
    addtoCartDialog:false,
    drawer:true,
     list:[ 
      {text:`Store`,icon:'mdi-store',to:'/'},
      // {text:'About',icon:'mdi-account-circle-outline',to:'/about'},
      {text:'Inventory',icon:'mdi-table',to:'/inventory'},
    ], 
  }),
  methods: {
    openCart() {
      this.addtoCartDialog=true
    },
    clsCart(val){
      this.addtoCartDialog=val
    }
  },
  mounted () {
      this.productData.fetchProducts()
      this.productData.loadCategory()

  }
};
</script>
<style>
.app-bar1{
  background-color: bisque !important;
}

</style>