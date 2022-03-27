import _ from "lodash";
import axios from "../axios";
import {
  methodDependency
} from "@/pages/analysis/dependence/ModuleDependence/components/ModuleDependenceTable/columns";
import { ReportMapper } from "@/pages/analysis/metrics/ModuleCouplingTree/Report";
import { storage } from "@/store/storage/sessionStorage";


export interface Module {
  id?: string;
  name: string;
  members: string[];
  status?: string;
}

export function queryModule() {
  return axios<Module[]>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: "/logic-modules",
    method: "GET",
  }).then((res) => _.orderBy(res, ["status", "name"], ["desc", "asc"]));
}

export function deleteModule(parameter: { id: string }) {
  return axios<any>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: `/logic-modules/${parameter.id}`,
    method: "DELETE",
  });
}

export function updateModule(parameter: Module) {
  return axios<any>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: `/logic-modules/${parameter.id}`,
    method: "PUT",
    data: parameter,
  });
}

export function createModule(parameter: {}) {
  return axios<any>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: "/logic-modules",
    method: "POST",
    data: parameter,
  });
}

export function queryModuleOptions() {
  return axios<string[]>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: "/base-modules",
    method: "GET",
  });
}

export function autoDefineModule() {
  return axios<any>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: "/logic-modules/auto-define",
    method: "POST",
  });
}

export function queryModuleDependencies(parameter: {}) {
  return axios<methodDependency[]>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: "/logic-modules/dependencies",
    method: "GET",
    params: parameter,
  });
}

export function queryModuleCoupling() {
  return axios<ReportMapper[]>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: "/logic-modules/metrics",
    method: "GET",
  });
}

export function hideAllModules() {
  return axios<any>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: "/logic-modules/hide-all",
    method: "POST",
  });
}

export function showAllModules() {
  return axios<any>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: "/logic-modules/show-all",
    method: "POST",
  });
}

export function reverseAllModules() {
  return axios<any>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: "/logic-modules/reverse-all",
    method: "POST",
  });
}

export function queryAllModuleDependence() {
  return axios<{
    nodes: {
      fullName: string;
      id: string;
      lgMembers: string[];
      logicModule: boolean;
      members: { name: string; fullName: string; type: string }[];
      mixture: boolean;
      name: string;
      nodeId: string;
      service: boolean;
      status: string;
      type: string;
    }[];
    edges: { a: string; b: string; num: number }[];
  }>({
    baseURL: `/api/systems/${(storage.getSystemId())}`,
    url: "/logic-modules/dependencies/graph",
    method: "GET",
  });
}
