// Rutas asociadas a miembros

import { Route } from "react-router-dom";
import Members from "../pages/members/Members";
import MembersCreate from "../pages/members/MembersCreate";
import MembersManage from "../pages/members/MembersManage";
import MembersUpdate from "../pages/members/MembersUpdate";

const membersRoutes = (
  <>
    <Route path="/members" element={<Members />} />
    <Route path="/members/create" element={<MembersCreate />} />
    <Route path="/members/manage" element={<MembersManage />} />
    <Route path="/members/update/:id" element={<MembersUpdate />} />
  </>
);

export default membersRoutes;
