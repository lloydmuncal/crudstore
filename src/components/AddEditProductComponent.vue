<template>
    <v-dialog v-model="addeditDialog" max-width="600px" persistent>
      <v-toolbar class="px-4">
          <v-row align="center" justify="space-between" no-gutters>
            <v-col>
              <span class="headline">{{title}} PRODUCT</span>
            </v-col>
            <v-col cols="auto">
              <v-btn icon @click="closeDialog()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12">
                <v-text-field v-model="form.image" label="Image URL"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="form.title" label="Title"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="form.category"
                  :items="ProductData.categoryList2"
                  label="Category"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="form.description" label="Description"></v-textarea>
              </v-col>
              <v-col cols="6">
                <v-text-field type="number" v-model="form.price" label="Price"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field  type="number" v-model="form.rating.count" label="Quantity"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog()">Close</v-btn>
          <v-btn color="blue darken-1" @click="saveProduct()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
 import { ProductLists } from "../stores/product";
  export default {
    props:['dialog','form','title'],
    data() {
      return {
        addeditDialog:false,
        ProductData:ProductLists(),
      };
    },
    methods: {
      closeDialog() {
        this.$emit('CloseDialog',false)
        this.addeditDialog=false
      },
      saveProduct(){
        if(this.title =='ADD'){
          this.ProductData.insertNewProduct(this.form).then(()=>{
            this.closeDialog()
          })
        }else if(this.title =='EDIT'){
          this.ProductData.editProduct(this.form).then(()=>{
            this.closeDialog()
          })
        }
      }

    },
    watch:{
      dialog(val){
        if(val){
         this.addeditDialog =val
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Scoped styles can be added as needed */
  </style>
  