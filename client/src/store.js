import Vue from 'vue'
import Vuex from 'vuex'
import userAPI from './apis/users'
import { stat } from 'fs'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: {
      id: -1,
      name: '',
      avatar: '',
      role: '',
      subscriptionStatus: false,
      subscriptionBalance: -1
    },
    isAuthenticated: false,
    token: ''
  },
  mutations: {
    setCurrentUser (state, currentUser) {
      state.currentUser = {
        ...state.currentUser,
        ...currentUser
      }
      // update authentication status
      state.isAuthenticated = true
      // update token
      state.token = localStorage.getItem('token')
    },
    revokeAuthentication (state) {
      state.currentUser = {}
      state.isAuthenticated = false
      state.token = ''
      localStorage.removeItem('token')
    },
    updateBalance (state, payload) {
      state.currentUser.subscriptionBalance += payload
    }
  },
  actions: {
    async fetchCurrentUser ({ commit }) {
      try {
        // fetch current user data
        const { data, statusText } = await userAPI.getCurrentUser()
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(statusText)
        // commit change
        commit('setCurrentUser', {
          id: data.user.id,
          name: data.user.name,
          avatar: data.user.avatar,
          role: data.user.role,
          subscriptionStatus: data.user.sub_status,
          subscriptionBalance: data.user.sub_balance
        })
        // is authenticated
        return true
      } catch (error) {
        // clear state
        commit('revokeAuthentication')
        // is not authenticated
        return false
      }
    }
  },
  getters: {
    controlPanelRouteName: state => {
      if (state.currentUser.role === 'Admin') return 'admin-panel'
      if (state.currentUser.role === 'User' && state.currentUser.subscriptionStatus) return 'order-tomorrow'
      if (state.currentUser.role === 'User' && !state.currentUser.subscriptionStatus) return 'subscribe'
      if (state.currentUser.role === 'Owner') return 'owner-info'
    }
  }
})
