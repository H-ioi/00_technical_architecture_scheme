import { getStore, setStore } from "@/util/store";

const thePool = {
  state: {
    thePool_LocalCache: getStore({ name: "thePool_LocalCache" }) || {},
    keyword: "",
    searchType: getStore({ name: "searchType" }) || "checkbox",
  },
  actions: {
    async searchList({ commit }, params) {
      console.log("【搜索列表】参数：", params);
    },
    async clearKeyword({ commit }, params) {
      console.log("【清除搜索关键词】参数：", params);
    },
  },
  mutations: {
    SET_ThePool_LocalCache: (state, params = {}) => {
      let { name, value } = params;
      state.thePool_LocalCache[name] = value;
      setStore({
        name: "thePool_LocalCache",
        content: state.thePool_LocalCache,
      });
    },
    SET_KEYWORD: (state, keyword) => {
      console.log("SET_KEYWORD", keyword);
      state.keyword = keyword;
    },
    SET_SEARCH_TYPE: (state, type) => {
      state.searchType = type;
      setStore({
        name: "searchType",
        content: type,
      });
    },
  },
};

export default thePool;
