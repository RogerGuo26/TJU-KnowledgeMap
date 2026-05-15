require("dotenv").config();

const express = require("express");
const path = require("path");
const neo4j = require("neo4j-driver");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const NODE_GROUP_OVERRIDES = new Map([
  ["电机模块", "Module"],
  ["红外发送模块", "Module"],
  ["8段数码管", "Device"],
  ["LCD1602", "Device"],
  ["温度传感器", "Device"],
  ["蜂鸣器", "Device"],
  ["usart", "Module"]
]);

const NODE_GROUP_KEYWORDS = [
  { pattern: /模块$/i, group: "Module" },
  { pattern: /(数码管|LCD|传感器|蜂鸣器)/i, group: "Device" },
  { pattern: /usart/i, group: "Module" }
];

function getNodeDisplayLabel(node) {
  return node.properties.name || node.properties.title || node.elementId;
}

function getNodeDisplayGroup(node) {
  const rawGroup = node.labels[0] || "Node";
  const displayLabel = getNodeDisplayLabel(node);

  if (NODE_GROUP_OVERRIDES.has(displayLabel)) {
    return NODE_GROUP_OVERRIDES.get(displayLabel);
  }

  if (rawGroup === "Experiment") {
    const matchedRule = NODE_GROUP_KEYWORDS.find(rule => rule.pattern.test(displayLabel));
    if (matchedRule) {
      return matchedRule.group;
    }
  }

  return rawGroup;
}

function toGraph(records) {
  const nodeMap = new Map();
  const edgeMap = new Map();

  for (const record of records) {
    const source = record.get("source");
    const target = record.get("target");
    const rel = record.get("rel");

    if (source && !nodeMap.has(source.elementId)) {
      nodeMap.set(source.elementId, {
        id: source.elementId,
        label: getNodeDisplayLabel(source),
        group: getNodeDisplayGroup(source),
        properties: source.properties
      });
    }

    if (target && !nodeMap.has(target.elementId)) {
      nodeMap.set(target.elementId, {
        id: target.elementId,
        label: getNodeDisplayLabel(target),
        group: getNodeDisplayGroup(target),
        properties: target.properties
      });
    }

    if (rel && source && target && !edgeMap.has(rel.elementId)) {
      edgeMap.set(rel.elementId, {
        id: rel.elementId,
        from: source.elementId,
        to: target.elementId,
        label: rel.type,
        arrows: "to",
        properties: rel.properties || {}
      });
    }
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges: Array.from(edgeMap.values())
  };
}

app.get("/api/hello", (req, res) => {
  res.json({ message: "后端启动成功" });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const serverInfo = await driver.getServerInfo();
    res.json({
      ok: true,
      address: serverInfo.address
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

app.get("/api/test-query", async (req, res) => {
  const session = driver.session({
    database: process.env.NEO4J_DB || "neo4j"
  });

  try {
    const result = await session.run("RETURN 'Neo4j 已连接' AS message");
    res.json({
      ok: true,
      result: result.records[0].get("message")
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  } finally {
    await session.close();
  }
});

app.post("/api/graph", async (req, res) => {
  const session = driver.session({
    database: process.env.NEO4J_DB || "neo4j"
  });

  try {
    const result = await session.run(`
      MATCH (source)-[rel]->(target)
      RETURN source, rel, target
    `);

    res.json(toGraph(result.records));
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

app.post("/api/search", async (req, res) => {
  const { keyword } = req.body;
  const session = driver.session({
    database: process.env.NEO4J_DB || "neo4j"
  });

  try {
    const result = await session.run(
      `
      MATCH (n)
      WHERE toLower(coalesce(n.name, n.title, "")) CONTAINS toLower($keyword)
      OPTIONAL MATCH (n)-[rel]-(m)
      RETURN n AS source, rel, m AS target
      LIMIT 50
      `,
      { keyword }
    );

    res.json(toGraph(result.records));
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

app.post("/api/expand", async (req, res) => {
  const { nodeId } = req.body;
  const session = driver.session({
    database: process.env.NEO4J_DB || "neo4j"
  });

  try {
    const result = await session.run(
      `
      MATCH (source)-[rel]-(target)
      WHERE elementId(source) = $nodeId
      RETURN source, rel, target
      LIMIT 50
      `,
      { nodeId }
    );

    res.json(toGraph(result.records));
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
