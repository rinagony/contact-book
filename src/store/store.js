
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from "firebase";
// import toastr from "toastr";
import VueResource from 'vue-resource';

Vue.use(VueResource)

var config = {
    apiKey: "AIzaSyCdGw4ZP5ov5V5Dj9OE8yPO3jAz6f11ls8",
    authDomain: "contact-book-bebea.firebaseapp.com",
    projectId: "contact-book-bebea",
    storageBucket: "contact-book-bebea.appspot.com",
    messagingSenderId: "68518801019",
    appId: "1:68518801019:web:fe0e901f3364594d75bcde",
    measurementId: "G-3QNYYS4HEC",
};

let app = firebase.initializeApp(config);
const db = app.database();
const textRef = db.ref('users')

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        users: null
    },
    getters: {
        getUsers: state => {
            return state.users
        }
    },
    mutations: {
        setUsers(state, users) {
            state.users = users
        },
    },
    actions: {
        setUsers: (ctx) => {
            let db_representation = [];
            textRef.on('value', snapshot => {
                var db_keys_and_values = snapshot.val();
                var table_index = 0;

                for (var key in db_keys_and_values) {
                    var db_value = db_keys_and_values[key];
                    db_representation.push({ "key": key, "value": db_value, "index": table_index });
                    table_index += 1;
                }
            });
            ctx.commit('setUsers', db_representation)
        },
        removeUser: (ctx, item) => {
            // console.log(textRef)
            let newRef = textRef.child(item).remove();
            ctx.commit('setUsers', newRef)
        },
        addContact: (ctx, item) => {
            // console.log(item)
            let newRef = textRef.push({
                name: item.name,
                lastName: item.lastName,
                phone: item.phone,
                email: item.email,
            });
            ctx.commit('setUsers', newRef)
        },
        changeUser: (ctx, itemContact) => {
            // console.log(itemContact)
            db.ref('users' + '/' + itemContact.key).set({
                name: itemContact.value.name,
                lastName: itemContact.value.lastName,
                phone: itemContact.value.phone,
                email: itemContact.value.email,
            });

        }
    },
})


// import axios from 'axios'
// import Vuex from 'vuex'
// import Vue from 'vue'
// const baseURL = "http://localhost:3000/todos";
// import firebase from 'firebase'
// import toastr from 'toastr'

// var config = {
//     apiKey: "AIzaSyCdGw4ZP5ov5V5Dj9OE8yPO3jAz6f11ls8",
//     authDomain: "contact-book-bebea.firebaseapp.com",
//     projectId: "contact-book-bebea",
//     storageBucket: "contact-book-bebea.appspot.com",
//     messagingSenderId: "68518801019",
//     appId: "1:68518801019:web:fe0e901f3364594d75bcde",
//     measurementId: "G-3QNYYS4HEC"
//   };

// let app = firebase.initializeApp(config)
// let db = app.database();
// let textRef = db.ref('users')
// Vue.use(Vuex);


// const state = {
//     contact: [] //все контакты
// }
// const getters = {}


// const actions = {
//     getContact({ commit }) {
//         axios.get(baseURL) //получение контактов 
//             .then(response => {
//                 commit('SET_CONTACT', response.data) //вызов мутаций 
//             })
//     },
//     deleteContact({ commit }, item) {//удаление контакта 
//         axios.delete(baseURL + "/" + item)
//             .then(response => {
//                 console.log(response.data)
//                 commit('REMOVE_CONTACT', response.data)
//             })
//     },
//     addContact({ commit }, item) {
//         axios.post(baseURL, { //передача новых объектов массива в бд
//             name: item.name,
//             lastName: item.lastName,
//             phone: item.phone,
//             email: item.email,
//         })
//             .then(response => {
//                 commit('ADD_CONTACT', response.data)
//             })
//     },
//     changeContact({ commit }, item) { //передача изменений массива контактов
//         axios.patch(baseURL + "/" + item.id, {
//             name: item.name,
//             lastName: item.lastName,
//             phone: item.phone,
//             email: item.email,
//         })
//             .then(response => {
//                 commit('CHANGE_CONTACT', response.data)
//             })
//     }
// }


// const mutations = {
//     SET_CONTACT(state, contact) {
//         state.contact = contact
//     },
//     REMOVE_CONTACT(state, contact) {
//         state.contact = contact
//     },
//     ADD_CONTACT(state, contact) {
//         state.contact = contact
//     },
//     CHANGE_CONTACT(state, contact) {
//         state.contact = contact
//     },
// }

// //экспорт
// export default new Vuex.Store({
//     state,
//     getters,
//     actions,
//     mutations
// })