import styles from "./inputs.module.css";

export function DateInput(props) {
  const { cuestion } = props;

  const toDay = new Date().toISOString().slice(0, 16);

  const handleInputChange = (e) => {
    const selectedDate = e.target.value;
    const selectedDateTime = new Date(selectedDate);

    if (selectedDateTime <= toDay) {
      props.setError(cuestion.name, {
        message: `value must be ${toDay} or later`,
      });
    } else {
      props.register(cuestion.name, {
        value: selectedDateTime.toISOString(),
        required: cuestion.require && "The field is required.",
      });
      props.setError(cuestion.name, {});
    }
  };

  return (
    <div className={styles.inputGroup}>
      <input
        type="datetime-local"
        onChange={handleInputChange}
      />

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
