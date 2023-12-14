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
        <DialogMarvell :showModal="show" ref="DialogMarvell"></DialogMarvell>
        <v-btn color="danger"  class="mb-2 btn-xs btn-block" @click="fetchPDF">PDF</v-btn>
            <v-btn color=""  class="mb-2 btn-xs btn-block" @click="DescargarEXCEL">Excel</v-btn>
            <v-btn color=""  class="mb-2 btn-xs btn-block" @click="DescargarWORD">Word</v-btn>
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
import DialogMarvell from './DialogMarvell.vue';
export default {
  data() {
    return {
      show: false,
      sortBy: 'id',
      Query_Marvel:[],
      reportData: null,
      pdfSrc: null,
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
  components: {
    "DialogMarvell":DialogMarvell,
  },
  computed: {
    marvellsArray() {
      console.log("Marvells Jes " , this.$store.state.marvells)
      return this.$store.state.marvells;
    }
  },
  watch: {
    show(val) {
      if (!val) {
        this.$store.commit('setDefaultMarvell');
      }
    },
  },
  async mounted() {
    console.log("Spiderman")
     await this.$store.dispatch('listMarvell');
     
  },
  methods: {
    downloadExcel(dataExcel)
        {
            const link = document.createElement('a');
            link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;,${dataExcel}`;
            link.download = 'reporteMarvell.xlsx';
            link.click();
        },
        downloadWordMarvell(base64Data)
        {
            const link = document.createElement('a');
            link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;,${base64Data}`;
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
    DescargarPDF(report){
      console.log("aqui pdf");
      const link = document.createElement('a');       
      link.href =`data:application/pdf;base64,${report}`;
      link.download = 'marvell';
      link.click();  
  },
  async fetchPDF() {
    try {

      const report =  await this.$store.dispatch('PdfMarvell');
      console.log("jjj " + this.DescargarPDF(report))
      this.DescargarPDF(report);

    }catch(error){

      console.log("error descargar exel " , error)

    }
  },
    
    close() {
      this.show = false;
      this.$store.commit('setDefaultMarvell');
    },
    async deleteItem(item) {
      try {
        await this.$store.dispatch('deleteMarvell', item);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },
    editedItem(item) {
      if(this.show == true){
        this.show = false;
      }
        this.show= true
      const index = this.$store.state.marvells.findIndex(el => el.id === item.id);
      console.log("index " , this.show)
      this.$store.commit('setEditedMarvellIndex', index);
      this.$store.commit('setEditedMarvell', { ...item });
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
