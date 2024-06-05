function NumberSelector({ data, setData, max, customFunction }) {
  function handleIncrement(incvalue) {
    if (setData != null && data != null) {
      if (incvalue === -1 && data <= 0) {
        setData(0);
        return;
      }

      if (max) {
        if (incvalue === 1 && data >= max) {
          setData(max);
          return;
        }
      }

      setData(data + incvalue);
    }
  }

  return (
    <div className="number-selector">
      <button
        disabled={data <= 0}
        onClick={(e) => {
          handleIncrement(-1);
          if (customFunction) customFunction();
        }}
      >
        -
      </button>
      <p>{data ?? 0}</p>
      <button
        disabled={data >= max}
        onClick={(e) => {
          handleIncrement(1);
          if (customFunction) customFunction();
        }}
      >
        +
      </button>
    </div>
  );
}

export default NumberSelector;
