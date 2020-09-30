import buildCompanies from "./view/buildCompanies";
import buildXAxis from "./view/buildXAxis";
import buildRoutes from "./view/buildRoutes";

export default function prepareView(model, { width, height, padding }) {
  const { xAxis, mapTo } = buildXAxis(model, { width, padding });
  const companyViews = buildCompanies(model, mapTo);
  const routes = buildRoutes(model, companyViews, mapTo);

  return {
    companies: companyViews,
    height,
    model,
    padding,
    routes,
    width,
    xAxis,
  };
}
