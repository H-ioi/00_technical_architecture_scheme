<template>
  <div></div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "empty",
  beforeRouteEnter(to, from, next) {
    console.log("111111111");
    next(vm => {
      let tenantId = vm.tenantId;
      let token = vm.access_token;
      console.log("beforeRouteEnter", tenantId, token);
      if (tenantId) {
        if (token) {
          switch (tenantId) {
            case 1:
              vm.$router.push({ path: "/order/mylist/index?status=2" });
              break;
            case 2:
              vm.$router.push({ path: "/thepool/enquiry/my/index" });
              break;
            case 3:
              vm.$router.push({ path: "/isa/home/index" });
              break;
            case 4:
              vm.$router.push({ path: "/academy/course/course" });
              break;
          }
        } else {
          switch (tenantId) {
            case 1:
              vm.$router.push({ path: "/login" });
              break;
            case 2:
              vm.$router.push({ path: "/loginisa" });
              break;
            case 3:
              vm.$router.push({ path: "/logingroup" });
              break;
            case 4:
              vm.$router.push({ path: "/loginisacentre" });
              break;
          }
        }
      } else {
        vm.$router.push({ path: "/login" });
      }
      vm.$store.commit("CLOSE_TAG_CURRENT", "/empty");
    });
  },
  data() {
    return {};
  },
  created() {
    console.log(66666666666);
    console.log(this.tenantId, this.access_token);
  },
  mounted() {},
  computed: {
    ...mapGetters(["tenantId", "access_token"])
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
