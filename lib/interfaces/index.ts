export enum ExpenseTypeEnum {
  CashIn = "Cash In",
  CashOut = "Cash Out",
}

export interface Category {
  id: string;
  name: string;
  isMain: boolean;
  order: number;
}

export interface Expense {
  id: number;
  type: ExpenseTypeEnum;
  //   category: Category;
  date: Date;
  amount: number;
  description: string;
  categoryId: string;
}

export interface ExpenseFrom {
  type: ExpenseTypeEnum | undefined;
  date: Date | string;
  amount: number | null | undefined;
  description: string;
  categoryId: string;
}
