const express = require("express");
const { connectToEngine, openSession, endSession } = require("./qlik-engine");
const bodyParser = require("body-parser");
const CORS = require("cors");
const axios = require("axios");

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(CORS());

var global = null;
var currApp = null;
var base_url = null;

app.post("/connectToEngine", async (req, res) => {
  base_url = req.body.url;
  // console.log(req.body);
  if (global)
    return res.status(200).send({
      msg: "Already Connected to Qlik Engine",
      status: 1,
      data: null,
    });
  global = await connectToEngine(base_url);
  if (!global)
    return res.status(400).send({
      msg: "Unable to connect to Qlik Engine",
      status: 0,
      data: null,
    });
  return res.status(200).send({
    msg: "Connected to Qlik Engine",
    status: 1,
    data: null,
  });
});

app.get("/apps", async (req, res) => {
  if (!global)
    return res.status(400).send({
      msg: "Not connected to qlik engine",
      status: 0,
      data: null,
    });
  const qApps = await global.getDocList();
  return res.status(200).send({
    msg: "Qlik Sense Apps",
    status: 1,
    data: qApps,
  });
});

app.get("/app", async (req, res) => {
  if (!global)
    return res.status(400).send({
      msg: "Not connected to qlik engine",
      status: 0,
      data: null,
    });
  if (currApp) {
    endSession();
    global = await connectToEngine(base_url);
  }
  // global = await connectToEngine(url);

  const { appId } = req.query;
  currApp = await global.openDoc(appId);
  console.log(currApp);
  return res.status(200).send({
    msg: `App ${appId} has be opened`,
    status: 1,
    data: null,
  });
});

app.get("/getSheetObjects", async (req, res) => {
  if (!global)
    return res.status(400).send({
      msg: "Not connected to qlik engine",
      status: 0,
      data: null,
    });
  const qparams = {
    qInfo: {
      qType: "SheetList",
    },
    qAppObjectListDef: {
      qType: "sheet",
      qData: {
        title: "/qMetaDef/title",
        description: "/qMetaDef/description",
        thumbnail: "/thumbnail",
        cells: "/cells",
        // rank: "/rank",
        // columns: "/columns",
        // rows: "/rows",
      },
    },
  };

  const qSheets = await currApp.createSessionObject(qparams);
  const qSheetsLayout = await qSheets.getLayout();
  res.status(200).send({
    msg: `Sheet List`,
    status: 1,
    data: qSheetsLayout,
  });
});

app.get("/getMasterDimension", async (req, res) => {
  if (!global)
    return res.status(400).send({
      msg: "Not connected to qlik engine",
      status: 0,
      data: null,
    });
  const qparams = {
    qInfo: {
      qType: "DimensionList",
    },
    qDimensionListDef: {
      qType: "dimension",
      qData: {
        title: "/title",
        tags: "/tags",
        grouping: "/qDim/qGrouping",
        info: "/qDimInfos",
      },
    },
  };

  const qMasterDimension = await currApp.createSessionObject(qparams);
  const qMasterDimensionLayout = await qMasterDimension.getLayout();
  res.status(200).send({
    msg: `Dimension List`,
    status: 1,
    data: qMasterDimensionLayout,
  });
});

app.get("/getMasterMeasure", async (req, res) => {
  if (!global)
    return res.status(400).send({
      msg: "Not connected to qlik engine",
      status: 0,
      data: null,
    });
  const qparams = {
    qInfo: {
      qType: "MeasureList",
    },
    qMeasureListDef: {
      qType: "measure",
      qData: {
        title: "/title",
        tags: "/tags",
      },
    },
  };

  const qMasterMeasure = await currApp.createSessionObject(qparams);
  const qMasterMeasureLayout = await qMasterMeasure.getLayout();

  const masterMeasureProp = await Promise.all(
    qMasterMeasureLayout.qMeasureList.qItems.map(async (item) => {
      let qGenericMeasure = await currApp.getMeasure(item.qInfo.qId);
      let measureLayout = await qGenericMeasure.getProperties();
      return measureLayout;
    })
  );

  console.log(masterMeasureProp);

  res.status(200).send({
    msg: `Measure List`,
    status: 1,
    data: masterMeasureProp,
  });
});

app.get("/logout", async (req, res) => {
  if (!global) return res.status(400).send("Not connected to qlik engine");
  endSession();
  global = null;
  session = null;
  return res.status(200).send({
    msg: `Logged out`,
    status: 1,
    data: null,
  });
});

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
});
