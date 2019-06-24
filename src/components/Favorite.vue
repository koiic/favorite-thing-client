<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>Favorite Things</h1>
        <hr><br><br>
        <alert :message="message" v-if="showMessage"></alert>
        <button type="button" class="btn btn-success btn-sm" v-b-modal.favorite-modal>Add Favorite Thing</button>
        <br><br>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Category</th>
              <th scope="col">Description</th>
              <th scope="col">created date</th>
              <th scope="col">meta data</th>
              <th scope="col">rank</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(favorite, index) in favorites" :key="index">
              <td>{{favorite.title}}</td>
              <td>{{favorite.category.type}}</td>
              <td>{{favorite.description}}</td>
              <td>{{favorite.createdAt}}</td>
              <td>{{favorite.metaData}}</td>
               <td>{{favorite.rank}}</td>
              <td>
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-warning btn-sm"  v-b-modal.favorite-update-modal
        @click="editFavorite(favorite)">Update</button>
                  <button type="button" class="btn btn-danger btn-sm" @click="onDeleteFavorite(favorite)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <b-modal ref="addFavoriteModal"
         id="favorite-modal"
         title="Add New favorite thing"
         hide-footer>
    <b-form  @submit="onSubmit" @reset="onReset" class="w-100">
    <b-form-group id="form-title-group"
                  label="Title:"
                  label-for="form-title-input">
        <b-form-input id="form-title-input"
                      type="text"
                      v-model="addFavoriteForm.title"
                      required
                      placeholder="Enter title">
        </b-form-input>
      </b-form-group>
      <b-form-group id="form-description-group"
                    label="Description:"
                    label-for="form-description-input">
          <b-form-input id="form-description-input"
                        type="text"
                        v-model="addFavoriteForm.description"
                        required
                        placeholder="Enter Description">
          </b-form-input>
      </b-form-group>
      <b-form-group id="form-metadata-group"
                    label="MetaData:"
                    label-for="form-metadata-input">
          <b-form-input id="form-metadata-input"
                        type="text"
                        v-model="addFavoriteForm.metaData"
                        required
                        placeholder="Enter Metadata">
          </b-form-input>
      </b-form-group>
      <b-form-group id="form-category-group"
                    label="Category:"
                    label-for="form-category-input">
          <b-select v-model="addFavoriteForm.categoryId">
          <option v-for="category in categories" v-bind:value="category.id">
            {{ category.type }}
          </option>
        </b-select>
      </b-form-group>
      <b-form-group id="form-rank-group"
                    label="Rank:"
                    label-for="form-rank-input">
          <b-form-input id="form-rank-input"
                       type="number" min="1" max="100"
                        v-model="addFavoriteForm.rank"
                        required
                        placeholder="Rank">
          </b-form-input>
      </b-form-group>
      <b-button-group>
          <b-button type="submit" variant="success">Save Favorite</b-button>
          <b-button type="reset" variant="warning">Reset</b-button>
      </b-button-group>
    </b-form>
  </b-modal>
   <b-modal ref="editFavoriteModal"
         id="favorite-update-modal"
         title="Update favorite things"
         hide-footer>
    <b-form  @submit="onSubmitUpdate" @reset="onResetUpdate" class="w-100">
    <b-form-group id="form-title-edit-group"
                  label="Title:"
                  label-for="form-title-edit-input">
        <b-form-input id="form-title-eidt-input"
                      type="text"
                      v-model="editFavoriteForm.title"
                      required
                      placeholder="Enter title">
        </b-form-input>
      </b-form-group>
      <b-form-group id="form-description-edit-group"
                    label="Description:"
                    label-for="form-description-eidt-input">
          <b-form-input id="form-description-edit-input"
                        type="text"
                        v-model="editFavoriteForm.description"
                        required
                        placeholder="Enter Description">
          </b-form-input>
      </b-form-group>
      <b-form-group id="form-metadata-edit-group"
                  label="MetaData:"
                  label-for="form-metadata-edit-input">
        <b-form-input id="form-metadata-edit-input"
                      type="text"
                      v-model="editFavoriteForm.metaData"
                      required
                      placeholder="Enter Metadata">
        </b-form-input>
      </b-form-group>
      <b-form-group id="form-category-edit-group"
            label="Category:"
            label-for="form-category-edit-input">
        <b-select v-model="editFavoriteForm.categoryId">
          <option v-for="category in categories" v-bind:value="category.id">
            {{ category.type }}
          </option>
        </b-select>
      </b-form-group>
       <b-form-group id="form-rank-edit-group"
                  label="Rank:"
                  label-for="form-rank-edit-input">
        <b-form-input id="form-rank-edit-input"
                      type="number"
                      v-model="editFavoriteForm.rank"
                      required
                      placeholder="">
        </b-form-input>
      </b-form-group>
      <b-button-group>
          <b-button type="submit" variant="success">Update</b-button>
          <b-button type="reset" variant="danger">Cancel</b-button>
      </b-button-group>
    </b-form>
  </b-modal>
  </div>
</template>


<script>
import axios from 'axios';
import Alert from './Alert.vue';
export default {
  // name: 'Favorite',
  data() {
    return {
      favorites: [],
      addFavoriteForm : {
        title: '',
        description: '',
        metaData: '',
        categoryId: '',
        rank: ''
      },
      editFavoriteForm : {
        id: '',
        title: '',
        description: '',
        metaData: '',
        categoryId: '',
        rank:''
      },
      message: '',
      showMessage: false,
      categories: [],
      token: localStorage.getItem('token'),
      username: localStorage.getItem('user')
    };
  },
  components: {
    alert: Alert,
  },
  methods: {
    getFavorite(){
      const path = 'http://127.0.0.1:5000/api/v1/favorites';
       var headers = {
        'Authorization': `Bearer ${this.token}`
      }
      // console.log('===>', headers)
      axios.get(path, {headers}).then((response) => {
        console.log('===>>>>', response)
        this.favorites = response.data.data;
      })
        .catch((error) => {
          console.log(error);
        });
    },

     getCategories(){
      const path = 'http://127.0.0.1:5000/api/v1/categories';
      axios.get(path).then((response) => {
        console.log('=====>>>', response.data.data)
        this.categories = response.data.data;
      })
        .catch((error) => {
          console.log(error);
        });
    },

    addFavorite(payload){
      const path = 'http://127.0.0.1:5000/api/v1/favorites';
      var headers = {
        'Authorization': `Bearer ${this.token}`
      }
      axios.post(path, payload,  {'headers':headers},).then((response) => {
        console.log('====>>',response)
        this.getFavorite()
        this.showMessage = true
        this.message = response.data.message

      })
      .catch((error) => {
        this.message = response.data.message
        this.getBooks();
      })

    },

    editFavorite(favorite) {
      this.editFavoriteForm = favorite;
    },
    updateFavorite(payload, favorite_id){
    const path = `http://127.0.0.1:5000/api/v1/favorite/${favorite_id}`;
    axios.patch(path, payload)
      .then((response) => {
        this.getFavorite();
        this.showMessage = true
        this.message = response.data.message
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
        this.getFavorite();
      });
    },

    initForm() {
        this.addFavoriteForm.title = '',
        this.addFavoriteForm.description = '',
        this.addFavoriteForm.category = '',
        this.addFavoriteForm.metaData = '',
         this.editFavoriteForm.title = '',
        this.editFavoriteForm.description = '',
        this.editFavoriteForm.category = '',
        this.editFavoriteForm.metaData = ''
    },

    onSubmit(evt){
      evt.preventDefault();
      this.$refs.addFavoriteModal.hide()
      const payload = {
        title: this.addFavoriteForm.title,
        description: this.addFavoriteForm.description,
        categoryId: this.addFavoriteForm.categoryId,
        metaData: this.addFavoriteForm.metaData,
        rank: this.addFavoriteForm.rank
      }
      this.addFavorite(payload);
      this.initForm();
    },

    onReset(evt){
      evt.preventDefault();
      this.$refs.addFavoriteModal.hide();
      this.initForm();
    },

    onSubmitUpdate(evt) {
      evt.preventDefault();
      this.$refs.editFavoriteModal.hide();
      const payload = {
        title: this.editFavoriteForm.title,
        description: this.editFavoriteForm.description,
        categoryId: this.editFavoriteForm.categoryId,
        metaData: this.editFavoriteForm.metaData
      }
      this.updateFavorite(payload, this.editFavoriteForm.id);
      this.initForm();
    },

    onResetUpdate(evt) {
      evt.preventDefault();
      this.$refs.editFavoriteModal.hide();
      this.initForm();
      this.getFavorite();
    },

    deleteFavorite(favorite_id) {
      const path = `http://127.0.0.1:5000/api/v1/favorite/${favorite_id}`;
      axios.delete(path)
        .then((response) => {
          this.getFavorite();
          this.message = response.data.message;
          this.showMessage = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.getFavorite();
        });
    },
    onDeleteFavorite(favorite) {
      this.deleteFavorite(favorite.id);
    },
  },
   created() {
    this.getFavorite();
    this.getCategories();
  },
};
</script>
