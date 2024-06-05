import SearchIcon from "../assets/img/search.svg";

function SearchBar({ placeholder, data, setData, action, style }) {
  return (
    <div className="search-bar" style={style}>
      <input
        placeholder={placeholder}
        value={data}
        onChange={(e) => setData(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") action();
        }}
      />
      <img src={SearchIcon} onClick={action} />
    </div>
  );
}

export default SearchBar;
