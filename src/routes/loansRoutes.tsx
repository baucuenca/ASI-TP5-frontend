// Rutas asociadas a préstamos

import { Route } from "react-router-dom";
import Loans from "../pages/loans/Loans";
import LoansCreate from "../pages/loans/LoansCreate";

const loansRoutes = (
  <>
    <Route path="/loans" element={<Loans />} />
    <Route path="/loans/new" element={<LoansCreate />} />
    {/* /loans/manage se agregará cuando exista */}
  </>
);

export default loansRoutes;
