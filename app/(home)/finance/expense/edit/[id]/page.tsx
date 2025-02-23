import EditExpenseForm from "./EditExpenseForm";

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ExpensePage({ params }: PageProps) {
  const { id } = params;
  
  return <EditExpenseForm id={id} />;
}
