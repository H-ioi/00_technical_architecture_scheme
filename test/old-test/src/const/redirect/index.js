import { getStore, setStore } from "@/util/store";
const urlObj = {
  test: "218.19.163.250:11250",
  production: "218.19.163.250:11303",
  pre: "pre-uni-gateway.isaieg.com",
  online: "online-uni-gateway.isaieg.com",
};
// 演示环境域名
export const testWeb = [
  {
    tenantId: 1,
    website: "demo-manager.isafam.com",
    testwebsite: "manager111111",
    path: "/login",
  },
  {
    tenantId: 2,
    website: "demo-pool.isaieg.com",
    testwebsite: "a-pool.isaieg.com",
    path: "/loginisa",
  },
  {
    tenantId: 3,
    website: "demo-datacenter.isaieg.com",
    testwebsite: "datacenter33333",
    path: "/logingroup",
  },
  {
    tenantId: 4,
    website: "demo-isaic.isaieg.com",
    testwebsite: "isaic444444",
    path: "/loginisacentre",
  },
  {
    tenantId: 5,
    website: "test-community.isaieg.com",
    testwebsite: "isaic444444",
    path: "/isacommunity/login",
  },
  {
    tenantId: 6,
    website: "test-edu.isaieg.com",
    testwebsite: "isaic444444",
    path: "/ems/login",
  },
];
// 预发布环境域名
export const preWeb = [
  {
    tenantId: 1,
    website: "demo-manager.isafam.com",
    testwebsite: "manager111111",
    path: "/login",
  },
  {
    tenantId: 2,
    website: "pre-pool.isaieg.com",
    path: "/loginisa",
  },
  {
    tenantId: 3,
    website: "demo-datacenter.isaieg.com",
    testwebsite: "datacenter33333",
    path: "/logingroup",
  },
  {
    tenantId: 4,
    website: "demo-isaic.isaieg.com",
    testwebsite: "isaic444444",
    path: "/loginisacentre",
  },
  {
    tenantId: 5,
    website: "test-community.isaieg.com",
    testwebsite: "isaic444444",
    path: "/isacommunity/login",
  },
  {
    tenantId: 6,
    website: "test-edu.isaieg.com",
    testwebsite: "isaic444444",
    path: "/ems/login",
  },
];
// online环境域名
export const onlineWeb = [
  {
    tenantId: 1,
    website: "demo-manager.isafam.com",
    testwebsite: "manager111111",
    path: "/login",
  },
  {
    tenantId: 2,
    website: "online-pool.isaieg.com",
    path: "/loginisa",
  },
  {
    tenantId: 3,
    website: "demo-datacenter.isaieg.com",
    testwebsite: "datacenter33333",
    path: "/logingroup",
  },
  {
    tenantId: 4,
    website: "demo-isaic.isaieg.com",
    testwebsite: "isaic444444",
    path: "/loginisacentre",
  },
  {
    tenantId: 5,
    website: "test-community.isaieg.com",
    testwebsite: "isaic444444",
    path: "/isacommunity/login",
  },
  {
    tenantId: 6,
    website: "test-edu.isaieg.com",
    testwebsite: "isaic444444",
    path: "/ems/login",
  },
];
// 生产环境域名
export const productWeb = [
  {
    tenantId: 1,
    website: "manager.isafam.com",
    path: "/login",
  },
  {
    tenantId: 2,
    website: "pool.isaieg.com",
    path: "/loginisa",
  },
  {
    tenantId: 3,
    website: "datacenter.isaieg.com",
    path: "/logingroup",
  },
  {
    tenantId: 4,
    website: "isaic.isaieg.com",
    path: "/loginisacentre",
  },
  {
    tenantId: 5,
    website: "community.isaieg.com",
    path: "/isacommunity/login",
  },
  {
    tenantId: 6,
    website: "edu.isaieg.com",
    path: "/ems/login",
  },
];

export const canEnterPage = (currentPath, meta) => {
  // 获取当前环境
  let canEnter = false;
  let href = window.location.href;
  const NODE_ENV = process.env.NODE_ENV;
  const TENANT_ID = getStore({
    name: "tenantId",
  });
  switch (NODE_ENV) {
    case "local":
      canEnter = true;
      break;
    case "test":
      if (href.indexOf(urlObj["test"]) != -1) {
        canEnter = true;
      } else {
        testWeb.map((item) => {
          if (
            href.indexOf(item["website"]) != -1 ||
            href.indexOf(item["testwebsite"]) != -1
          ) {
            if (TENANT_ID) {
              canEnter = TENANT_ID == item["tenantId"];
              if (!canEnter) {
                setStore({ name: "tenantId", content: item["tenantId"] });
              } else {
                if (meta && meta["isLogin"]) {
                  canEnter = currentPath == item["path"];
                } else {
                  canEnter = true;
                }
              }
            } else {
              if (meta && meta["isLogin"]) {
                canEnter = currentPath == item["path"];
              } else {
                canEnter = true;
              }
            }
          }
        });
      }
      break;
    case "production":
      if (href.indexOf(urlObj["production"]) != -1) {
        canEnter = true;
      } else {
        productWeb.map((item) => {
          if (href.indexOf(item["website"]) != -1) {
            if (TENANT_ID) {
              canEnter = TENANT_ID == item["tenantId"];
              if (!canEnter) {
                setStore({ name: "tenantId", content: item["tenantId"] });
              } else {
                if (meta && meta["isLogin"]) {
                  canEnter = currentPath == item["path"];
                } else {
                  canEnter = true;
                }
              }
            } else {
              if (meta && meta["isLogin"]) {
                canEnter = currentPath == item["path"];
              } else {
                canEnter = true;
              }
            }
          }
        });
      }

      break;
    case "pre":
      if (href.indexOf(urlObj["pre"]) != -1) {
        canEnter = true;
      } else {
        preWeb.map((item) => {
          if (href.indexOf(item["website"]) != -1) {
            if (TENANT_ID) {
              canEnter = TENANT_ID == item["tenantId"];
              if (!canEnter) {
                setStore({ name: "tenantId", content: item["tenantId"] });
              } else {
                if (meta && meta["isLogin"]) {
                  canEnter = currentPath == item["path"];
                } else {
                  canEnter = true;
                }
              }
            } else {
              if (meta && meta["isLogin"]) {
                canEnter = currentPath == item["path"];
              } else {
                canEnter = true;
              }
            }
          }
        });
      }

      break;
    case "online":
      if (href.indexOf(urlObj["online"]) != -1) {
        canEnter = true;
      } else {
        onlineWeb.map((item) => {
          if (href.indexOf(item["website"]) != -1) {
            if (TENANT_ID) {
              canEnter = TENANT_ID == item["tenantId"];
              if (!canEnter) {
                setStore({ name: "tenantId", content: item["tenantId"] });
              } else {
                if (meta && meta["isLogin"]) {
                  canEnter = currentPath == item["path"];
                } else {
                  canEnter = true;
                }
              }
            } else {
              if (meta && meta["isLogin"]) {
                canEnter = currentPath == item["path"];
              } else {
                canEnter = true;
              }
            }
          }
        });
      }

      break;
  }
  return canEnter;
};
export const redirectPath = () => {
  // 获取当前环境
  let path = "";
  const TENANT_ID = getStore({
    name: "tenantId",
  });
  let href = window.location.href;
  const NODE_ENV = process.env.NODE_ENV;
  switch (NODE_ENV) {
    case "local":
      if (TENANT_ID) {
        switch (TENANT_ID) {
          case 1:
            path = "/login";
            break;
          case 2:
            path = "/loginisa";
            break;
          case 3:
            path = "/logingroup";
            break;
          case 4:
            path = "/loginisacentre";
            break;
          case 5:
            path = "/isacommunity/login";
            break;
          case 6:
            path = "/ems/login";
            break;
        }
      } else {
        path = "/login";
      }

      break;
    case "test":
      if (href.indexOf(urlObj["test"]) != -1) {
        if (TENANT_ID) {
          switch (TENANT_ID) {
            case 1:
              path = "/login";
              break;
            case 2:
              path = "/loginisa";
              break;
            case 3:
              path = "/logingroup";
              break;
            case 4:
              path = "/loginisacentre";
              break;
            case 5:
              path = "/isacommunity/login";
              break;
            case 6:
              path = "/ems/login";
              break;
          }
        } else {
          path = "/login";
        }
      } else {
        testWeb.map((item) => {
          if (
            href.indexOf(item["website"]) != -1 ||
            href.indexOf(item["testwebsite"]) != -1
          ) {
            path = item["path"];
          }
        });
      }

      break;
    case "production":
      if (href.indexOf(urlObj["production"]) != -1) {
        if (TENANT_ID) {
          switch (TENANT_ID) {
            case 1:
              path = "/login";
              break;
            case 2:
              path = "/loginisa";
              break;
            case 3:
              path = "/logingroup";
              break;
            case 4:
              path = "/loginisacentre";
              break;
            case 5:
              path = "/isacommunity/login";
              break;
            case 6:
              path = "/ems/login";
              break;
          }
        } else {
          path = "/login";
        }
      } else {
        productWeb.map((item) => {
          if (href.indexOf(item["website"]) != -1) {
            path = item["path"];
          }
        });
      }
      break;
    case "pre":
      if (href.indexOf(urlObj["pre"]) != -1) {
        if (TENANT_ID) {
          switch (TENANT_ID) {
            case 1:
              path = "/login";
              break;
            case 2:
              path = "/loginisa";
              break;
            case 3:
              path = "/logingroup";
              break;
            case 4:
              path = "/loginisacentre";
              break;
            case 5:
              path = "/isacommunity/login";
              break;
            case 6:
              path = "/ems/login";
              break;
          }
        } else {
          path = "/login";
        }
      } else {
        preWeb.map((item) => {
          if (href.indexOf(item["website"]) != -1) {
            path = item["path"];
          }
        });
      }
      break;
    case "online":
      if (href.indexOf(urlObj["online"]) != -1) {
        if (TENANT_ID) {
          switch (TENANT_ID) {
            case 1:
              path = "/login";
              break;
            case 2:
              path = "/loginisa";
              break;
            case 3:
              path = "/logingroup";
              break;
            case 4:
              path = "/loginisacentre";
              break;
            case 5:
              path = "/isacommunity/login";
              break;
            case 6:
              path = "/ems/login";
              break;
          }
        } else {
          path = "/login";
        }
      } else {
        onlineWeb.map((item) => {
          if (href.indexOf(item["website"]) != -1) {
            path = item["path"];
          }
        });
      }
      break;
  }
  return path;
};
