export default async function handler(req, res) {
  const GROUP_ID = "592394061";

  try {
    const response = await fetch(
      `https://groups.roblox.com/v1/groups/${GROUP_ID}`,
      {
        headers: {
          "User-Agent": "MYSIA-Central/1.0"
        },
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(`Roblox API returned ${response.status}`);
    }

    const data = await response.json();

    if (typeof data.memberCount !== "number") {
      throw new Error("Invalid member count received from Roblox");
    }

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({
      success: true,
      groupId: GROUP_ID,
      memberCount: data.memberCount,
      source: "Roblox Groups API"
    });

  } catch (error) {
    console.error("Roblox API error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to retrieve Roblox group member count"
    });
  }
}
