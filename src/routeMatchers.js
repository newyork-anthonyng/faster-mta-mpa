import routes from "./routes.js";
import regexparam from "regexparam";

const routeMatchers = new Map();
for (const [routeName, expressRoute] of routes) {
    const regExp = regexparam(`mta${expressRoute}`).pattern;
    const matcher = ({ url }) => regExp.exec(url.pathname);
    routeMatchers.set(routeName, matcher);
}

export default routeMatchers;
