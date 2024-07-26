export default function Button(props) {
  return (
    <>
      <button className={props.class} id={props.id} onClick={props.action}>
        {props.title}
      </button>
    </>
  );
}
