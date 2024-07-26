import axios from "axios";
import apiURL from "../api_url";
import { useEffect, useState } from "react";
import "../style/hub.css";
import { getChatGPTResponse } from "../generaiveAI/gpt";

export default function Hub() {
  const api_url = apiURL();
  const [apps, setApps] = useState([]);
  const [qMeasureDef, setqMeasureDef] = useState([]);
  const [generatedEx, setgeneratedEx] = useState([]);
  const [currApp, setCurrApp] = useState("");

  function onClickHandler(e) {
    if (e.target.id !== currApp) {
      setqMeasureDef([]);
      setgeneratedEx([]);
    }
    const target = e.target;
    setCurrApp(target.id);
    axios
      .get(`${api_url}/app?appId=${target.id}`)
      .then(({ data }) => {
        if (data.status === 1) {
          axios
            .get(`${api_url}/getMasterMeasure`)
            .then(({ data }) => {
              setqMeasureDef(
                data.data.map((item) => ({
                  qlikEx: item.qMeasure.qDef,
                }))
              );
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function generateGPT() {
    const tempArr = [];

    Promise.all(
      qMeasureDef.map(async (item) => {
        const msg = `Convert the following Qlik set expression to Power BI Dax without generating any extra prompt :
    ${item.qlikEx}
    `;
        const gpt_response = await getChatGPTResponse(msg);
        // console.log(gpt_response);
        tempArr.push({
          qlikEx: item.qlikEx,
          DAX: gpt_response,
        });
      })
    ).then(() => {
      setgeneratedEx(tempArr);
      console.log(tempArr);
    });
  }

  useEffect(() => {
    axios
      .get(`${api_url}/apps`)
      .then(({ data }) => {
        if (data.status === 0) return 0;
        //   setApps(data.data);
        const qApps = data.data.map((item) => ({
          appId: item.qDocId,
          appName: item.qTitle,
        }));
        setApps(qApps);
        console.log(qApps);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div className="sheet-container">
        <div className="app-container">
          {apps.map((app, key) => (
            <div
              key={key}
              className="apps"
              id={app.appId}
              onClick={onClickHandler}
            >
              <div className="app-title">
                <span>{app.appName}</span>
              </div>
            </div>
          ))}
        </div>
        <div
          style={
            !currApp.length
              ? { display: "block", width: "80%" }
              : { display: "none", width: "80%" }
          }
        >
          Please select app
        </div>
        <div
          style={
            currApp.length
              ? { display: "block", width: "80%" }
              : { display: "none", width: "80%" }
          }
        >
          {!qMeasureDef.length ? (
            <div className="table-container">
              The App does not contain any valid set expression.
            </div>
          ) : (
            <div className="table-container">
              {qMeasureDef.length === 0 ? (
                <></>
              ) : (
                <table>
                  {generatedEx.length === 0 ? (
                    <thead>
                      <tr>
                        <th>Qlik Ex</th>
                      </tr>
                    </thead>
                  ) : (
                    <thead>
                      <tr>
                        <th>Qlik Ex</th>
                        <th>DAX</th>
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {generatedEx.length === 0
                      ? qMeasureDef.map((item) => (
                          <tr>
                            <td>{item.qlikEx}</td>
                          </tr>
                        ))
                      : generatedEx.map((item) => (
                          <tr>
                            <td>{item.qlikEx}</td>
                            <td>{item.DAX}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              )}
              {qMeasureDef.length === 0 ? (
                <></>
              ) : generatedEx.length === 0 ? (
                <button onClick={generateGPT} className="r-btn r-btn-active">
                  Generate
                </button>
              ) : (
                <button
                  onClick={generateGPT}
                  disabled
                  className="r-btn r-btn-disabled"
                >
                  Generate
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
