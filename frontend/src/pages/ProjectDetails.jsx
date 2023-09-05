import React from "react";
import { useParams } from "react-router-dom";

function ProjectDetails() {
  let data = {
    projects: [
      {
        projectId: "Id",
        name: "Project Name",
        description: "Project Desc",
        note: "",
        details: {},
        projectVendor: {
          userId: "",
          name: "Engineer Name",
          designation: "",
          contact: ["8975876987"],
        },
        projectVendorCost: 10,
        categories: [
          {
            categoryId: "Id",
            targetId: "Id",
            categoryDepth: 1,
            name: "category name",
            description: " category desc",
            note: "",
            categoryVendor: {
              userId: "",
              name: "Vendor Name",
              designation: "",
              contact: ["9975876987"],
            },
            categoryVendorCost: 5,
            subCategories: [
              {
                _Id: "Id",
                // targetId: "Id",
                // categoryDepth: 2,
                name: "category name",
                description: " category desc",
                note: "",
                subCategoryVendor: {
                  userId: "",
                  name: "Vendor Name",
                  designation: "",
                  contact: ["9975876987"],
                },
                subCategoryVendorCost: 5,
                transactions: [{}],
                categoryCost: 10,
                categoryBudget: 20,
              },
            ],
            transactions: [
              {
                transactionId: "Id",
                targetId: "Id",
                name: "",
                description: "",
                type: "", // Enum : Debit, Credit
                date: Date(),
                amount: 30,
                PaymentMode: "", // Enum : UPI, CASH
                source: "", // Enum : SBI, Canara,...
                paidTo: "", // Person Obj
                paidBy: "", // Person Obj
                status: "", // Enum : Pending, Paid, Inactive
              },
            ],
            categoryCost: 10,
            categoryBudget: 20,
          },
        ],
        transactions: [{}],
        projectCost: 100,
        projectBudget: 200,
      },
    ],
  };

  let { id } = useParams();
  return <div>Project Details : {id}</div>;
}

export default ProjectDetails;
