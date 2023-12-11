import axios from 'axios';

export const state = () => ({
  dialog: false,
  editedIndex: -1,
  marvells: [],
  editedMarvell: {
    nombre: '',
    descripcion: '',
    imagenurl: ''
  },
  defaultMarvell: {
    nombre: '',
    descripcion: '',
    imagenurl: '',
  },
  /// Tienda de Zapatos
  dialogShoes: false,
  editedIndexShoes: -1,
  shoess: [],
  editedShoes: {
    modelo: '',
    color: '',
    descripcion: ''
  },
  defaultShoe: {
    modelo: '',
    color: '',
    descripcion: '',
  },


});

export const mutations = {
  setMarvell(state, marvells) {
    console.log("aqui ss")
    state.marvells = marvells;
  },

  setNombre(state, nombre) {
    console.log("nombre " , nombre)
    state.editedMarvell.nombre = nombre;
  },
  setDescripcion(state, descripcion) {
    state.editedMarvell.descripcion = descripcion;
  },
  setImagenUrl(state, imagenurl) {
    state.editedMarvell.imagenurl;
  },
  setEditedMarvellIndex(state, index) {
    state.editedIndex = index;
  },
  setEditedMarvell(state, item) {
    state.editedMarvell = { ...item };
  },
  setDefaultMarvell(state) {
    state.editedMarvell = { ...state.defaultMarvell };
    state.editedIndex = -1;
    state.dialog = false; // Agrega esta línea para cerrar el diálogo
  },
  setDialog(state, value) {
    // Actualiza el dialog con el value
    state.dialog = value;
  },
  updateMarvell(state, updatedMarvell) {
    const index = state.marvells.findIndex((el) => el.id === updatedMarvell.id);
    if (index !== -1) {
      // Actualiza Marvell
      state.marvells.splice(index, 1, updatedMarvell);
    }
  },
  addMarvell(state, NewHeroe) {
    // Agregar el nuevo Marvell
    state.marvells.push(NewHeroe);
  },


  /// Tienda de Zapatos
  setShoes(state, shoess) {
    console.log("aqui ss")
    state.shoess = shoess;
  },
  setModelo(state, modelo) {
    console.log("modelo " , modelo)
    state.editedShoes.modelo = modelo;
  },
  setColor(state, color) {
    state.editedShoes.color = color;
  },
  setDescription(state, descripcion) {
    state.editedShoes.descripcion = descripcion;
  },
  setEditedShoesIndex(state, index) {
    state.editedIndexShoes = index;
  },
  setEditedShoes(state, item) {
    state.editedShoes = { ...item };
  },
  setDefaultShoes(state) {
    state.editedShoes = { ...state.setDefaultShoes };
    state.editedIndexShoes = -1;
    state.dialogShoes = false; // Agrega esta línea para cerrar el diálogo
  },
  setDialogShoes(state, value) {
    // Actualiza el dialog con el value
    state.dialogShoes = value;
  },
  updateShoes(state, updatedShoes) {
    const index = state.shoess.findIndex((el) => el.id === updatedShoes.id);
    if (index !== -1) {
      // Actualiza Marvell
      state.shoess.splice(index, 1, updatedShoes);
    }
  },
  addShoes(state, NewShoe) {
    // Agregar el nuevo Marvell
    state.shoess.push(NewShoe);
  }
};

export const actions = {  
  async listMarvell({commit}) {
    try {
      console.log("Jesman")
      const response = await axios.get('http://localhost:8081/api/marvell');
      // Muestro el log Data
      console.log('List Marvell:', response.data); 
      commit('setMarvell', response.data);
    } catch (error) {
      console.error('Error List Marvell:', error);
    }
  },
  async PdfMarvell() {
    try {
      console.log("Jesman PDF")
      const response = await axios.get('http://localhost:8081/api/marvell/report/pdf');
    } catch (error) {
      console.error('Error al  Descargar PDF:', error);
    }
  },
  async HTMLMarvell() {
    try {
      console.log("Jesman HTML")
      const response = await axios.get('http://localhost:8081/api/marvell/report/html');
    } catch (error) {
      console.error('Error al  Descargar HTML:', error);
    }
  },
  async ExcelMarvell() {
    try {
      console.log("Jesman Excel")
      const response = await axios.get('http://localhost:8081/api/marvell/excel');
      console.log("esxcel " , response);
    } catch (error) {
      console.error('Error al  Descargar Excel:', error);
    }
  },
  async WordMarvell() {
    try {
      console.log("Jesman Excel")
      const response = await axios.get('http://localhost:8081/api/marvell/word');
    } catch (error) {
      console.error('Error al  Descargar Excel:', error);
    }
  },
  async deleteMarvell({ commit, state }, item) {
    try {
      const confirmDelete = confirm('Are you sure you want to delete this Marvell?');

      if (!confirmDelete) {
        return;
      }
      console.log("Id ",item.id)
      const updatedMarvells = [...state.marvells];
      await axios.delete(`http://localhost:8081/api/marvell/${item.id}`);

      const index = updatedMarvells.findIndex((el) => el.id === item.id);
      updatedMarvells.splice(index, 1);

      commit('setMarvell', updatedMarvells);
      commit('setDefaultMarvell');
    } catch (error) {
      console.error('Error deleting marvell:', error);
    }
  },
  async saveMarvell({ commit, state }) {
    try {
      let updatedMarvell;
      let actMarvell;

      if (state.editedIndex > -1) { // valido si el index existe
        console.log("llega aqui " + state.editedMarvell.id)
        await axios.put(`http://localhost:8081/api/marvell/${state.editedMarvell.id}`, state.editedMarvell);
        actMarvell = state.editedMarvell;

        // Actualizar el Marvell editado en lisMarvell
        commit('updateMarvell', actMarvell);
      } else {
        // Crear un nuevo Marvell
        const response = await axios.post('http://localhost:8081/api/marvell/save', state.editedMarvell);
        updatedMarvell = response.data;

        // Agregar el nuevo Marvell a la lista en el estado de Vuex
        commit('addMarvell', updatedMarvell);
      }

      // Llamar a la mutación para restablecer el estado de edición
      commit('setDefaultMarvell');
    } catch (error) {
      console.error('Error saving marvell:', error);
    }
  },



  // Tienda de zapatos

  async listShoes({commit}) {
    try {
      console.log("Jesman")
      const response = await axios.get('http://localhost:8081/api/shoes');
      // Muestro el log Data
      console.log('List Shoes:', response.data);
      commit('setShoes', response.data); 
    } catch (error) {
      console.error('Error List Shoes:', error);
    }
  },
  
  async deleteShoes({ commit, state }, item) {
    try {
      const confirmDelete = confirm('Are you sure you want to delete this Shoes?');

      if (!confirmDelete) {
        return;
      }
      console.log("Id ",item.id)
      const updatedShoes = [...state.shoess];
      await axios.delete(`http://localhost:8081/api/shoes/${item.id}`);

      const index = updatedShoes.findIndex((el) => el.id === item.id);
      updatedShoes.splice(index, 1);

      commit('setShoes', updatedShoes);
      commit('setDefaultShoes');
    } catch (error) {
      console.error('Error deleting Shoes:', error);
    }
  },
  async saveShoes({ commit, state }) {
    try {
      let updatedShoes;
      let actShoes;

      if (state.editedIndexShoes > -1) { // valido si el index existe
        console.log("llega aqui " + state.editedShoes.id)
        await axios.put(`http://localhost:8081/api/shoes/${state.editedShoes.id}`, state.editedShoes);
        actShoes = state.editedShoes;

        // Actualizar el Marvell editado en lisMarvell
        commit('updateShoes', actShoes);
      } else {
        // Crear un nuevo Marvell
        const response = await axios.post('http://localhost:8081/api/shoes/save', state.editedShoes);
        updatedShoes = response.data;

        // Agregar el nuevo Marvell a la lista en el estado de Vuex
        commit('addShoes', updatedShoes);
      }

      // Llamar a la mutación para restablecer el estado de edición
      commit('setDefaultShoes');
    } catch (error) {
      console.error('Error saving Shoes:', error);
    }
  }
};
