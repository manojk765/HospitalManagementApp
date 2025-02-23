import EditExpenseForm from "./EditExpenseForm";

type Params = Promise<{ id : string }>

export default async function ExpensePage( props : { params : Params } ) {
  const params = await props.params;
  
  const id  = params.id;
  
  return <EditExpenseForm id={id} />;
}
