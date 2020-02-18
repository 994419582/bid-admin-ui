const wallet = {
  state: {
    init: false,
    keyObject: {},
    privateKey: '',
    balance: 0
  },

  mutations: {
    SET_INIT: (state, initState) => {
      state.init = initState
    },
    SET_KEYOBJECT: (state, keyObject) => {
      state.keyObject = keyObject
    },
    SET_PRIVATEKEY: (state, privateKey) => {
      state.privateKey = privateKey
    },
    SET_BALANCE: (state, balance) => {
      state.balance = balance
    }
  },

  actions: {
    async SET_WALLET({ commit, state }, walletData) {
      return new Promise(resolve => {
        commit('SET_INIT', true)
        commit('SET_KEYOBJECT', walletData.keyObject)
        commit('SET_PRIVATEKEY', walletData.privateKey)
        commit('SET_BALANCE', walletData.balance)
        resolve();
      }).catch(error => {
        console.log(error);
      })
    },

    async CLEAR_WALLET({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_INIT', false)
        commit('SET_KEYOBJECT', {})
        commit('SET_PRIVATEKEY', '')
        commit('SET_BALANCE', 0)
        resolve()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}

export default wallet;
