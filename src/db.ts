import Dexie, { type Table } from 'dexie';

export interface Transaction {
  id?: number;
  date: string;
  category: string;
  item: string;
  vendor: string;
  amount: number;
  fromAccount: string;
  paidBy: string;
  createdAt: number;
}

export interface LookupItem {
  id?: number;
  name: string;
}

export class MyDatabase extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<LookupItem>;
  accounts!: Table<LookupItem>;
  payers!: Table<LookupItem>;

  constructor() {
    super('TransactionDB');
    this.version(3).stores({
      transactions: '++id, date, category, item, vendor, amount, fromAccount, paidBy, createdAt',
      categories: '++id, &name',
      accounts: '++id, &name',
      payers: '++id, &name'
    });
  }
}

export const db = new MyDatabase();

// Seed initial data
export const seedDatabase = async () => {
  try {
    const initialCategories = [
      'Furniture', 'Meal', 'Traffic', 'Glocery', 'Electricity', 
      'Telecom', 'Clothing', 'Personal Care', 'Cigarette', 
      'Water Fee', 'Air Ticket', 'Entertainment', 'Mobile'
    ];
    for (const name of initialCategories) {
      const exists = await db.categories.where('name').equals(name).first();
      if (!exists) await db.categories.add({ name });
    }

    const initialAccounts = [
      'BKK Bank', 'Cash', 'Mox Bank', 'HSBC World Debit Card', 
      'ZA Bank', 'Helen B Citi Card', 'Wise Virtual Card', 
      'K Bank', 'Line Pay Wallet', 'Rabbit'
    ];
    for (const name of initialAccounts) {
      const exists = await db.accounts.where('name').equals(name).first();
      if (!exists) await db.accounts.add({ name });
    }

    const initialPayers = ['Tony', 'Helen'];
    for (const name of initialPayers) {
      const exists = await db.payers.where('name').equals(name).first();
      if (!exists) await db.payers.add({ name });
    }
  } catch (error) {
    console.warn("Seeding encountered an issue (likely already seeded):", error);
  }
};
