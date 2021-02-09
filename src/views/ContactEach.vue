<template>
  <div id="ContactEach">
    <div class="wrpCheaps" v-show="modalShow">
      <p>Контакт успешно изменен!</p>
      <button @click="modalShow = false" class="closeMessage">x</button>
    </div>
    <div class="container">
      <div class="wrpConatactEach">
        <div class="form">
          <h3>Изменить контакт</h3>
          <form id="changeForm" @submit.prevent="changeContactItem">
            <div class="inputItem">
              <label for="name">Имя:</label>
              <input
                id="name"
                placeholder="Имя"
                ref="inputName"
                type="text"
                :value="item.value.name"
              />
            </div>
            <div style="display: none">
              <input ref="inputKey" :value="item.key" />
            </div>
            <div class="inputItem">
              <label for="lastname">Фамилия:</label>
              <input
                id="lastname"
                placeholder="Фамилия"
                ref="inputLastName"
                type="text"
                :value="item.value.lastName"
              />
            </div>
            <div class="inputItem">
              <label for="phone">Телефон:</label>
              <input
                id="phone"
                type="tel"
                pattern="8[0-9]{10}"
                placeholder="8[***]{***}-[****]"
                ref="inputPhone"
                :value="item.value.phone"
              />
            </div>
            <div class="inputItem">
              <label for="email">Email:</label>
              <input
                id="email"
                placeholder="Email"
                ref="inputEmail"
                type="email"
                :value="item.value.email"
              />
            </div>
            <div class="wrapperButtons">
              <button class="greenButton" type="submit">Сохранить</button>
              <button @click="removeChanges()" class="greenButton">
                Отменить изменения
              </button>
              <div class="modal">
                <button
                  class="removeContact"
                  @click.prevent="
                    showModalOne = !showModalOne;
                    currentIndex = contact.indexOf(item);
                  "
                >
                  x
                </button>
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
            </div>
          </form>
          <router-link
            @click="localStorage.remove('contact')"
            class="returnButton"
            to="/"
          >
            <img src="@/assets/images/undo.png" alt="" />Вернуться
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactEach",
  components: {},
  data() {
    return {
      usersData: "",
      currentContact: this.$route.params.id, //айди текущего контакта
      item: "",
      beforeChanges: [],
      modalShow: false, //неизмененная информация
      showModalOne: false, //переменная отвечающая за отображение модального окна
    };
  },
  computed: {
    eventList() {
      return this.$store.getters.getUsers;
    },
  },
  beforeMount() {
    this.$store.dispatch("setUsers").then(this.getUser());
    this.getUnits();
  },
  methods: {
    getUser() {
      let arrayNew = this.eventList;
      for (var i = 0; i < arrayNew.length; i++) {
        //отбор контакта с определенным айди
        // console.log(arrayNew[i].key);
        // console.log(this.currentContact);
        if (arrayNew[i].key == this.currentContact) {
          this.item = arrayNew[i];
          // console.log(this.item.value.email);
        }
      }
      this.beforeChanges = this.item; //сохранение объекта до его изменений
    },
    async changeContactItem() {
      this.saveData();
      this.item.name = this.$refs.inputName.value; //отображение информации о контакте в инпут
      this.item.lastName = this.$refs.inputLastName.value;
      this.item.phone = this.$refs.inputPhone.value;
      this.item.email = this.$refs.inputEmail.value;
      let keyItem = this.$refs.inputKey.value;
      console.log(keyItem);
      var itemContact = {
        key: keyItem,
        value: {
          id: this.currentContact,
          name: this.item.name,
          lastName: this.item.lastName,
          phone: this.item.phone,
          email: this.item.email,
        },
        //создание объекта для удобства передачи в стор
      };
      this.$store
        .dispatch("changeUser", itemContact) //передача изменений в стор
        .then((this.modalShow = true)); //показ модального окна об успешных изменениях
      this.$store.dispatch("setUsers").then(this.getUser());
    },
    getUnits() {},
    async removeContact() {
      //удаление контакта
      this.$store
        .dispatch("removeUser", this.currentContact)
        .then(this.$store.dispatch("setUsers"));
      this.showModalOne = !this.showModalOne; //исчезновение модального окна с подтверждением об удалении конакта
      localStorage.removeItem("contact");
      this.$router.push("/"); //переход на главную
    },
    saveData() {
      window.localStorage.setItem(
        //сохранение неизмененной инфо в локал стораж
        "contact",
        JSON.stringify(this.beforeChanges) //преобразование в строку
      );
    },
    removeChanges() {
      if (window.localStorage.getItem("contact")) {
        let data = window.localStorage.getItem("contact");
        this.beforeChanges = JSON.parse(data); //преобразование в объект
        console.log(this.beforeChanges.key);
        this.item.value.name = this.beforeChanges.value.name;
        this.item.value.lastName = this.beforeChanges.value.lastName;
        this.item.value.phone = this.beforeChanges.value.phone;
        this.item.value.email = this.beforeChanges.value.email;
        localStorage.removeItem("contact");
        //шаг назад
      }
    },
  },
  // computed: {
  //   // contact() {
  //   //   return this.$store.state.contact;//получение контактов из стейта
  //   // },
  // },
  // beforeMount() {
  //   this.saveUser();
  // },
  // mounted() {
  //   // this.$store.dispatch("getContact"); //получение контактов из стейта
  // },
};
</script>

<style lang="scss" scoped>
@import "./../assets/styles/styles.scss";
#changeForm {
  display: flex;
  flex-direction: column;
}

.returnButton {
  margin-top: 3rem;
  outline: none;
  display: flex;
  outline: none;
  color: #000;
  justify-content: start;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
  img {
    width: 30px;
    margin-right: 5px;
  }
}

.inputItem {
  display: flex;
  align-items: center;
  label {
    font-size: 18px;
    margin-top: 20px;
    width: 100px;
  }
  input {
    max-width: 600px;
    font-size: 18px;
    border-top: none;
    border-left: none;
    border-right: none;
    outline: none;
  }
}

.greenButton {
  margin-top: 2rem;
  background-color: #706d97;
}

.wrpConatactEach {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}

h3 {
  text-align: center;
  font-size: 24px;
}
.wrpCheaps {
 background-color: #706d97;
  position: absolute;
  z-index: 1000;
  right: 10%;
  top: 3%;
  color: #fff;
  font-weight: 600;
  font-size: 19px;
  padding: 10px;
  border-radius: 5px;

  .closeMessage {
    position: absolute;
    top: 5px;
    background: none;
    border: 0.3px solid #fff;
    color: #fff;
    cursor: pointer;
    font-size: 17px;
    outline: none;
    right: 5px;
  }
}

.removeContact {
  margin-top: 2rem;
  margin-left: 2rem;
}

.wrpCheapsError {
  background: rgb(185, 35, 35);
  position: absolute;
  z-index: 1000;
  right: 10%;
  top: 3%;
  color: #fff;
  font-weight: 600;
  font-size: 19px;
  padding: 10px;
  border-radius: 5px;

  .closeMessage {
    position: absolute;
    top: 5px;
    background: none;
    border: 0.3px solid #fff;
    color: #fff;
    cursor: pointer;
    font-size: 17px;
    outline: none;
    right: 5px;
  }
}

.wrapperButtons {
  display: flex;
}

.removeChanges {
  background: #fff;
  color: coral;
  font-weight: 600;
  cursor: pointer;
}
</style>
