import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { Loans } from "../models/user";
import { UiCtx } from "./ui-ctx";
import { UserCtx } from "./user-ctx";

type CtxType = {
  loansToFilter: Loans[];
  setLoansToFilter: React.Dispatch<React.SetStateAction<Loans[]>>;
  onConfirmLoan: (obj: Loans, which: string) => void;
  currentTransaction: Loans;
  setCurrentTransaction: React.Dispatch<React.SetStateAction<Loans>>;
};

export const LoanActionCtx = createContext<CtxType>({
  loansToFilter: [
    {
      loan_id: 0,
      lender: "",
      borrower: "",
      status: "",
      creation_date: "",
      due_date: "",
      amount: "",
      description: "",
      payment_date: "",
      transaction_rating: 0,
    },
  ],
  setLoansToFilter: () => {},
  onConfirmLoan: () => {},
  currentTransaction: {
    loan_id: 0,
    lender: "",
    borrower: "",
    status: "",
    creation_date: "",
    due_date: "",
    amount: "",
    description: "",
    payment_date: "",
    transaction_rating: 0,
  },
  setCurrentTransaction: () => {},
});

const LoanActionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userMgr = useContext(UserCtx);
  const uiMgr = useContext(UiCtx);
  const [loansToFilter, setLoansToFilter] = useState(userMgr.currentUser.loans);
  const [currentTransaction, setCurrentTransaction] = useState<Loans>({
    loan_id: 0,
    lender: "",
    borrower: "",
    status: "",
    creation_date: "",
    due_date: "",
    amount: "",
    description: "",
    payment_date: "",
    transaction_rating: 0,
  });
  console.log(currentTransaction);

  const onConfirmLoan = async (obj: Loans, which: string) => {
    uiMgr.dispatch({ type: "LOADING" });
    const reqObj = userMgr.currentUser.loans.find((objStored) => {
      return objStored.loan_id === obj.loan_id;
    });

    if (which === "approved") {
      if (reqObj) {
        reqObj.status = "approved";
      }
    } else if (which === "denied") {
      if (reqObj) {
        reqObj.status = "denied";
      }
    } else if (which === "paid") {
      if (reqObj) {
        reqObj.status = "paid";
        reqObj.payment_date = new Date().toISOString();
      }
    }
    // TEST END

    await axios
      .put(`/api/v1/loan`, reqObj)
      .then((serverRes) => {
        setLoansToFilter((prev) => {
          return prev.filter((objToRemove) => {
            return objToRemove.loan_id !== reqObj?.loan_id;
          });
        });
        uiMgr.dispatch({ type: "DASHBOARD" });
      })
      .catch((err) => {
        console.log(err);
        uiMgr.dispatch({ type: "DASHBOARD" });
      });
  };

  return (
    <LoanActionCtx.Provider
      value={{
        loansToFilter,
        setLoansToFilter,
        onConfirmLoan,
        currentTransaction,
        setCurrentTransaction,
      }}
    >
      {children}
    </LoanActionCtx.Provider>
  );
};

export default LoanActionProvider;
