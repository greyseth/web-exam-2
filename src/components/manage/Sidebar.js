function Sidebar({ buttons, curPage }) {
  return (
    <aside className="panel admin-sidebar">
      <h1>Admin Panel</h1>

      {buttons.map((b, i) => {
        return (
          <button
            key={i}
            onClick={b.action}
            disabled={curPage === b.disabledCheck}
          >
            {b.display}
          </button>
        );
      })}
    </aside>
  );
}

export default Sidebar;
