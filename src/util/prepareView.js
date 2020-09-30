import buildCompanies from "./view/buildCompanies";
import buildXAxis from "./view/buildXAxis";

export default function prepareView(model, { width, height, padding }) {
  const { xAxis, mapTo } = buildXAxis(model, { width, padding });
  const { companyViews, peopleViews } = buildCompanies(model, mapTo);

  return {
    companies: companyViews,
    people: peopleViews,
    height,
    model,
    padding,
    width,
    xAxis,
  };
}
