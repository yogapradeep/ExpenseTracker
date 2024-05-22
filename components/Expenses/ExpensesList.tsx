"use client";
import { Category, Expense } from "@/lib/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Toaster } from "react-hot-toast";

export default function ExpensesList() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          "https://6480ae0af061e6ec4d49b390.mockapi.io/expense_record"
        );

        const data = await response.json();
        setExpenses(data);

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

  // console.log("expenses", expenses);
  // console.log("categories", categories);

  const getCategoryNameById = (id: string) => {
    const category = categories.find(
      (category: Category) => category.id === id
    );
    return category ? category.name : "";
  };

  return (
    <div className="">
      <Toaster />
      <div className="d-flex justify-content-between align-items-center p-3 bg-secondary text-blue">
        <h5 className="mx-auto fs-6 fw-bold mb-0">Expense Tracking</h5>
        <Button
          onClick={() => {
            router.push("/expenses/new");
          }}
          className="text-white rounded-0 px-4 fs-6 custom-btn-primary"
        >
          Add
        </Button>
      </div>
      <div className="container mt-3">
        <div className=" d-flex flex-column">
          {expenses.map((expense: Expense) => (
            <div
              onClick={() => {
                router.push(`/expenses/${expense.id}/edit`);
              }}
              key={expense.id}
              className={`expense-item bg-secondary-subtle m-2 p-3 rounded-2 `}
            >
              <div
                className={
                  " d-flex align-items-center  justify-content-between"
                }
              >
                <div> {getCategoryNameById(expense.categoryId)}</div>
                <div
                  className={
                    expense.type == "Cash In" ? "text-success" : "text-danger"
                  }
                >
                  <span> {expense.type == "Cash In" ? " + " : " - "}</span>₹
                  {expense.amount}
                </div>
              </div>
              <div>
                <div>{expense.description ?? "-"}</div>

                <div className="">
                  {new Date(expense.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex mt-3">
        <Button className="text-white rounded-0 px-4 py-3  fs-6 flex-grow-1 custom-btn-primary ">
          Expense
        </Button>
        <Button
          onClick={() => router.push("/category")}
          className="text-white rounded-0 px-4 fs-6 flex-grow-1 custom-btn-secondary"
        >
          Category
        </Button>
      </div>
    </div>
  );
}
