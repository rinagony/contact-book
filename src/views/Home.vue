<template>
  <div id="Home">
    <div class="container">
      <div class="wrapperContacts">
        <h1>Список контактов</h1>
        <div class="wrapperContactsItem">
          <loading :active.sync="isLoaded" :can-cancel="true"></loading>
          <table>
            <thead>
              <tr class="tableGroup">
                <th>Id</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Номер телефона</th>
                <th>Email</th>
                <th>Открыть</th>
                <th>Удалить</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in eventList" :key="item.index">
                <td :ref="item.index">{{ item.index + 1 }}</td>
                <td v-if="(isLoaded = false)">{{ item.key }}</td>
                <td>{{ item.value.name }}</td>
                <td>{{ item.value.lastName }}</td>
                <td>{{ item.value.phone }}</td>
                <td>{{ item.value.email }}</td>
                <td>
                  <router-link class="remove" :to="`/ContactEach/${item.key}`"
                    ><img src="@/assets/images/open.png" alt=""
                  /></router-link>
                </td>
                <td>
                  <button
                    class="removeContact"
                    @click.prevent="
                      showModalOne = !showModalOne;
                      currentId = item.key;
                    "
                  >
                    x
                  </button>
                  <div class="modal">
                    <div class="customModal" v-if="showModalOne">
                      <div class="customModalTitle">
                        <p>Подтвердите действие</p>
                      </div>
                      <div class="customModalFooter">
                        <button
                          class="greenButton"
                          @click.prevent="removeContact()"
                        >
                          Продолжить
                        </button>
                        <button
                          class="greenButton"
                          @click="showModalOne = !showModalOne"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="form">
          <h3>Добавить в книгу новый контакт</h3>
          <form @submit.prevent="addContact">
            <input
              placeholder="Имя"
              type="text"
              v-model="contactName"
              required
            />
            <input
              placeholder="Фамилия"
              type="text"
              v-model="contactLastName"
              required
            />
            <input
              type="tel"
              pattern="8[0-9]{10}"
               placeholder="8[***]{***}-[****]"
              v-model="contactPhone"
              required
            />
            <input
              placeholder="Email"
              type="email"
              v-model="contactEmail"
              required
            />
            <button class="greenButton" type="submit">Добавить</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  name: "Home",
  components: {
    Loading,
  },
  data() {
    return {
      isLoaded: true,
      usersData: "",
      isLoad: this.eventList,
      contactName: "", // содержимое инпута с именем
      contactLastName: "", // содержимое инпута с фамилией
      contactPhone: "", // содержимое инпута с телефоном
      contactEmail: "", // содержимое инпута с почтой
      showModalOne: false, //переменная отвечающая за отображение модального окна
      currentId: null,
    };
  },
  computed: {
    eventList() {
      return this.$store.getters.getUsers;
    },
  },
  beforeMount() {
    this.$store.dispatch("setUsers");
    if (this.isLoad) {
      return (this.isLoaded = false);
    }
  },
  methods: {
    async removeContact() {
      console.log(this.currentId);
      this.$store
        .dispatch("removeUser", this.currentId)
        .then(this.$store.dispatch("setUsers"));
      this.showModalOne = !this.showModalOne;
    },
    async addContact() {
      let item = {
        //информация нового контакта в объекте для удобства передачи в стор
        name: this.contactName,
        lastName: this.contactLastName,
        phone: this.contactPhone,
        email: this.contactEmail,
      };
      this.$store
        .dispatch("addContact", item)
        .then(this.$store.dispatch("setUsers"));
      this.contactName = ""; //очистка инпут
      this.contactLastName = ""; //очистка инпут
      this.contactPhone = ""; //очистка инпут
      this.contactEmail = ""; //очистка инпут
    },
    // computed: {
    //   users() {
    //     return this.$store.state.users; //получение контактов из стейта
    //   },
    // },
    // async addContact() {
    //   let item = {
    //     //информация нового контакта в объекте для удобства передачи в стор
    //     name: this.contactName,
    //     lastName: this.contactLastName,
    //     phone: this.contactPhone,
    //     email: this.contactEmail,
    //   };
    //   this.$store.dispatch("addContact", item).then(
    //     //передача нового контакта в стор
    //     window.location.reload()
    //   );
    //   this.contactName = ""; //очистка инпут
    //   this.contactLastName = ""; //очистка инпут
    //   this.contactPhone = ""; //очистка инпут
    //   this.contactEmail = ""; //очистка инпут
    // },
    // getUsers() {
    //   var db_representation = [];
    //   this.contact.on("value", function (snapshot) {
    //     var db_keys_and_values = snapshot.val();
    //     var table_index = 0;
    //     for (var key in db_keys_and_values) {
    //       var db_value = db_keys_and_values[key];
    //       db_representation.push({
    //         key: key,
    //         value: db_value,
    //         index: table_index,
    //       });
    //       table_index += 1;
    //     }
    //   });
    //   this.usersData = db_representation;
    //   console.log(this.usersData);
    // },
    // addContact() {
    //   console.log(this.usersData.length);
    //   let item = {
    //     name: this.contactName,
    //     lastName: this.contactLastName,
    //     phone: this.contactPhone,
    //     email: this.contactEmail,
    //   };
    //   textRef.push(item);
    //   this.getUsers();
    //   toastr.success("Added");
    //   this.contactName = ""; //очистка инпут
    //   this.contactLastName = ""; //очистка инпут
    //   this.contactPhone = ""; //очистка инпут
    //   this.contactEmail = ""; //очистка инпут
    // },
    // removeContact() {
    //   console.log(textRef);
    //   // textRef.child(`${this.currentId}`).remove();
    //   // let curId = this.currentId;
    //   // textRef.child(this.currentId).remove();
    //   var idd = this.currentId;
    //   // let userRef = textRef + "/" + idd;
    //   // textRef.removeValue(userRef);
    //   textRef.on("value", function () {
    //     console.log(idd)
    //     var adaRef = firebase.database().ref("users/" + idd);
    //     adaRef
    //       .remove()
    //       .then(function () {
    //         console.log("Remove succeeded.");
    //       })
    //       .catch(function (error) {
    //         console.log("Remove failed: " + error.message);
    //       });
    //     // var k = snapshot.val();
    //     // for (var i in k) {
    //     //   if (k[i].id == curId) {
    //     //     snapshot.getRef().removeValue();
    //     //     k.child(i).remove();
    //     //   }
    //     // }
    //   });
    //   this.getUsers();
    //   // this.$store
    //   //   .dispatch("deleteContact", this.currentId)
    //   //   .then(window.location.reload()); //передача контакта для его удаления в стор
    //   this.showModalOne = !this.showModalOne; //исчезновение модального окна с подтверждением об удалении конакта
    // },
  },
};
</script>

<style lang="scss" scoped>
.contactsList {
  list-style: none;
  margin: 0;
  padding: 0;
}

table {
  width: 100%;
  border-spacing: 5px;
}

.tableGroup {
  background: rgb(35, 185, 148);
  color: #fff;
  button {
    opacity: 0;
    margin-left: 1.5rem;
  }
}

h1 {
  text-align: center;
}
.contactItem {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapperItemListSpecial {
  margin: 10px 0;
  width: 50%;
  font-size: 17px;
  text-align: center;
  background: rgb(252, 246, 241);
  border: 1px solid rgb(92, 92, 92);
}

h1 {
  color: rgb(51, 51, 51);
}

h3 {
  color: rgb(51, 51, 51);
}

.wrapperItemList {
  margin: 10px 0;
  width: 100%;
  background: rgb(252, 246, 241);
  border: 1px solid rgb(92, 92, 92);
  p {
    text-align: center;
    font-size: 17px;
  }
}

#turtle {
  opacity: 0;
}
.listContactInfo {
  border: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  padding-left: 1rem;
  padding-top: 1rem;
  position: relative;
  margin-bottom: 1rem;
  color: #000;
  text-decoration: none;
  font-size: 17px;
}

table,
th,
td {
  border: 0.8px solid rgb(224, 224, 224);
  border-collapse: collapse;
}

input {
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 5px;
  color: rgb(75, 75, 75);
}
tr:nth-child(odd) {
    background-color: #eee;
}

th {
  background-color: #706d97;
}

th,
td {
  padding: 8px;
  font-size: 17px;
}
th {
  text-align: left;
}
.form {
  margin-top: 2rem;
}

.btn {
  outline: none !important;
}
.btn.btn-primary {
  background-color: #5c4084;
  border-color: #5c4084;
  outline: none;
  &:hover {
    background-color: darken(#5c4084, 10%);
    border-color: darken(#5c4084, 10%);
  }
  &:active,
  &:focus {
    background-color: lighten(#5c4084, 5%);
    border-color: lighten(#5c4084, 5%);
  }
  & .fa {
    padding-right: 4px;
  }
}

table {
  border-radius: 20px;
}

.removeContact {
  margin-left: 40%;
}
</style>
