// Rutas asociadas a miembros

import { Route } from "react-router-dom";
import Members from "../pages/members/Members";
import MembersCreate from "../pages/members/MembersCreate";

const membersRoutes = (
  <>
    <Route path="/members" element={<Members />} />
    <Route path="/members/create" element={<MembersCreate />} />
  </>
);

export default membersRoutes;
