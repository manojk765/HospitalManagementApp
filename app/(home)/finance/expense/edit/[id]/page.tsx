import EditExpenseForm from "./EditExpenseForm";

// Update the type to reflect that params is a Promise
interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ExpensePage({ params }: PageProps) {
  // Destructure params after awaiting
  const { id } = await params;
  
  return <EditExpenseForm id={id} />;
}