import { createRouter, createWebHistory } from "vue-router";
import loginCompany from "@/components/companie-components/login-company.vue";
import companySession from "@/components/companie-components/company-session.vue";
import workers from "@/components/workers-components/workers.vue";
import loginWorker from "@/components/workers-components/login-worker.vue";
import newWorker from "@/components/workers-components/new-worker.vue";

const routes = [
  {
    path: "/",
    redirect: "/loginCompany"
  },
  {
    path: "/loginCompany",
    name: "loginCompany",
    component: loginCompany
  },
  {
    path: "/companySession",
    name: "companySession",
    component: companySession
  },
  {
    path: "/workers",
    name: "workers",
    component: workers,
    children: [
      {
        path: "login-worker",
        name: "loginWorker",
        component: loginWorker
      },
      {
        path: "new-worker",
        name: "newWorker",
        component: newWorker
      }
    ]
  }

]


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;