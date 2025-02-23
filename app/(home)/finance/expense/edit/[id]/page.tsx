import EditExpenseForm from "./EditExpenseForm";

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ExpensePage(props: PageProps) {
  const { id } = await Promise.resolve(props.params);
  
  return <EditExpenseForm id={id} />;
}