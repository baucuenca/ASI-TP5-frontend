// Rutas asociadas a miembros

import { Route } from "react-router-dom";
import Loans from "../pages/loans/Loans";

const loansRoutes = (
  <>
    <Route path="/loans" element={<Loans />} />
  </>
);

export default loansRoutes;
