const bif = {
  state: {
    bif: {},
    chainId: 0
  },

  mutations: {
    SET_BIF: (state, bif) => {
      state.bif = bif;
    },
    SET_CHAINID: (state, chainId) => {
      state.chainId = chainId;
    }
  },

  actions: {
    async UPDATE_BIF({ commit, state }, bif) {
      return new Promise(resolve => {
        commit('SET_BIF', bif);
        resolve();
      }).catch(error => {
        console.log(error);
      });
    },
    async UPDATE_CHAINID({ commit, state },chainId) {
      return new Promise(resolve => {
        commit('SET_CHAINID', chainId);
        resolve();
      }).catch(error => {
        console.log(error);
      });
    }
  }
}

export default bif;
