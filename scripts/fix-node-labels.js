require("dotenv").config();

const neo4j = require("neo4j-driver");

const FIXES = [
  {
    elementId: "4:b9cff839-4146-4184-b0c4-7b99954553c5:3",
    expectedName: "电机模块",
    targetLabel: "Module"
  },
  {
    elementId: "4:b9cff839-4146-4184-b0c4-7b99954553c5:22",
    expectedName: "红外发送模块",
    targetLabel: "Module"
  },
  {
    elementId: "4:b9cff839-4146-4184-b0c4-7b99954553c5:73",
    expectedName: "usart",
    targetLabel: "Module"
  },
  {
    elementId: "4:b9cff839-4146-4184-b0c4-7b99954553c5:20",
    expectedName: "温度传感器",
    targetLabel: "Device"
  },
  {
    elementId: "4:b9cff839-4146-4184-b0c4-7b99954553c5:33",
    expectedName: "8段数码管",
    targetLabel: "Device"
  },
  {
    elementId: "4:b9cff839-4146-4184-b0c4-7b99954553c5:66",
    expectedName: "蜂鸣器",
    targetLabel: "Device"
  },
  {
    elementId: "4:b9cff839-4146-4184-b0c4-7b99954553c5:84",
    expectedName: "LCD1602",
    targetLabel: "Device"
  }
];

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

async function main() {
  const session = driver.session({
    database: process.env.NEO4J_DB || "neo4j"
  });

  try {
    const repaired = [];

    for (const fix of FIXES) {
      const result = await session.run(
        `
        MATCH (n)
        WHERE elementId(n) = $elementId
        REMOVE n:Experiment
        SET n:$( $targetLabel )
        RETURN elementId(n) AS elementId, n.name AS name, labels(n) AS labels
        `,
        fix
      );

      if (result.records.length === 0) {
        repaired.push({
          elementId: fix.elementId,
          name: fix.expectedName,
          labels: ["NOT_FOUND"]
        });
        continue;
      }

      repaired.push({
        elementId: result.records[0].get("elementId"),
        name: result.records[0].get("name"),
        labels: result.records[0].get("labels")
      });
    }

    const leftovers = await session.run(`
      MATCH (n:Experiment)
      RETURN elementId(n) AS elementId, n.name AS name, labels(n) AS labels
      ORDER BY name
    `);

    console.log(
      JSON.stringify(
        {
          repaired,
          remainingExperimentNodes: leftovers.records.map(record => ({
            elementId: record.get("elementId"),
            name: record.get("name"),
            labels: record.get("labels")
          }))
        },
        null,
        2
      )
    );
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
