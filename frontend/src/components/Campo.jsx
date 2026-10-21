// Recibe datos por props y avisa al padre cuando cambia el input.
export default function Campo(props) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={props.id}>
        {props.etiqueta}
      </label>
      <input
        id={props.id}
        className={"form-control" + (props.error ? " is-invalid" : "")}
        type={props.tipo || "text"}
        value={props.valor}
        required={props.requerido !== false}
        min={props.min}
        step={props.step}
        maxLength={props.maxLength}
        autoComplete={props.autoComplete || "off"}
        onChange={function (event) {
          props.cambiar(event.target.value);
        }}
        aria-invalid={Boolean(props.error)}
        aria-describedby={props.id + "-error"}
      />
      <div id={props.id + "-error"} className="invalid-feedback">
        {props.error}
      </div>
    </div>
  );
}
