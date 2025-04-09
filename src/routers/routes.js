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
import sales from "@/components/bill-components/sales.vue";
import outflows from "@/components/bill-components/outflows.vue";
import outs from "@/components/bill-components/outs.vue";
import shifts from "@/components/shifts-components/shifts.vue";
import premises from "@/components/premises-components/premises.vue";
import newPremise from "@/components/premises-components/new-premise.vue";
import selectPremise from "@/components/premises-components/select-premise.vue";

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
    path: "/premises",
    name: "premises",
    component: premises,
    redirect: "/premises/select-premise",
    children: [
      {
        path: "new-premise",
        name: "newPremise",
        component: newPremise
      },
      {
        path: "select-premise",
        name: "selectPremise",
        component: selectPremise
      }
    ]
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
    path: "/shifts",
    name: "shifts",
    component: shifts
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
        path: "outflows",
        name: "outflows",
        component: outflows,
        redirect: "outflows/sales",
        children: [
          {
            path: "sales",
            name: "sales",
            component: sales,
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