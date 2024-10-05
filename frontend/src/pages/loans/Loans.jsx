import React, { useEffect, useState } from "react";
import { getAsync } from "../../services/apiHandlerService";
import { LoansUrl } from "../../Constants";
import { Box, Divider, Modal, Typography } from "@mui/material";
import AppCard from "../../components/AppCard";
//import CreateProjectModal from "../../components/CreateProjectModal";
import Loading from "../../components/Loading";
import CreateLoanModal from "../../components/CreateLoanModal";

function Loans() {
  const loansNavigateUrl = "/loans";
  const [isLoading, setIsLoading] = useState(false);
  const [loans, setLoans] = useState([]);
  const [isCreateLoanMode, setCreateLoanMode] = useState(false);
  const closeCreateLoanModal = () => setCreateLoanMode(false);
  const [render, setRender] = useState(0);
  const reRender = () => setRender(render + 1);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await getAsync(LoansUrl);
      setLoans(response.payload);
      setIsLoading(false);
      console.log(response.payload);
    }
    fetchData();
    // eslint-disable-next-line
  }, [render]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Loans</Typography>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexFlow: "wrap",
        }}
      >
        {loans &&
          loans.length !== 0 &&
          loans.map((loan) => {
            return (
              <AppCard data={loan} url={loansNavigateUrl} key={loan._id} />
            );
          })}

        <AppCard
          action={() => setCreateLoanMode(true)}
          actionText={"Create New Loan"}
        />
      </Box>

      {/* Create new Loan Modal */}
      <Modal open={isCreateLoanMode} onClose={closeCreateLoanModal}>
        <CreateLoanModal
          path={LoansUrl}
          forceRender={reRender}
          closeModal={closeCreateLoanModal}
        />
      </Modal>

      {/* Loading Modal */}
      <Modal open={isLoading}>
        <Loading />
      </Modal>
    </Box>
  );
}

export default Loans;
