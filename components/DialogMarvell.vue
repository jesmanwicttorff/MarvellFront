<template>
      <v-dialog v-model="showModal" max-width="500px" class="modal" >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">
              Create Marvell {{ show }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">New Marvell</span>
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
                  <v-card cols="12" sm="6" md="4">
                    <v-img class="mx-auto" height="300" max-width="500" src="https://i.blogs.es/c883f0/the-flash-hbo-max-mexico/1366_2000.jpeg"></v-img>
                  <!--  <v-text-field :value="editedMarvell.imagenurl" label="Imagen" @input="updateImagenURL"></v-text-field>-->
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
</template>
<script>
export default({
  props:{ 
    showModal: {
            type: Boolean,
            },
        },
    data() {
        return {
            show : this.showModal
        };
    },
    mounted(){
        this.show = this.showModal
    console.log("saaa ",this.show);
    },
  computed:{
    editedMarvell: {
      get() {
        return this.$store.state.editedMarvell;
      },
      set(value) {
        this.$store.commit('setEditedMarvell', { ...value });
      },
    },

  },
  methods: {
    updateImagenURL(url) {
      this.$store.commit('setImagenUrl', url);
    },
    updateNombre(nombre) {
      console.log("mma a")
      this.$store.commit('setNombre', nombre);
    },
    updateDescripcion(descripcion) {
      this.$store.commit('setDescripcion', descripcion);
    },
    close() {
      this.$emit("hide-modal");
      this.$store.commit('setDefaultMarvell');
      this.showModal= false

    },
    async saveItem() {
      try {
        await this.$store.dispatch('saveMarvell');
        // Solo cierra el diálogo si la operación fue exitosa
        this.close();
      } catch (error) {
        console.error('Error saving Marvell:', error);
        console.error('Error details:', error.response.data);
        // También puedes mostrar un mensaje de error al usuario, si es relevante
      }
    },
    async deleteItem(item) {
      try {
        await this.$store.dispatch('deleteMarvell', item);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },

  }
})
</script>
    