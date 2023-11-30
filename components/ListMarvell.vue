<template>
  <v-data-table
      :headers="headers"
      :items="marvells"
      sort-by="nombre"
      class="elevation-1"
      :items-per-page="itemsPerPage"
      :page="currentPage"
      @update-page="updatePage"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Universo Mavells</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              {{ title }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ title }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :value="editedMarvell.nombre" label="Nombre" @input="updateNombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :value="editedMarvell.descripcion" label="Descripcion" @input="updateDescripcion"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :value="editedMarvell.imagenurl" label="Imagen" @input="updateImagen"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="saveHeroe">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
       <!-- <v-dialog v-model="dialogDelete" max-width="500px"> 
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this marvell?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
             <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn> 
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>-->
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editedMarvell(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteMarvell(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
     <!-- <v-btn color="primary" @click="mounted">Reset</v-btn> -->
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    headers: Array,
    itemsPerPage: Number,
    currentPage: Number,
  },
  computed: {
    title() {
      return this.$store.state.editedIndex === -1 ? 'Create Marvell' : 'Edit Marvell';
    },
    marvells() {
    //  console.log('Marvells:', this.$store.state.marvells);
      return this.$store.state.marvells;
    },
    editedMarvell: {
      get() {
        return this.$store.state.editedMarvell;
      },
      set(value) {
        this.$store.commit('seteditedMarvell', { ...value });
      },
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.$store.commit('setDefaultMarvell');
      }
    },
  },
  methods: {
   
    updateNombre(nombre) {
      this.$store.commit('setNombre', nombre);
    },
    updateDescripcion(descripcion) {
      this.$store.commit('setDescripcion', descripcion);
    },
    updateImagen(image) {
      this.$store.commit('setImagenUrl', image);
    },
    updatePage(page) {
      this.$emit('update-page', page);
    },
    close() {
      this.dialog = false;
      this.$store.commit('setDefaultMarvell');
    },
    editedMarvell(item) {
      const index = this.$store.state.marvells.findIndex((el) => el.id === item.id);
      this.$store.commit('setEditedMarvellIndex', index);
      this.$store.commit('setEditedMarvell', { ...item });
      this.dialog = true;
    },
    async deleteItem(item) {
      try {
        await this.$store.dispatch('deleteMarvell', item);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },
    async saveHeroe() {
      try {
        await this.$store.dispatch('saveMarvell');
        this.close();
      } catch (error) {
        console.error('Error saving marvell:', error);
        console.error('Error details:', error.response.data);
      }
    },
  },

};
</script>
  