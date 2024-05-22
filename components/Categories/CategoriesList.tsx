"use client";
import { CategoryService } from "@/lib/Services";
import { Category, ICategoryForm } from "@/lib/interfaces";
import { ErrorMessage, Field, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { IoIosClose } from "react-icons/io";
import { object, string } from "yup";

export default function CategoriesList({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [allcategories, setAllCategories] = useState<Category[]>([]);
  const [show, setShow] = useState(false);
  const [deleteCategoryContent, setDeleteCategoryContent] =
    useState<Category>();
  const [fetchData, setFetchData] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await fetch(
          "https://6480ae0af061e6ec4d49b390.mockapi.io/Categories"
        );

        const categoryData = await categoryResponse.json();
        setAllCategories(categoryData);
      } catch (error) {
        console.error("error while fetching the data");
      }
    };
    fetchCategories();
  }, [fetchData]);

  const initialValues: ICategoryForm = {
    categoryName: "",
  };

  const validationSchema = object({
    categoryName: string()
      .required("Category Name is required")
      .min(3, "Minimun 3 characters length"),
  });

  const handelSubmit = async (
    values: ICategoryForm,
    {
      setSubmitting,
      validateForm,
      setErrors,
      setFieldValue,
    }: FormikHelpers<ICategoryForm>
  ) => {
    try {
      const categoryPayload = {
        name: values.categoryName,
        order: categories.length + 1,
        isMain: false,
      };
      const response = await fetch(
        "https://6480ae0af061e6ec4d49b390.mockapi.io/Categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...categoryPayload }),
        }
      );

      if (response.ok) {
        toast.success("Category added successfully");
        setFetchData(true);
        setFieldValue("categoryName", "");
        router.push("/category");
      } else {
        console.error("Error adding data:", response.statusText);
        toast.error("Error while adding category");
      }
    } catch (error: any) {
      toast.error("Error while adding category");
    }
  };

  const deleteCategory = async (id: string) => {
    if (id) {
      try {
        const response: any = await CategoryService.deleteCategoryById(id);
        if (response.ok) {
          const data = await response.json();
          const filteredValue = allcategories.filter((item: Category) => {
            return item.id !== id;
          });
          setAllCategories(filteredValue);
          console.log("Data deleted successfully:", data);
          toast.success("Category deleted successfully");
          setShow(false);
          // router.push("/category");
        } else {
          console.error("Error while deleting data:", response.statusText);
          toast.error("Error while deleting Category ");
          setShow(false);
          return null;
        }
      } catch (error: any) {
        console.error("Error while deleting data:");
        setShow(false);
      }
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
        return (
          <React.Fragment>
            <Form className="" onSubmit={handleSubmit}>
              <Toaster />

              <div className="d-flex justify-content-between align-items-center p-3 bg-secondary text-dark-blue">
                <h5 className="mx-auto fs-6 fw-bold mb-0">Categories List</h5>
              </div>
              <div className="container mt-3 ">
                <div className="mx-3">
                  <div>
                    {allcategories.map((item, index) => {
                      return (
                        <div key={item.id}>
                          <div className="d-flex">
                            <p className="text-primary fw-medium flex-grow-1 me-auto">
                              {item.name}
                            </p>
                            {!item.isMain && (
                              <IoIosClose
                                color="red"
                                onClick={() => {
                                  setShow(true);
                                  // deleteCategory(item.id);
                                  setDeleteCategoryContent(item);
                                }}
                              />
                            )}
                          </div>
                          <hr className=" border border-primary border-2" />
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <div className="form-group mb-3 mx">
                      <Field
                        type="text"
                        name="categoryName"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="categoryName"
                        component="div"
                        className="text-danger fs-12"
                      />
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      <Button
                        type="submit"
                        className={`text-white rounded-1 px-4 py-2  fs-6  fw-medium custom-btn-primary `}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* bottom button */}
              <div className="d-flex mt-5">
                <Button
                  type="button"
                  onClick={() => router.push("/expenses")}
                  className="text-white rounded-0 px-4 py-3  fs-6 flex-grow-1  custom-btn-secondary"
                >
                  Expense
                </Button>
                <Button
                  onClick={() => router.push("/category")}
                  className="text-white rounded-0 px-4 fs-6 flex-grow-1 custom-btn-primary"
                >
                  Category
                </Button>
              </div>
            </Form>

            <Modal
              className="rounded-3"
              show={show}
              onHide={() => {
                setShow(false);
              }}
              backdrop="static"
              keyboard={false}
              centered
            >
              <Modal.Body className="rounded-3 text-dark-blue">
                <ul>
                  <li>
                    {deleteCategoryContent?.name} category will be deleted
                  </li>
                </ul>
                <p className="ps-3"> Do you really want to remove ?</p>
                <div className="d-flex">
                  <Button
                    type="button"
                    onClick={() => setShow(false)}
                    className="text-white rounded-0 px-4 py-3  fs-6 flex-grow-1  custom-btn-secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      deleteCategory(deleteCategoryContent?.id ?? "")
                    }
                    className="text-white rounded-0 px-4 fs-6 flex-grow-1 custom-btn-primary"
                  >
                    Confirm
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          </React.Fragment>
        );
      }}
    </Formik>
  );
}
