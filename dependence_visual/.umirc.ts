import { defineConfig } from "umi";

export default defineConfig({
  nodeModulesTransform: {
    type: "none",
    exclude: [],
  },
  hash: true,
  antd: {},
  dva: false,
  devServer: { port: 8080 },
  define: {
    "process.env.BUILD_TARGET": process.env.BUILD_TARGET,
  },
  lessLoader: { javascriptEnabled: true },
  proxy: {
    "/api": {
      target: "https://ec2-68-79-38-105.cn-northwest-1.compute.amazonaws.com.cn:10443/",
      changeOrigin: true,
      secure: false,
    },
  },
  routes: [
    { path: "/", redirect: "/multipleSystem" },
    { path: "/login", component: "@/pages/login" },
    { path: "/multipleSystem", component: "@/pages/multipleSystem" },
    {
      exact: false,
      path: "/:systemId",
      component: "@/components/Business/Layouts/PageLayout",
      routes: [
        {
          path: "systemSummary/Summary",
          component: "@/pages/systemSummary/Summary/Summary",
        },
        {
          path: "systemSummary/MeasureIndicators",
          component: "@/pages/systemSummary/MeasureIndicators/MeasureIndicators",
        },
        {
          path: "systemEvaluation/Redundancy",
          component: "@/pages/systemEvaluation/Redundancy/Redundancy",
        },
        {
          path: "systemEvaluation/SizingEvaluation",
          component: "@/pages/systemEvaluation/SizingEvaluation/SizingEvaluation",
        },
        {
          path: "systemEvaluation/CouplingEvaluation",
          component: "@/pages/systemEvaluation/CouplingEvaluation/CouplingEvaluation",
        },
        {
          path: "systemEvaluation/cohesionEvaluation",
          component: "@/pages/systemEvaluation/CohesionEvaluation/CohesionEvaluation",
        },
        {
          path: "analysis/metric/:type?",
          component: "@/pages/analysis/metrics",
        },
        {
          path: "analysis/dependence",
          component: "@/pages/analysis/dependence",
        },
        {
          path: "systemEvolving",
          component: "@/pages/systemEvolving/SystemEvolving",
        },
        {
          path: "systemEvolving/QualityGateProfile",
          component: "@/pages/systemEvolving/QualityGateProfile/QualityGateProfile",
        },
        {
          path: "help/:name?",
          component: "@/pages/help",
        },
        {
          path: "system-evaluation/report/:id",
          component: "@/pages/test/system-evaluation/report",
        },
        {
          path: "test/system-evaluation",
          component: "@/pages/test/system-evaluation",
        },
        {
          path: "test/retrofit-tools/plsql-to-kotlin",
          component: "@/pages/test/retrofit-tools/plsql2kotlin",
        },
        {
          path: "test",
          component: "@/pages/test",
        },
      ],
    },
  ],
  theme: {
    "@primary-color": "#3AAFAE",
  },
});
