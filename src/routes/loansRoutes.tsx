// Rutas asociadas a préstamos

import { Route } from "react-router-dom";
import Loans from "../pages/loans/Loans";
import LoansCreate from "../pages/loans/LoansCreate";
import LoansManage from "../pages/loans/LoansManage";
import LoansUpdate from "../pages/loans/LoansUpdate";

const loansRoutes = (
  <>
    <Route path="/loans" element={<Loans />} />
    <Route path="/loans/new" element={<LoansCreate />} />
    <Route path="/loans/manage" element={<LoansManage />} />
    <Route path="/loans/update/:id" element={<LoansUpdate />} />
  </>
);

export default loansRoutes;
