// Rutas asociadas a miembros

import { Route } from "react-router-dom";
import Members from "../pages/members/Members";

const membersRoutes = (
  <>
    <Route path="/members" element={<Members />} />
  </>
);

export default membersRoutes;
