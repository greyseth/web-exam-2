function PopupMessage({ image, message, buttons }) {
  return (
    <div className="popup-container">
      <div className="panel">
        {image ? <img src={image} /> : null}
        <h2>{message}</h2>

        <div className="actions-container">
          {buttons.map((b, i) => {
            return (
              <button key={i} onClick={b.action}>
                {b.display}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PopupMessage;
