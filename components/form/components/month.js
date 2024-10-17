import styles from "./inputs.module.css";

export function MonthInput(props) {
  const { cuestion } = props;

  const toDay = new Date().toISOString().slice(0, 7);

  const handleInputChange = (e) => {
    const selectedDate = e.target.value;
    var userTimezoneOffset = new Date().getTimezoneOffset();

    const originalDate = new Date(selectedDate);
    if (userTimezoneOffset < 0) {
      originalDate.setHours(originalDate.getHours() - 8);
    } else if (userTimezoneOffset > 0) {
      originalDate.setHours(originalDate.getHours() + 8);
    }

    const formattedDate = originalDate.toISOString();
    props.register(cuestion.name, {
      value: formattedDate,
      required: cuestion.require && "The field is required.",
    });
    props.setError(cuestion.name, {});
  };

  return (
    <div className={styles.inputGroup}>
      <input type="month" onChange={handleInputChange} max={toDay} />

      <label className={styles.label}>{cuestion.placeholder}</label>

      {props.errors[cuestion.name] && props.errors[cuestion.name].message && (
        <div>
          <span className={styles.danger}>
            {props.errors[cuestion.name].message}
          </span>
        </div>
      )}
    </div>
  );
}
