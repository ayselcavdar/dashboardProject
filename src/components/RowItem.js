import React from "react";
import {TTH, TTD} from '../styledComponents/styledComponents'

function RowItem({ item, setItem, currentItem }) {
  
  return (
    <table
      key={item.id}
      onClick={() => setItem(item)}
      style={{
        width: "100%",
        marginTop: "10px",
        background: `${
          item.id == currentItem.id ? "#fbf5d6" : "#ffffff"
        } 0% 0% no-repeat padding-box`,
        boxShadow: "0px 3px 6px #00000014",
        opacity: 1,
        padding: "10px",
        borderLeft: `10px solid ${
          item.active === "-" ? "#E9CF30" : "transparent"
        }`,
        cursor: "pointer",
        height:80,
      }}
    >
      <thead>
        <tr>
          <TTH>Date</TTH>
          <TTH>Type</TTH>
          <TTH>Bin ID</TTH>
          <TTH>Distance(m)</TTH>
          <TTH>Action</TTH>
        </tr>
      </thead>
      <tbody>
        <tr>
          <TTD>{item.date}</TTD>
          <TTD>{item.incident_type}</TTD>
          <TTD>{item.id}</TTD>
          <TTD>{item.distance}</TTD>
          <TTD style={{ minWidth: "235px" }}>{item.active}</TTD>
        </tr>
      </tbody>
    </table>
  );
}

export default RowItem;
