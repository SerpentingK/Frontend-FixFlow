import { createRouter, createWebHistory } from "vue-router";
import loginCompany from "@/components/companie-components/login-company.vue";
import companySession from "@/components/companie-components/company-session.vue";
import workers from "@/components/workers-components/workers.vue";
import loginWorker from "@/components/workers-components/login-worker.vue";
import newWorker from "@/components/workers-components/new-worker.vue";
import workerProfile from "@/components/workers-components/worker-profile.vue";
import workersList from "@/components/workers-components/workers-list.vue";
import bills from "@/components/bill-components/bills.vue";
import billEntrance from "@/components/bill-components/bill-entrance.vue";
import billList from "@/components/bill-components/bill-list.vue";
import repairs from "@/components/bill-components/repairs.vue";
import deliveries from "@/components/bill-components/deliveries.vue";
import sales from "@/components/bill-components/sales.vue";
import outflows from "@/components/bill-components/outflows.vue";
import outs from "@/components/bill-components/outs.vue";

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
      },
      {
        path: "worker-profile",
        name: "workerProfile",
        component: workerProfile,
      },
      {
        path: "workers-list",
        name: "workersList",
        component: workersList,
      }
    ]
  },
  {
    path: "/bills",
    name: "bills",
    component: bills,
    redirect: "/bills/bill-entrance",
    children: [
      {
        path: "bill-entrance",
        name: "billEntrance",
        component: billEntrance,
      },
      {
        path: "bill-list",
        name: "billList",
        component: billList,
      },
      {
        path: "repairs",
        name: "repairs",
        component: repairs,
      },
      {
        path: "outflows",
        name: "outflows",
        component: outflows,
        redirect: "outflows/deliveries",
        children: [
          {
            path: "sales",
            name: "sales",
            component: sales,
          },
          {
            path: "deliveries",
            name: "deliveries",
            component: deliveries,
          },
          {
            path: "outs",
            name: "outs",
            component: outs,
          }
        ]
      }
]
  }

]


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;