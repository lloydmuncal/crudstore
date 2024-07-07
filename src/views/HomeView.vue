<template>
  <div>
    <v-container fluid>
      <div>
        <v-row class="flex" no-gutters>
            <v-col cols="auto">
                <h4 class="mt-2 mr-2">Categories :</h4>
            </v-col>
            <v-col cols="auto">
            <v-autocomplete
                v-model="selectedCategory"
                :items="productData.categoryList"
                density="compact"
                label="Select Category"
                @update:modelValue="filterByCategory"
                style="width: 200px"
                class="autocomplete-fit-to-value"
            ></v-autocomplete>
            </v-col>
            <v-col cols="auto" class="ml-auto"> 
            <v-text-field
                v-model="productData.search"
                label="Search"
                density="compact"
                style="width: 300px" 
                prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            </v-col>
        </v-row>
      </div>
      <div class="div pa-2">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
            v-for="(product, i) in productData.SearchProduct"
            :key="i"
          >
            <v-card class="divProducts">
              <div class="center-content">
                <div class="mt-2">
                  <v-img :src="product.image" height="100px"></v-img>
                </div>
                <v-card-title>{{ product.title }}</v-card-title>
                <v-card-subtitle>{{ product.category }}</v-card-subtitle>
                <v-card-text class="info-row">
                  <span>{{ "Price:" }} ${{ product.price }}</span>
                  <span>{{ "Quantity:" }} ({{ product.rating.count }})</span>
                </v-card-text>
                <v-card-actions class="info-row">
                  <v-btn color="primary" @click="AddtoCartFNC(product)">
                    <v-icon>mdi-cart</v-icon>
                    Add to cart
                  </v-btn>
                  <v-btn @click="openPurchase(product)" color="primary">
                    <v-icon>mdi-currency-usd</v-icon>
                    Buy
                  </v-btn>
                </v-card-actions>
                <div class="center">
                  <v-rating
                    v-model="product.rating.rate"
                    readonly
                    active-color="blue"
                    color="yellow darken-3"
                  ></v-rating>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <div v-if="productData.loading">
          <v-skeleton-loader type="card" class="mx-auto div"></v-skeleton-loader>
        </div>
      </div>
    </v-container>
    <template>
      <purchase
        :dialog="dialogPurchase"
        :product="product"
        @CloseDialog="ClsDialog()"
      />
      <addto-cart-component :dialog="dialogAddtocart" :product="producttoCart"  @CloseDialog="ClsDialog()"/>
    </template>
    <!-- {{ dialogAddtocart }} -->
  </div>
</template>
<script>
import { ProductLists } from "../stores/product";
import Purchase from "@/components/PurchaseComponent.vue";
import AddtoCartComponent from "@/components/AddtoCartComponent.vue";
export default {
  components: { Purchase, AddtoCartComponent },
  data() {
    return {
      key: "HomeView",
      dialogPurchase: false,
      dialogAddtocart: false,
      product: {},
      producttoCart:{},
      selectedCategory: "",
      height: window.innerHeight,
      productData: ProductLists(),
    };
  },
  methods: {
    filterByCategory() {
      this.products = [];
      if (this.selectedCategory == "All") {
        this.productData.fetchProducts();
      } else {
        this.productData.filterByCategory(this.selectedCategory)
      }
    },
    AddtoCartFNC(val) {
        this.producttoCart=val
        this.dialogAddtocart=true
    },
    openPurchase(item) {
      this.dialogPurchase = true;
      this.product = item;
    },
    ClsDialog(val) {
      this.dialogPurchase = val;
      this.dialogAddtocart=val
    },
    adjustDivHeight() {
      const windowHeight = window.innerHeight;
      const divHeight = Math.floor(windowHeight * 0.7);
      this.$el.querySelector(".div").style.height = `${divHeight}px`;
    },
  },
  mounted() {
   
    this.adjustDivHeight();
  },
  watch: {
    $route: "adjustDivHeight",
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.adjustDivHeight);
  },
  created() {
    window.addEventListener("resize", this.adjustDivHeight);
  },
  computed: {
  
  },
};
</script>

<style scoped>
.div {
  background-color: bisque;
  overflow-y: auto;
  max-height: fit-content;
}
.divProducts:hover {
  transform: scale(1.05); /* Smaller zoom effect */
  transition: transform 0.3s ease; /* Smooth transition */
}
.divProducts {
  margin: 2%;
}
.info-row {
  display: flex;
  justify-content: space-between;
  width: 100%; /* Ensures the div takes full width */
}

.center-content {
  flex-direction: column;
  align-items: center; /* Center horizontally */
  text-align: center; /* Center text content */
}
</style>