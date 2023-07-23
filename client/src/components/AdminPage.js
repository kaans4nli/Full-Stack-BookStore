import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'reactstrap';

const AdminPage = () => {

  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("admin");
    if (!auth) {
      navigate("/adminlogin");
    }
    else {

      axios.get("https://localhost:5001/api/Log/LogList")
        .then((result) => { setLogs(result.data.list); })
        .catch((error) => console.log(error.message));

    }

  }, []);


  return (
    <div style={{ height: "100vh" }}>

      <div style={{ marginTop: "0px" }}>
        <h3 style={{ marginLeft: "5px", marginTop: "10px" }}>Admin Page</h3>
      </div>

      <Table id='table' style={{ marginTop: "20px", backgroundColor: "#f0ece2" }}>
        <thead style={{ borderBottom: "1px solid black" }}>
          <tr>
            <th>
              #
            </th>
            <th>
              Log
            </th>
            <th>
              Date
            </th>
          </tr>
        </thead>

        <tbody>

          {
            logs && logs.length > 0 ?
              logs.map((item) =>
                <Fragment>
                  <tr>
                    <th scope="row">
                      {item.id}
                    </th>
                    <td>
                      {item.text}
                    </td>
                    <td>
                      {item.date}
                    </td>

                  </tr>
                </Fragment>
              )
              :
              <tr>
                <th scope="row">
                </th>
                <td>
                  No Logs Available
                </td>
                <td>
                </td>
              </tr>
          }

        </tbody>

      </Table>



    </div>
  )
}

export default AdminPage;
