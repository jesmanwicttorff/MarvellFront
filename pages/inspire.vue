<template>
  <v-data-table
      :headers="headers"
      :items="marvellsArray"
      sort-by="id"
      class="elevation-1"
      :items-per-page="itemsPerPage"
      :page.sync="currentPage"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Marvell</v-toolbar-title>
        
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-card cols="12" sm="6" md="4">
            <v-img class="mx-auto" height="50" max-width="100" src="https://i.blogs.es/c883f0/the-flash-hbo-max-mexico/1366_2000.jpeg"></v-img>     
          </v-card>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">
              Create Marvell
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
            <v-btn color="danger"  class="mb-2 btn-xs btn-block" @click="DescargarPDF">
             PDF
            </v-btn>
            <v-btn color=""  class="mb-2 btn-xs btn-block" @click="DescargarHTML">
              HTML
            </v-btn>
            <v-btn color=""  class="mb-2 btn-xs btn-block" @click="DescargarEXCEL">
              Excel
            </v-btn>
            <v-btn color=""  class="mb-2 btn-xs btn-block" @click="DescargarWORD">
              Word
            </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editedItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
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
      sortBy: 'id',
      Query_Marvel:[],
      headers: [
        { text: 'ID', align: 'start', sortable: false, value:'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Descripcion', value: 'descripcion' },
       // { text: 'Imagen', value: 'imagenurl' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      itemsPerPage: 10,
      currentPage: 1,
    };
  },
  computed: {
    marvellsArray() {
      console.log("Marvells Jes " , this.$store.state.marvells)
      return this.$store.state.marvells;
    },
    editedMarvell: {
      get() {
        return this.$store.state.editedMarvell;
      },
      set(value) {
        this.$store.commit('setEditedMarvell', { ...value });
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
  async mounted() {
    console.log("Spiderman")
    this.countMarvel();
     await this.$store.dispatch('listMarvell');
     
  },
  methods: {
    downloadExcel(dataExcel)
        {
            const link = document.createElement('a');
            link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${dataExcel}`;
            link.download = 'reporteMarvell.xlsx';
            link.click();
        },
        downloadWordMarvell(base64Data)
        {
            const link = document.createElement('a');
            link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64Data}`;
            link.download = 'Marvell.docx';
            link.click();
        },
    async DescargarHTML(){
      console.log("aqui html");
    await this.$store.dispatch('HTMLMarvell');  
  },
  async DescargarEXCEL(){
      console.log("aqui Excel");
   const responseExcel =   await this.$store.dispatch('ExcelMarvell');  
   this.downloadExcel(responseExcel);
  },
  async DescargarWORD(){
      console.log("aqui Word");
   const responseWord =   await this.$store.dispatch('WordMarvell');  
   this.downloadWordMarvell(responseWord);
  },
   async DescargarPDF(){
      console.log("aqui pdf");
    await this.$store.dispatch('PdfMarvell');  
  },
    updateNombre(nombre) {
      console.log("mma a")
      this.$store.commit('setNombre', nombre);
    },
    updateDescripcion(descripcion) {
      this.$store.commit('setDescripcion', descripcion);
    },
    updateImagenURL(url) {
      this.$store.commit('setImagenUrl', url);
    },
    close() {
      this.dialog = false;
      this.$store.commit('setDefaultMarvell');
    },
   async countMarvel(){
             let objMarvell
            let increment = 1
            this.Query_Marvel = []
             const response = await axios.get('http://localhost:8081/api/marvell');
             const data = response.data;
             Object.values(data).map((type) => {
              objMarvell = new Object();// creamos el objeto para asignarle cada elemento del result de consulta
              objMarvell.nombre = type.nombre
              objMarvell.descripcion = type.descripcion
              objMarvell.imagenurl = type.imagenurl
              objMarvell.increment = increment
              this.Query_Marvel.push(objMarvell) // push para la tabla 
              increment ++ 
             })
             console.log("data " + this.Query_Marvel);
    },
    editedItem(item) {
      const index = this.$store.state.marvells.findIndex(el => el.id === item.id);
      console.log("index " , index)
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
    
  },
};
</script>
