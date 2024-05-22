import ExpensesFrom from "@/components/Expenses/ExpensesFrom";

export default async function Page({ params }: { params: { id: string } }) {
  let editData;
  try {
    const response = await fetch(
      `https://6480ae0af061e6ec4d49b390.mockapi.io/expense_record/${params.id}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Data retrieved successfully:", data);
      editData = data;
    } else {
      console.error("Error retrieving data:", response.statusText);
      return null;
    }
  } catch (error: any) {}

  return <ExpensesFrom isEdit={true} editData={editData} />;
}
