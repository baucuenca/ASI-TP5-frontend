// Rutas asociadas a miembros

import { Route } from "react-router-dom";
import Members from "../pages/Members";

const membersRoutes = (
  <>
    <Route path="/members" element={<Members />} />
  </>
);

export default membersRoutes;
