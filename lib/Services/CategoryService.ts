export const deleteCategoryById = (id: string) => {
  return fetch(`https://6480ae0af061e6ec4d49b390.mockapi.io/Categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
