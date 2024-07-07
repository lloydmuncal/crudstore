<template>
    <v-container fluid>
        <div >
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
                <v-col cols="auto">
                    <v-btn class="ml-2" @click="OpenDialog('ADD',true,product)">
                        <v-icon>
                        mdi-plus
                        </v-icon>
                        ADD
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="scrollable-list pa-3">
            <v-card class="pa-4">
                <v-list dense>
                    <v-list-item v-for="(product, i) in productData.SearchProduct" :key="i">
                        <v-row>
                            <v-col cols="12" sm="3">
                                <v-img :src="product.image" aspect-ratio="1" height="100px"></v-img>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-list-item>
                                    <v-list-item-title>{{ product.title }}</v-list-item-title>
                                    <v-list-item-subtitle><strong>Category:</strong> {{ product.category }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>{{ 'Price:' }}${{ product.price }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>{{ product.description }}</v-list-item-subtitle>
                                </v-list-item>
                            </v-col>
                            <v-col cols="12" sm="3" class="text-right">
                                <v-btn variant="plain" @click="OpenDialog('EDIT',true,product)">
                                    <v-icon large color="green">mdi-pen</v-icon>
                                </v-btn>
                                <v-btn variant="plain" @click="deleteProduct(product)">
                                    <v-icon large color="red">mdi-delete</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-divider class="mt-2"></v-divider>
                    </v-list-item>
                </v-list>
            </v-card>
        </div>
        <template>
          <AddEditProduct :dialog="dialog" :form="productObj" :title="title" @CloseDialog="CloseAddEditDailog"/>
        </template>
    </v-container>
</template>
<script>
  import { ProductLists } from "../stores/product";
  import AddEditProduct from "@/components/AddEditProductComponent.vue"
  import Swal from "sweetalert2";
  export default {
    components:{AddEditProduct},
    data() {
      return {
        product: {},
        dialog:false,
        selectedCategory: "",
        productData: ProductLists(),
        height: window.innerHeight,
        title:'',
        productObj:{
            image: "",
            title: "",
            category: null,
            description: "",
            price: "",
            rating:{
                count:0,
                rate:0
            }
        }
      };
    },
    methods: {
        filterByCategory() {
            if (this.selectedCategory == "All") {
                this.productData.fetchProducts();
            } else {
                this.productData.filterByCategory(this.selectedCategory)
            }
        },
        CloseAddEditDailog(val){
            this.dialog=val
        },
        OpenDialog(title,val,product){
            this.title=title
            this.dialog =val
            this.productObj={...product}
        },
        deleteProduct(val){
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
                    this.productData.deleteProduct(val).then(()=>{
                        this.CloseAddEditDailog()
                    })
                }
                });
           
        },
        adjustDivHeight() {
            const windowHeight = window.innerHeight;
            const divHeight = Math.floor(windowHeight * 0.7);
            this.$el.querySelector(".scrollable-list").style.height = `${divHeight}px`;
        },
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.adjustDivHeight);
    },
    created() {
        window.addEventListener("resize", this.adjustDivHeight);
    },
    watch: {
        $route: "adjustDivHeight",
    },
    mounted() {
        this.adjustDivHeight();

    },
    computed: {
    
    },
  };
  </script>
  <style scoped>
  .scrollable-list {
        background-color: bisque;
        max-height: fit-content;
        overflow-y: auto;
    }   
  </style>