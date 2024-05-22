"use client";
import { ExpenseService } from "@/lib/Services";
import {
  Category,
  Expense,
  ExpenseFrom,
  ExpenseTypeEnum,
} from "@/lib/interfaces";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { number, object, string } from "yup";

export default function ExpensesFrom({
  isEdit,
  editData,
  params,
}: {
  isEdit?: boolean;
  editData?: Expense;
  params?: string;
}) {
  const urlParams = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const categoryResponse = await fetch(
          "https://6480ae0af061e6ec4d49b390.mockapi.io/Categories"
        );

        const categoryData = await categoryResponse.json();
        setCategories(categoryData);
      } catch (error) {
        console.error("error while fetching the data");
      }
    };

    fetchExpenses();
  }, []);

  console.log("edit data", editData?.type);

  const initialValues: ExpenseFrom = {
    type: editData?.type ?? ExpenseTypeEnum.CashIn,
    date: editData?.date
      ? new Date(editData.date).toISOString().split("T")[0]
      : "",
    amount: editData?.amount ?? null,
    description: editData?.description ?? "",
    categoryId: editData?.categoryId ?? "",
  };

  const validationSchema = object({
    type: string().required("Expense type is required"),
    amount: number().required("Amount is required"),
    categoryId: string().required("Expense category is required"),
    date: string().required("Date type is required"),
  });

  const handelSubmit = async (
    values: ExpenseFrom,
    { setSubmitting, validateForm, setErrors }: FormikHelpers<ExpenseFrom>
  ) => {
    console.log("handel submit values", values);
    if (isEdit) {
      try {
        const response = await fetch(
          `https://6480ae0af061e6ec4d49b390.mockapi.io/expense_record/${urlParams.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...values }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Data updated successfully:", data);
          toast.success("Expenses updated successfully");
          router.push("/expenses");
        } else {
          console.error("Error retrieving data:", response.statusText);
          return null;
        }
      } catch (error: any) {}
    } else {
      try {
        const response = await fetch(
          "https://6480ae0af061e6ec4d49b390.mockapi.io/expense_record",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...values }),
          }
        );
        console.log("response", response);

        if (response.ok) {
          toast.success("Expenses added successfully");
          router.push("/expenses");
        } else {
          console.error("Error adding data:", response.statusText);
          toast.error("Error while adding expenses");
        }
      } catch (error: any) {
        toast.error("Error while adding expenses");
      }
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const response: any = await ExpenseService.deleteExpenseById(id);
      if (response.ok) {
        const data = await response.json();
        console.log("Data deleted successfully:", data);
        toast.success("Expenses deleted successfully");
        router.push("/expenses");
      } else {
        console.error("Error while deleting data:", response.statusText);
        return null;
      }
    } catch (error: any) {
      console.error("Error while deleting data:");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handelSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ errors, handleSubmit, setFieldValue, values, isSubmitting }) => {
        // console.log("formik errors", errors);
        // console.log("formik values", values);

        return (
          <React.Fragment>
            <Toaster />
            <div className=" d-flex justify-content-between align-items-center p-3  mb-5 bg-secondary text-blue">
              <h5 className="mx-auto fs-6 fw-bold mb-0 text-center">
                {isEdit ? "Edit" : "Add"} Expenses
              </h5>
              {isEdit && (
                <Button
                  onClick={() => {
                    deleteExpense(
                      typeof urlParams?.id === "string" ? urlParams?.id : ""
                    );
                  }}
                  className="text-white rounded-0 px-4 fs-6 custom-btn-primary"
                >
                  Remove
                </Button>
              )}
            </div>
            <Form className="" onSubmit={handleSubmit}>
              <div className="row mx-3">
                <div className="form-group mb-3">
                  <label htmlFor="type" className="mb-1 fw-medium">
                    Type <span className="text-body-tertiary">*</span>
                  </label>
                  {/* <Field as="select" name="type" className="form-control">
                    <option value="">Select Type</option>
                    <option value="Cash In">Cash In</option>
                    <option value="Cash Out">Cash Out</option>
                  </Field> */}
                  <div className="d-flex">
                    <Button
                      onClick={() => {
                        setFieldValue("type", ExpenseTypeEnum.CashIn);
                      }}
                      className={`text-white rounded-1 px-4 py-2  fs-6 flex-grow-1 fw-medium  ${
                        values.type === ExpenseTypeEnum.CashIn
                          ? "custom-btn-primary"
                          : "custom-btn-secondary"
                      } `}
                    >
                      Cash in
                    </Button>
                    <Button
                      onClick={() => {
                        setFieldValue("type", ExpenseTypeEnum.CashOut);
                      }}
                      className={`text-white rounded-1 px-4 py-2  fs-6 flex-grow-1 fw-medium ${
                        values.type === ExpenseTypeEnum.CashOut
                          ? "custom-btn-primary"
                          : "custom-btn-secondary"
                      } `}
                    >
                      Cash out
                    </Button>
                  </div>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-danger fs-12"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="categoryId" className="mb-1 fw-medium">
                    Category <span className="text-body-tertiary">*</span>
                  </label>
                  <Field as="select" name="categoryId" className="form-control">
                    <option value="">Select Category</option>
                    {categories.map((item: Category) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Field>
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className="text-danger fs-12"
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="amount" className="mb-1 fw-medium">
                    Amount <span className="text-body-tertiary">*</span>
                  </label>
                  <Field type="number" name="amount" className="form-control" />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-danger fs-12"
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="date" className="mb-1 fw-medium">
                    Date <span className="text-body-tertiary">*</span>
                  </label>
                  <Field type="date" name="date" className="form-control" />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="text-danger fs-12"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="mb-1 fw-medium">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-danger fs-12"
                  />
                </div>
              </div>
              <div className="d-flex mt-5 mb-2 mx-2 gap-2">
                <button
                  onClick={() => {
                    router.push("/expenses");
                  }}
                  type="button"
                  className="btn btn-outline-primary rounded-0 px-4 py-2 border-2  fs-6 flex-grow-1 fw-medium "
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="text-white rounded-0 px-4 fs-6 flex-grow-1  custom-btn-primary fw-medium"
                >
                  {isEdit ? "Update" : "Add"}
                </Button>
              </div>
            </Form>
          </React.Fragment>
        );
      }}
    </Formik>
  );
}
