import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

export default function App() {
  const [thumbId, setThumbId] = useState(0);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const getData = () => {
    axios
      .get("https://jsonplaceholder.typicode.com/photos?albumId=" + thumbId)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
  };
  const onSubmit = () => {
    getData();
  };

  const onChange = (value) => {
    if (value === "") {
      setData([]);
    }
    if (
      typeof Number(value) === "number" &&
      Number(value) < 101 &&
      Number(value) > 0
    ) {
      setError(false);
      setThumbId(Number(value));
    } else {
      setError(true);
    }
  };
  return (
    <div className="App">
      <input
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <button disabled={error} onClick={onSubmit}>
        {" "}
        submit{" "}
      </button>
      <br />
      <ul>
        {data && data.length
          ? data.map((item) => {
              return (
                <li>
                  {item.albumId} {item.title}
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
}
