<template>
  <div>redirect</div>
</template>

<script>
import { redirectPath } from "@/const/redirect/index.js";
import { removeStore } from "@/util/store";

export default {
  name: "redirectgage",
  beforeRouteEnter(to, from, next) {
    let loginPath = "";
    const NODE_ENV = process.env.NODE_ENV;
    window.sessionStorage.clear();
    switch (NODE_ENV) {
      case "local":
        loginPath = redirectPath();
        next({
          path: loginPath,
          query: {
            redirect: 1,
          },
        });
        break;
      case "test":
        removeStore({
          name: "tenantId",
          type: "session",
        });
        loginPath = redirectPath();
        next({
          path: loginPath,
          query: {
            redirect: 1,
          },
        });
        break;
      case "production":
        removeStore({
          name: "tenantId",
          type: "session",
        });
        loginPath = redirectPath();
        next({
          path: loginPath,
          query: {
            redirect: 1,
          },
        });
        break;
      case "pre":
        removeStore({
          name: "tenantId",
          type: "session",
        });
        loginPath = redirectPath();
        next({
          path: loginPath,
          query: {
            redirect: 1,
          },
        });
        break;
      case "online":
        removeStore({
          name: "tenantId",
          type: "session",
        });
        loginPath = redirectPath();
        next({
          path: loginPath,
          query: {
            redirect: 1,
          },
        });
        break;
    }
  },
  data() {
    return {};
  },
  created() {
    // console.log(666666666666);
  },
  mounted() {},
  activated() {},
  computed: {},
  methods: {},
};
</script>
