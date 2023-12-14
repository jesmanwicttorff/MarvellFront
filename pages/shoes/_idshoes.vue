<template>
    <v-data-table
        :headers="headers"
        :items="ShoesArray"
        sort-by="modelo"
        class="elevation-1"
        :items-per-page="itemsPerPage"
        :page.sync="currentPage"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>STORE OF SHOES</v-toolbar-title>
          
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-card cols="12" sm="6" md="4">
              <v-img class="mx-auto" height="50" max-width="100" src="https://i.ebayimg.com/thumbs/images/g/GzwAAOSwruxkbT3a/s-l640.jpg"></v-img>     
            </v-card>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Create Shoes
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">New Shoes</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :value="editedShoes.modelo" label="Modelo" @input="updateModelo"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :value="editedShoes.color" label="Color" @input="updateColor"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :value="editedShoes.descripcion" label="Descripcion" @input="updateDescription"></v-text-field>
                  </v-col>
                  <v-card cols="12" sm="6" md="4">
                    <v-img class="mx-auto" height="300" max-width="500" src="https://i.ebayimg.com/thumbs/images/g/GzwAAOSwruxkbT3a/s-l640.jpg"></v-img>
                  </v-card>
                </v-row>
              </v-container>
                
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="danger" text @click="close">Cancel</v-btn>
                <v-btn color="primary" text @click="saveItem">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editedItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteShoe(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
       <!-- <v-btn color="primary" @click="mounted">Reset</v-btn>-->
      </template>
    </v-data-table>
  </template>
  
  <script>
  import axios from "axios"
  
  export default {
    data() {
      return {
        dialog: false,
        sortBy: 'modelo',
        headers: [
         { text: 'ID', align: 'start', sortable: false, value:'id' },
          { text: 'Modelo', value: 'modelo' },
          { text: 'Color', value: 'color' },
          { text: 'Descripcion', value: 'descripcion' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        itemsPerPage: 10,
        currentPage: 1,
      };
    },
    computed: {
      ShoesArray() {
        console.log("Shoes Jes " ,  this.$store.state.shoess);
        return this.$store.state.shoess;
      },
      editedShoes: {
        get() {
          return this.$store.state.editedShoes;
        },
        set(value) {
          this.$store.commit('setEditedShoes', { ...value });
        },
      },
    },
    watch: {
      dialog(val) {
        if (!val) {
          this.$store.commit('setDefaultShoes');
        }
      },
    },
    async mounted() {
      console.log("Adidas")
       await this.$store.dispatch('listShoes'); 
    },
    methods: {
    
      updateModelo(modelo) {
        this.$store.commit('setModelo', modelo);
      },
      updateColor(color) {
        this.$store.commit('setColor', color);
      },
      updateDescription(descripcion) {
        this.$store.commit('setDescription', descripcion);
      },
      close() {
        this.dialog = false;
        this.$store.commit('setDefaultShoes');
      },
      editedItem(item) {
        const index = this.$store.state.shoess.findIndex(el => el.id === item.id);
        console.log("index " , index)
        this.$store.commit('setEditedShoesIndex', index);
        this.$store.commit('setEditedShoes', { ...item });
        this.dialog = true;
      },
      async deleteShoe(item) {
        try {
          await this.$store.dispatch('deleteShoes', item);
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      },
      async saveItem() {
        try {
          await this.$store.dispatch('saveShoes');
          // Solo cierra el diálogo si la operación fue exitosa
          this.close();
        } catch (error) {
          console.error('Error saving Shoes:', error);
          console.error('Error details:', error.response.data);
          // También puedes mostrar un mensaje de error al usuario, si es relevante
        }
      },
      
    },
  };
  </script>